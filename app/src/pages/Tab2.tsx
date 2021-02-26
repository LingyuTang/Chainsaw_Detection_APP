import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, {  } from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from '../components/marker'
import './Tab2.css';
import { Geolocation } from '@ionic-native//geolocation';
import { refreshOutline } from 'ionicons/icons';

export async function getApiData(url: string) {
  var responseJson: any;
  await fetch(url).then((response) => {
    if (response.ok) {
      responseJson = response.json()
    } else {
      throw new Error('Something went wrong');
    }
  }).catch((error) => {
    console.log(error)
  });
  return responseJson
}

class Tab2 extends React.Component {

  state = {
    center: {
      lat: -37.798535,
      lng: 144.960605
    },

    locationList: [{ lat: -33.886452, lon: 151.192950, time: '' },
    { lat: -33.888517, lon: 151.205116, time: '' }],
    change: false,
  }

  defaultZoom = 15;
  geo = Geolocation;

  async componentDidMount() {
    await this.getLocation();
  }


  async getLocation() {
    const infoPage = 'http://149.28.186.14/api/chainsaw-api/'
    // for testing in local
    //const infoPage = 'http://127.0.0.1:8000/api/chainsaw-api/'
   
    try {
      var location = (await this.geo.getCurrentPosition()).coords;
      if (location !== undefined && location !== null) {
        this.setState({
          center: {
            lat: location.latitude,
            lng: location.longitude
          },
        })
      }

      var json = await getApiData(infoPage);
      if (json !== undefined && json !== null) {
        this.setState({
          locationList: json,
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Chainsaw Map</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large" style={{ color: '#428f53' }}>Chainsaw Map</IonTitle>
            </IonToolbar>
          </IonHeader>
          <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: "AIzaSyBnWUe58_5FLelSPTbqbC2ENvIxgMQmQRk" }}
              center={this.state.center}
              defaultZoom={this.defaultZoom}
            >
              {this.state.locationList.map((location, index) => {
                return (<Marker key={index}
                  lat={location.lat}
                  lng={location.lon}
                />)
              })}
            </GoogleMapReact>
          </div>
          <IonFab
            vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton color="light" onClick={()=> this.getLocation()}>
              <IonIcon icon={refreshOutline} />
            </IonFabButton>
          </IonFab>

        </IonContent>
      </IonPage>
    );
  }
};

export default Tab2;
