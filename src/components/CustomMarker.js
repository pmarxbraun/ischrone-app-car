import React from "react";
import {Marker, Popup} from 'react-leaflet';
import L from 'leaflet'
import { hereCredentials } from "../modules/here";

var svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">

          <circle cx="50" cy="50" r="50" fill="#60b01a"/>

          </svg>`

var iconUrl = 'data:image/svg+xml;base64,' + btoa(svg);


var greenIcon = new L.Icon({
    iconUrl: iconUrl,
    iconSize: [6, 10],
    iconAnchor: [3, 10],
    popupAnchor: [1, -34],
  });


class CustomMarker extends React.Component {

  state={
    isSearch:false,
    infos : null
  }

  convertSecToHours = (sec) => {
    let hours = sec / 3600
    hours = Math.floor(hours)

    let minutes = (sec - (3600 * hours))/60
    minutes = Math.floor(minutes)

   return (`${hours} h ${minutes} mn`)
}

  routing = () => {
    var infos = {}

    const promise = fetch(`https://route.api.here.com/routing/7.2/calculateroute.json?waypoint0=${this.props.position}&waypoint1=${this.props.wastePoint}&mode=fastest%3Btruck&app_id=${hereCredentials.id}&app_code=${hereCredentials.code}`)
    .then(x =>  x.json())

    Promise.resolve(promise).then(res => {infos = {
      time : res.response.route[0].summary.trafficTime,
      dist : res.response.route[0].summary.distance,
      }

      console.log(res)

      this.setState({infos : infos})
    })


  }

  render(){
    return  (
      <Marker position={this.props.position}
              icon={greenIcon}
        >
          <Popup>
          <p>{this.props.client}</p>
          <p>{this.props.adress}</p>
          <button
          onClick={()=> this.routing() }>Calcul</button>
          {
            this.state.infos && 
            <div>
              <p>Distance : {this.state.infos.dist / 1000} km</p>
              <p>Temps : {this.convertSecToHours(this.state.infos.time)}</p>
              <p>Emission CO2 : {+((this.state.infos.dist / 1000)*1.09).toFixed(2)} KG</p>
            </div>
          }
          </Popup>
      </Marker>)
          }
}

export default CustomMarker;