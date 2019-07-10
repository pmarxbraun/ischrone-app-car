import React from "react";
import {Marker, Popup} from 'react-leaflet';
import L from 'leaflet'

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

  var isSearch = false

const CustomMarker = props => {
    return  <Marker position={props.position}
                    icon={greenIcon}
            >
                <Popup>
                <p>{props.adress}</p>
                <button
                onClick={()=> isSearch = !isSearch }>Calcul</button>
                {
                  isSearch && <p>OK</p>
                }
                </Popup>
            </Marker>
}

export default CustomMarker;