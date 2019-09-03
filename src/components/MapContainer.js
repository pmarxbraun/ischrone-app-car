import React from 'react';
import { Map, TileLayer, Marker, Polygon, Popup, withLeaflet } from 'react-leaflet';
import { hereTileUrl } from '../modules/here';
import L from 'leaflet'
import PrintControlDefault from 'react-leaflet-easyprint';
import CustomMarker from './CustomMarker'
import MarkerClusterGroup from 'react-leaflet-markercluster';

import clientsData from '../modules/data'

delete L.Icon.Default.prototype._getIconUrl;

var blueIcon = new L.Icon({
   iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
   iconSize: [25, 41],
   iconAnchor: [12, 41],
   popupAnchor: [1, -34],
   shadowSize: [41, 41]
 });

var greenIcon = new L.Icon({
   iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
   iconSize: [25, 41],
   iconAnchor: [12, 41],
   popupAnchor: [1, -34],
   shadowSize: [41, 41]
 });

 var orangeIcon = new L.Icon({
   iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
   iconSize: [25, 41],
   iconAnchor: [12, 41],
   popupAnchor: [1, -34],
   shadowSize: [41, 41]
 });

 var purpleIcon = new L.Icon({
   iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
   iconSize: [25, 41],
   iconAnchor: [12, 41],
   popupAnchor: [1, -34],
   shadowSize: [41, 41]
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



                  <MarkerClusterGroup onClick={()=>{}} onMouseOver={()=>{}}>
                  {
                     this.state.clients.map((client, idx) => {

                           return <CustomMarker key={idx} 
                                                position={[client.latitude,client.longitude]} 
                                                adress = {client.adress}
                                                client = {client.client}
                                                wastePoint={this.props.center}
                                       />


                     })
                  }
                  </MarkerClusterGroup>


                  {
                     this.props.markers.map((marker, index) => {
                        var icon = ''
                        if(marker.name === 'Sonolub'){
                           icon=purpleIcon
                        }else if(marker.name === 'VEOLIA'){
                           icon=blueIcon
                        }else if(marker.name === 'SMAB'){
                           icon = orangeIcon
                        }else{
                           icon = greenIcon
                        }
                        return <Marker
                           icon={icon}
                           position={marker.coords}
                           draggable={false}
                           ref={this.marker}
                           
                        >
                           <Popup>{marker.name}</Popup>
                        </Marker>
                     }
                     )
                  }

                  {
                     this.props.isoThirdReduce.length > 0 &&

                     <Polygon 
                        positions={this.props.isoThirdReduce}
                        color="#cf0808"
                        className='IsoOne'
                        options
                     >

                     </Polygon>

                  }

                  {
                     this.props.isoSecReduce.length > 0 &&
                     <Polygon
                        positions={this.props.isoSecReduce}
                        color="#e89923"
                     >
                     </Polygon>
                  }

                  {
                     this.props.isoFirstReduce.length > 0 &&
                     <Polygon
                        positions={this.props.isoFirstReduce}
                        color="#d3d938"
                     >
                     </Polygon>
                  }

                  {
                     this.props.polygon.length > 0 &&
                     <Polygon
                        positions={this.props.polygon}
                        color="#31a833"
                     >
                     </Polygon>
                  }




                  <PrintControl ref={(ref) => { this.printControl = ref; }} position="topleft" title='Imprimer' sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} />
                  <PrintControl position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} title="Exporter en PNG" exportOnly />
               </Map>


            </div>
       )
    }
 }