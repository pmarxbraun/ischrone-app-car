import React, { Component } from 'react';
import './App.css'
import MapContainer from './components/MapContainer'
import { maxIsolineRangeLookup, hereIsolineUrl } from "./modules/here";
import {
    Button,
    Label,
    Form,
    Dimmer,
    Loader
  } from "semantic-ui-react";
  import DatetimePicker from 'react-semantic-datetime';
  import moment from 'moment';
  //import debounce from 'debounce';



export default class App extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            wastePoints : {
                infos : [
                    {
                    coords : [48.975307, 1.752872],
                    name : 'VEOLIA',
                    polygon: [],
                    color : 'blue'
                    },
                    {
                    coords : [48.384035, 2.963927],
                    name : 'SMAB',
                    polygon: [],
                    color : 'orange'
                    },
                    {
                    coords : [49.311205, 1.014449],
                    name : 'Sonolub',
                    polygon: [],
                    color : 'violet'
                    },
                    {
                    coords : [48.948978, 2.299089],
                    name : 'Sevia',
                    polygon: [],
                    color : 'green'
                    }
                ],
            },
            options: {
                zoom: 7,
                type: 'time',
                range: 14400,
                mode: 'truck',
                traffic: 'enabled',
                style: 'reduced.day',
                time: new Date().toISOString()
            },
            clientsCoords : [],
            selectedAdressIndex : 0,
            displayCalendar:false,
            isolineInfos:[],
            isoFirstReduce:[],
            isoSecReduce:[],
            isoThirdReduce:[],
            loading: true,
        }

        this.mapBlock = React.createRef()
    
    }

    handleSelectAdress = (value) => {
        this.setState({selectedAdressIndex : value}, ()=>{ this.updateIsolines() })
    }

    handleFormChange = (event) => {
        const option = event.target.id;
        const value = event.target.value;
        const copy = this.state.options;
        if (option === 'type' && this.state.options.range > maxIsolineRangeLookup[value]) {
           copy.range = maxIsolineRangeLookup[value];
        }
        copy[option] = value;
        
        this.setState({
           options: copy
        }/*, () => {
           this.updateIsolines();
        }*/);
     
     }

    updateIsolines = () => {

        this.setState({loading : true })

        let isolines = [];
        let isoFirst = [];
        let isoSec = [];
        let isoThird = [];

        let isoReduceFirstOpt = {
                                    zoom: this.state.options.zoom,
                                    type: 'time',
                                    range: 10800,
                                    mode: 'truck',
                                    traffic: 'enabled',
                                    style: this.state.options.style,
                                    time: this.state.options.time
                                }
        let isoSecOpt =     {
                                zoom: this.state.options.zoom,
                                type: 'time',
                                range: 7200,
                                mode: 'truck',
                                traffic: 'enabled',
                                style: this.state.options.style,
                                time: this.state.options.time
                            }
        let isoThirdOpt =     {
                                zoom: this.state.options.zoom,
                                type: 'time',
                                range: 3600,
                                mode: 'truck',
                                traffic: 'enabled',
                                style: this.state.options.style,
                                time: this.state.options.time
                            }

        const promise =  fetch(hereIsolineUrl(this.state.wastePoints.infos[this.state.selectedAdressIndex].coords,
                                              this.state.options))
                            .then(x => x.json());
        
        const isoReduceOne =  fetch(hereIsolineUrl(this.state.wastePoints.infos[this.state.selectedAdressIndex].coords,
                                              isoReduceFirstOpt))
                            .then(x => x.json());

        const isoReduceSec =  fetch(hereIsolineUrl(this.state.wastePoints.infos[this.state.selectedAdressIndex].coords,
            isoSecOpt))
              .then(x => x.json());

        const isoReduceThird =  fetch(hereIsolineUrl(this.state.wastePoints.infos[this.state.selectedAdressIndex].coords,
            isoThirdOpt))
                .then(x => x.json());
                            
        Promise.resolve(promise).then(res => {
           isolines = res.response.isoline[0].component[0].shape;
           isolines = isolines.map(x => [x.split(',')[0], x.split(',')[1]])
           this.setState({ isolineInfos : isolines})
        });

        Promise.resolve(isoReduceOne).then(res => {
            isoFirst = res.response.isoline[0].component[0].shape;
            isoFirst = isoFirst.map(x => [x.split(',')[0], x.split(',')[1]])
            this.setState({ isoFirstReduce : isoFirst})
         });

         Promise.resolve(isoReduceSec).then(res => {
            isoSec = res.response.isoline[0].component[0].shape;
            isoSec = isoSec.map(x => [x.split(',')[0], x.split(',')[1]])
            this.setState({ isoSecReduce : isoSec})
         });

         Promise.resolve(isoReduceThird).then(res => {
            isoThird = res.response.isoline[0].component[0].shape;
            isoThird = isoThird.map(x => [x.split(',')[0], x.split(',')[1]])
            this.setState({ isoThirdReduce : isoThird, loading : false})
         });

     }

     convertSecToHours = (sec) => {
         let hours = sec / 3600
         hours = Math.floor(hours)

         let minutes = (sec - (3600 * hours))/60
         minutes = Math.floor(minutes)

        return (`${hours} h ${minutes} mn`)
     }
     
     componentDidMount = () => {
        this.updateIsolines();
     }


    render() {

        const max = this.state.options.type === 'distance' ?
        maxIsolineRangeLookup.distance :
        maxIsolineRangeLookup.time;

        const sliderVal = this.state.options.range > max ? max : this.state.options.range;

        return (
                <div>
                    <h2>Carte isochrone camions</h2>


                    <div className="selectAdress">
                        <Label size='large' color='teal'>Choix du site</Label>
                            {
                                this.state.wastePoints.infos.map((value, index) => {
                                    return <Button
                                                color={ this.state.selectedAdressIndex === index && this.state.wastePoints.infos[index].color}
                                                key={index}
                                                onClick={() => this.handleSelectAdress(index)}
                                            >
                                            {value.name}
                                            </Button>

                                })
                            }
                    </div>

                    <div className="controls">

                    {/*<div>
                    <label htmlFor="type">Distance / Durée</label>
                    <select
                       id="type"
                       value={this.state.options.type}
                       onChange={this.handleFormChange}
                    >
                       <option value="time">Heures</option>
                       <option value="distance">Kilomètres</option>
                    </select>
     
                    </div>
                    <div>
                        <label htmlFor="range">
                        Valeur ({this.convertSecToHours(this.state.options.range)}) 
                            {/*
                                this.state.options.type === 'distance'
                                ?
                                <p>{Math.round(this.state.options.range / 1000)} km</p>
                                :
                                <p>{ this.convertSecToHours(this.state.options.range) }</p>
                            }
                        </label>
                        <input
                        id="range"
                        onChange={this.handleFormChange}
                        type="number"
                        step="1800"
                        min="0"
                        max={max}
                        value={sliderVal}
                        />
                    </div>
            
                    <div>
                        <label htmlFor="zoom">Zoom Level ({this.state.options.zoom})</label>
                        <input
                        id="zoom"
                        onChange={this.handleFormChange}
                        type="range"
                        min="1"
                        max="16"
                        value={this.state.options.zoom}
                        />
                    </div>*/}
                    <div >
                        <div style={{display:'flex'}}><div style={{width:'8px', height:'8px', backgroundColor:'#cf0808', marginRight:'3px', marginTop:'3px'}}></div><p style={{fontSize:'10px'}}>0 à 1 heure</p></div>
                        <div style={{display:'flex'}}><div style={{width:'8px', height:'8px', backgroundColor:'#e89923', marginRight:'3px', marginTop:'3px'}}></div><p style={{fontSize:'10px'}}>1 à 2 heures</p></div>
                        <div style={{display:'flex'}}><div style={{width:'8px', height:'8px', backgroundColor:'#d3d938', marginRight:'3px', marginTop:'3px'}}></div><p style={{fontSize:'10px'}}>2 à 3 heures</p></div>
                        <div style={{display:'flex'}}><div style={{width:'8px', height:'8px', backgroundColor:'#31a833', marginRight:'3px', marginTop:'3px'}}></div><p style={{fontSize:'10px'}}>3 à 4 heures</p></div>
                    </div>
                    <div>
                        <label htmlFor="style">Map Style</label>
                        <select
                            id="style"
                            onChange={this.handleFormChange}
                            value={this.state.options.style}
                        >
                            <option value="reduced.day">Reduced Day </option>
                            <option value="reduced.night">Reduced Night</option>
                            <option value="normal.day">Normal Day</option>
                            <option value="normal.night">Normal Night</option>
                        </select>
                    </div>

                    {<div>
                        <Button
                            onClick={() => {this.setState({displayCalendar :! this.state.displayCalendar})}}
                        >Selectionner une date</Button>


                        {
                            this.state.displayCalendar &&
                            <div>
                                <Form.Input
                                action={{ color: 'teal', icon: 'calendar' }}
                                actionPosition="left"
                                value={moment(this.state.options.time).format('MMMM Do YYYY, h:mm:ss a')}
                                fluid
                                />
                                <DatetimePicker

                                    onChange={value => {
                                        let copy = this.state.options;
                                        copy.time = value.toISOString()
                                        this.setState({ options : copy})
                                    }} // Mandatory
                                    value={moment(this.state.options.time).format('MMMM Do YYYY, h:mm:ss a')} // Mandatory
                                    time={true} // optional to show time selection, just a date picket if false (default:true)
                                />
                            </div>
                        }
                    </div>}

                        <div >
                            <Button color='linkedin'
                                    onClick={()=> {
                                                    this.setState({loading : true})
                                                    this.updateIsolines()
                                                }
                                            }>Envoyer ces valeurs</Button>
                        </div>
                        
                    </div>
        
                    {
                        this.state.loading 
                        ?

                        <Dimmer active inverted>
                            <Loader >Chargement des données</Loader>
                        </Dimmer>

                        :
                    <div                         
                    ref={this.mapBlock}>

                        <MapContainer
                            center={this.state.wastePoints.infos[this.state.selectedAdressIndex].coords}
                            options={this.state.options}
                            polygon={this.state.isolineInfos}
                            isoFirstReduce={this.state.isoFirstReduce}
                            isoSecReduce = {this.state.isoSecReduce}
                            isoThirdReduce = {this.state.isoThirdReduce}
                            style={this.state.options.style}
                            markers={this.state.wastePoints.infos}
                            indexSelected={this.state.selectedAdressIndex}
                        />
                    
                    </div>
                    }
                   
                    
                
                </div>                  
                    

        );
    }
}
