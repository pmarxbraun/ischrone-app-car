import React from 'react';
import { Map, TileLayer, Marker, Polygon, Popup, withLeaflet } from 'react-leaflet';
import { hereTileUrl } from '../modules/here';
import L from 'leaflet'
import {   Button   } from "semantic-ui-react";
import PrintControlDefault from 'react-leaflet-easyprint';
import CustomMarker from './CustomMarker'
import MarkerClusterGroup from 'react-leaflet-markercluster';

import clientsData from '../modules/data'

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


 const PrintControl = withLeaflet(PrintControlDefault);





export default class MapContainer extends React.Component {

    constructor(props) {
       super(props);
       this.marker = React.createRef();
       this.map = React.createRef();

       this.state = {
          clients : [],
          loading : true
       }
    }

    componentDidMount() {
       this.setState({clients : clientsData})
    }
    
 
 
    render() {
       
       return (
          <div>

             <Map
                  center={this.props.center}
                  zoom={parseInt(this.props.options.zoom)}
                  zoomControl={false}
                  attributionControl={this.props.index === 8}
                  preferCanvas={true}
                  maxZoom={24}
               >
                  <TileLayer
                     url={hereTileUrl(this.props.style)}
                  />



                  <MarkerClusterGroup onClick={()=>console.log('okok')} onMouseOver={()=>console.log('nn')}>
                  {
                     this.state.clients.map((client, idx) => {

                           return <CustomMarker key={idx} 
                                                position={[client.latitude,client.longitude]} 
                                                adress = {client.adress}
                                                wastePoint={this.props.center}
                                       />


                     })
                  }
                  </MarkerClusterGroup>


                  {
                     this.props.markers.map((marker, index) => 
                        <Marker
                           position={marker.coords}
                           draggable={false}
                           ref={this.marker}
                           
                        >
                           <Popup>{marker.name}</Popup>
                        </Marker>
                     )
                  }

                  {
                     this.props.polygon.length > 0 &&
                     <Polygon
                        positions={this.props.polygon}
                        color="#2DD5C9"
                     />
                  }

                  <PrintControl ref={(ref) => { this.printControl = ref; }} position="topleft" title='Imprimer' sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} />
                  <PrintControl position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} title="Exporter en PNG" exportOnly />
               </Map>


            </div>
       )
    }
 }