import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'leaflet';
import { basemapLayer, featureLayer } from 'esri-leaflet';
import mapboxgl from 'mapbox-gl'

import EnlargeSide from './EnlargeSide.js';

import {setSideTop} from '../action-creators/paneActions.js';

const L = window.L;
console.log(L);

var accessToken = 'pk.eyJ1IjoibHNpc3R1ZGVyIiwiYSI6ImNqY3NkeGhmYjBjOHkzMHQ2azQ2eng5N2kifQ.X9MtZX_O0rUT1bMB31nXTQ';

class SGeo extends Component {
//const STImages = function (props) {
  constructor(props) {
   super(props);
   this.state = {
      lng: -0.3027728,
      lat: 51.4772129,
      zoom: 10
    };
 }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      //style: 'mapbox://styles/mapbox/cjaudgl840gn32rnrepcb9b9g',
      style: 'mapbox://styles/mapbox/light-v9',
      center: [lng, lat],
      zoom
    });

    this.map.on('load', () => {
        this.map.addSource('dem', {
            "type": "raster-dem",
            "url": "mapbox://mapbox.terrain-rgb"
        });
        this.map.addLayer({
            "id": "hillshading",
            "source": "dem",
            "type": "hillshade",
            "hillshade-exaggeration": 1
        // insert below waterway-river-canal-shadow;
        // where hillshading sits in the Mapbox Outdoors style
        });
    });

    this.marker = new mapboxgl.Marker()
      .setLngLat([lng,lat])
      .addTo(this.map);

    this.map.on('move', () => {
      const { lng, lat } = this.map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: this.map.getZoom().toFixed(2)
      });
    });
  }

  shouldComponentUpdate(nextProps){
    //console.log(this.props.site.siteId, nextProps.site.siteId);
    return this.props.site.siteId !== nextProps.site.siteId ;
  }

  componentDidUpdate(){
    var lng = this.props.site.siteObj.g_longitude;
    var lat = this.props.site.siteObj.g_latitude;

    if (lng){
    this.setState({
        lng: this.props.site.siteObj.g_longitude,
        lat: this.props.site.siteObj.g_latitude,
      });

    this.map.setCenter([lng, lat]);
    this.marker.setLngLat([lng,lat]);

    }

  }



    render(){
      const { lng, lat, zoom } = this.state;

    return (
      <div style={{height:this.props.hi}} >
        <div ref={el => this.mapContainer = el} style={{position:'absolute', top:'70px'+this.props.hi, height:{.66*this.props.hi}, width:'100%'}} />
        <EnlargeSide loc='bottom' />
        {this.props.site.siteObj.g_longitude &&
        <div style={{position: 'absolute', top: this.props.hi*2, paddingLeft: '10px'}}>
          {this.props.site.siteName}<br/>
          place holder
        </div>
        }
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    pane: state.pane,
    nav: state.nav,
    res: state.res,
    site: state.site,
    img: state.img
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setSideTop: (type, tab) => {
        dispatch(setSideTop(type, tab));
    },
  }
}

const SGeoSide = connect(mapStateToProps, mapDispatchToProps)(SGeo);

export default SGeoSide;
