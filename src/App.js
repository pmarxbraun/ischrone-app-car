import React, { Component } from 'react';
import './App.css'
import MapContainer from './components/MapContainer'
import { maxIsolineRangeLookup, hereIsolineUrl } from "./modules/here";
import {
    Button,
    Label,
    Form,
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
                    },
                    {
                    coords : [48.384035, 2.963927],
                    name : 'SMAB',
                    polygon: [],
                    },
                    {
                    coords : [49.311205, 1.014449],
                    name : 'Sonolub',
                    polygon: [],
                    },
                    {
                    coords : [48.948978, 2.299089],
                    name : 'Sevia',
                    polygon: [],
                    }
                ],
            },
            options: {
                zoom: 8,
                type: 'distance',
                range: 10000,
                mode: 'truck',
                traffic: 'enabled',
                style: 'reduced.day',
                time: new Date().toISOString()
            },
            clientsCoords : [],
            selectedAdressIndex : 0,
            displayCalendar:false,
            isolineInfos:[]
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
        }, () => {
           this.updateIsolines();
        });
     
     }

    updateIsolines = () => {
        let isolines = []
        const promise =  fetch(hereIsolineUrl(this.state.wastePoints.infos[this.state.selectedAdressIndex].coords,
                                              this.state.options))
                            .then(x => x.json());
                            
        Promise.resolve(promise).then(res => {
           isolines = res.response.isoline[0].component[0].shape;
           isolines = isolines.map(x => [x.split(',')[0], x.split(',')[1]])
           this.setState({ isolineInfos : isolines})
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
                    <div className="selectAdress">
                        <Label size='large' color='teal'>Choix du site</Label>
                            {
                                this.state.wastePoints.infos.map((value, index) => {
                                    return <Button
                                                color={ this.state.selectedAdressIndex === index && 'violet'}
                                                key={index}
                                                onClick={() => this.handleSelectAdress(index)}
                                            >
                                            {value.name}
                                            </Button>

                                })
                            }
                    </div>

                    <div className="controls">

                    <div>
                    <label htmlFor="type">Distance / Durée</label>
                    <select
                       id="type"
                       value={this.state.options.type}
                       onChange={this.handleFormChange}
                    >
                       <option value="time">Secondes</option>
                       <option value="distance">Mètres</option>
                    </select>
     
                    </div>
                    <div>
                        <label htmlFor="range">
                        Valeur ({parseInt(this.state.options.range).toLocaleString()}) 
                            {
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
                        type="range"
                        min="1"
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

                        </div>
                        
                    </div>
        
                    <div                         
                    ref={this.mapBlock}>

                        <MapContainer
                            center={this.state.wastePoints.infos[this.state.selectedAdressIndex].coords}
                            options={this.state.options}
                            polygon={this.state.isolineInfos}
                            style={this.state.options.style}
                            markers={this.state.wastePoints.infos}
                            indexSelected={this.state.selectedAdressIndex}
                        />
                    
                    </div>
                   
                    
                
                </div>                  
                    

        );
    }
}
