import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonAlert, IonImg, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonToast } from '@ionic/react';
import { Media } from "@ionic-native/media";
import './Tab1.css';
import React from 'react';
import { isPlatform } from '@ionic/react';
import { File } from '@ionic-native/file';
import { Geolocation } from '@ionic-native//geolocation';
import { arrowUpCircleOutline, micCircleOutline, pauseCircleOutline, playCircleOutline } from 'ionicons/icons';


class Tab1 extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.createRecorder()
  }

  state = {
    isRecording: false,
    showAlert: false,
    alertMessage: '',
    alertHeader: '',
    showToast: false,
    toastMsg: '',
  }

  recorder = Media.create('file.wav');
  audio_context = new (window.AudioContext)();
  recordedAudio = '';
  file = File
  geo = Geolocation

  async getSongFile() {
    var path;
    if (isPlatform('ios')) {
      path = this.file.readAsDataURL(this.file.tempDirectory, "temp.wav");
    } else {
      path = this.file.readAsDataURL(this.file.dataDirectory, "temp.wav");
    } 
    const response = await fetch(await path)
    var audio_file = await response.arrayBuffer()
    const audio_buffer = await this.audio_context.decodeAudioData(await audio_file)
    return audio_buffer
  }

  createRecorder() {
    try {
      var filePath;
      if (isPlatform('ios')) {
        filePath = this.file.tempDirectory.replace(/^file:\/\//, '') + 'temp.wav'
      } else {
        filePath = this.file.dataDirectory + 'temp.wav';
      }
      this.recorder = Media.create(filePath);
      this.recorder.onError.subscribe(error => console.log('Error!', error));;
    } catch (e) {

    }
  }

  async getMFCC() {
    var audio_buffer = await this.getSongFile()

    const Meyda = require('meyda')
    let mono_channel = audio_buffer.getChannelData(0)
    let buffer_size = 512
    let hop_size = 256
    let secs = Math.floor(audio_buffer.duration / 1)
    var data_chunks: Array<Float32Array> = []
    for (var i = 0; i < secs*188; i++) {
      var chunk;
      if (i === 0) {
        chunk = mono_channel.slice(i * buffer_size, (i + 1) * buffer_size)
      } else {
        var start = i * (buffer_size - hop_size)
        var end = (i + 1) * (buffer_size - hop_size)
        chunk = mono_channel.slice(start, end)
      }
      let result = Meyda.extract('mfcc', chunk)
      Array.prototype.push.apply(data_chunks, result)
     
    }
    
    this.sendMfcc(data_chunks.slice(400, 2249 * secs+400), secs-1)
    return data_chunks.slice(0, 2249 * secs)
  }

  async sendMfcc(mfccArray: Array<Float32Array>, seconds: number) {
    if(seconds<1){
      this.setState({
        showToast: true,
        toastMsg: "The audio is short for predicting, please record again"
      });
      return
    }
   
    const infoPage = 'http://149.28.186.14/app/perdict'
    // for testing in local
    //const infoPage = 'http://127.0.0.1:8000/app/perdict'
    var location = (await this.geo.getCurrentPosition()).coords;
    try {
      await fetch(infoPage, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          "mfcc": mfccArray,
          "secs": seconds,
          "lat": location.latitude,
          "lon": location.longitude
        })
      }).then((response) => response.json())
        .then((data) => {
          const status = data.status;

          var msg
          if (status === "Success" || status === "Error") {
            if (data['result'] === true) {
              msg = 'This is sound of chainsaw, we will mark it on the map. Thank you!'
            } else {
              msg = 'This is not sound of chainsaw, thank you!'
            }
            this.setState({
              showAlert: true,
              alertMessage: msg,
              alertHeader: "Predict Result"
            })
            if(status === "Error") console.log("Error")
            this.recorder.release();
          } else {
            this.setState({
              showAlert: true,
              alertMessage: "Error during transcation ",
              alertHeader: "Error"
            })
          }
        })
    } catch (e) {
      this.setState({
        showAlert: true,
        alertMessage: "Error during prediction ",
        alertHeader: "Error"
      })
    }
  }

  recordComponent() {
    if (!this.state.isRecording) {
      return (
        <IonButton onClick={(() => { this.startAudioRecording() })} color='light'>
          <IonIcon icon={micCircleOutline}></IonIcon>
          Record
        </IonButton>
      )
    } else {
      return (
        <IonButton onClick={(() => { this.stopAudioRecording() })} color='light'>
          <IonIcon icon={pauseCircleOutline}></IonIcon>
          Stop
        </IonButton>
      )
    }
  }

  startAudioRecording() {
    this.recorder.release();
    this.recorder.startRecord();

    setTimeout(() => {
      if(this.state.isRecording){
      this.stopAudioRecording();
      this.setState({
        showToast: true,
        toastMsg: "Stop recording because 5 seconds audio is enough for detecting chainsaw, thank you for your recording!"
      });}
    }, 6000);
    
    this.setState({ isRecording: true });
  }

  stopAudioRecording() {
    this.recorder.stopRecord();
    this.setState({ isRecording: false });
  }

  playRecording() {

    this.recorder.seekTo(0);
    this.recorder.play();
  }

  render() {
    return (
      <IonPage >
        <IonAlert
          isOpen={this.state.showAlert}
          onDidDismiss={() => this.setState({ showAlert: false })}
          header={this.state.alertHeader}
          message={this.state.alertMessage}
          buttons={['OK']}
        />
        <IonToast
          isOpen={this.state.showToast}
          onDidDismiss={() => this.setState({ showToast: false })}
          message={this.state.toastMsg}
          duration={2000}
        />
        <IonHeader >
          <IonToolbar  >
            <IonTitle>Recording</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen id='content'>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large" style={{ color: '#428f53' }}>Recording</IonTitle>
            </IonToolbar>
          </IonHeader>
          <br></br>
          <br></br>
          <IonCard style={{ boxShadow: 'none' }}>
            <IonImg src={"assets/img/forest.jpg"} />
            <br></br>
            <IonCardHeader>
              <IonCardTitle id='cardTitle'>
                Did you hear the chainsaw noise?
              </IonCardTitle>
              <br></br>
              <IonCardSubtitle id='cardSubTitle'>
              Please record the chainsaw sounds and send to us. Help us prevent bushfire.
              </IonCardSubtitle>
            </IonCardHeader>
            <br></br>
            <IonCardContent style={{ textAlign: 'center' }}>
              {this.recordComponent()}
              <IonButton onClick={(() => { this.playRecording() })} color='light'>
                <IonIcon icon={playCircleOutline}></IonIcon>
              Play
              </IonButton>
              <IonButton onClick={(() => { this.getMFCC() })} style={{ "--background": '#428f53' }}>
                <IonIcon icon={arrowUpCircleOutline}></IonIcon>
                Send
                </IonButton>
            </IonCardContent>
          </IonCard>

        </IonContent>
      </IonPage >
    );

  }
}

export default Tab1;
