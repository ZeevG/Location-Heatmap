import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux'


import './index.css';
import {radiusStops, colorStops} from './config';

mapboxgl.accessToken = 'pk.eyJ1IjoiemVldmciLCJhIjoiT2xwMkpPdyJ9.STg6dXxS96h9ZwuZ9aHauQ';

class MapComponent extends Component {

  constructor(props) {
    super(props);
    this.elementId = "map" + Date.now();
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.elementId,
      style: 'mapbox://styles/mapbox/dark-v9',
      center: this.props.startingCoords,
      zoom: 12
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.on('load', this.onLoad);
  }

  componentWillUnmount() {
    this.map.remove();
  }

  onLoad = () => {
    this.map.addSource('location', {
      "type": "geojson",
      "data": this.props.geoJsonUrl
    });

    this.map.addLayer({
      "id": "location-heat",
      "type": "heatmap",
      "source": "location",
      "maxzoom": 15,
      "paint": {
        //Increase the heatmap weight based on frequency and property magnitude
        "heatmap-weight": {
          "property": "count",
          "type": "exponential",
          "stops": [
          [0, 0],
          [6, 1]
          ]
        },
        //Increase the heatmap color weight weight by zoom level
        //heatmap-ntensity is a multiplier on top of heatmap-weight
        "heatmap-intensity": {
          "stops": [
          [0, 1],
          [15, 3]
          ]
        },
        //Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        //Begin color ramp at 0-stop with a 0-transparancy color
        //to create a blur-like effect.
        "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0, "rgba(209,229,240, 0)",
        0.1, "rgb(209,229,240)",
        0.3, "rgb(103,169,207)",
        0.5, "rgb(253,219,199)",
        1, "rgba(178,24,43, 0.6)"
        ],
        //Adjust the heatmap radius by zoom level
        "heatmap-radius": {
          "stops": [
          [0, 2],
          [9, 10],
          ]
        },
        //Transition from heatmap to circle layer by zoom level
        "heatmap-opacity": {
          "default": 1,
          "stops": [
          [6, 0.7],
          [13, 0.2],
          [15, 0]
          ]
        },
      }
    }, 'waterway-label');

    this.map.addLayer({
      "id": "location-point",
      "type": "circle",
      "source": "location",
      "minzoom": 9,
      "paint": {
        //Size circle raidus by count magnitude and zoom level
        "circle-radius": {
          "property": "count",
          "type": "exponential",
          "stops": radiusStops[4]
        },
        //Color circle by earthquake magnitude
        "circle-color": {
          "property": "count",
          "type": "exponential",
          "stops": colorStops[4]
        },
        //Transition from heatmap to circle layer by zoom level
        "circle-opacity": {
          "stops": [
          [8, 0],
          [12, 0.4]
          ]
        }
      }
    }, 'waterway-label');

  }


  render() {
    return (<div id={this.elementId}></div>);
  }
}

function ConditionalMap(props) {
  if (props.geoJsonUrl) {
    return (<MapComponent geoJsonUrl={props.geoJsonUrl} startingCoords={props.startingCoords}/>);
  }
  return null;
}


function mapStateToProps(state) {
  return { 
    geoJsonUrl: state.geoJsonUrl,
    startingCoords: state.startingCoords
  }
}
const MapContainer = connect(mapStateToProps)(ConditionalMap)


export default MapContainer