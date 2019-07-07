import React from "react";
import {Marker, Popup} from 'react-leaflet';
import L from 'leaflet'


var greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
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