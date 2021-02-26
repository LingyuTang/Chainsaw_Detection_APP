import { IonAvatar, IonImg } from '@ionic/react';
import React from 'react';

class Marker extends React.Component<any, any>{
    render()
    {
        return(
            <IonAvatar style = {{backgroundColor:'white',width:'30px',height:'auto'}}>
            <IonImg style ={{padding:'3px'}} src={'assets/icon/chainsaw-red.png'} ></IonImg>
            </IonAvatar>
        )
    }
}
export default Marker;