import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import DarkSkyApi from 'dark-sky-api';
import CurrentLocation from './Map';

const mapStyles = {
  width: '100%',
  height: '100%'
};


var the_weather;
var the_temperature;



//let position;
// DarkSkyApi.apiKey = '66f0e2e0c9db25690560088e286aa4c7';
// DarkSkyApi.proxy = true;
//
// DarkSkyApi.loadCurrent()
//   .then(result => console.log(result));



export class MapContainer extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {}
  };

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

    onClose = props => {
      if(this.state.showingInfoWindow) {
        this.setState({
          showingInfoWindow: false,
          activeMarker: null
        });
      }
    };
  render() {
    return(
    navigator.geolocation.getCurrentPosition(function(position){
      var url = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/66f0e2e0c9db25690560088e286aa4c7/' + position.coords.latitude + ',' + position.coords.longitude;
      fetch(url, {
        method: "GET",
        //mode: "no-cors",
      })
      .then((resp) => resp.json())
      .then(function(data){
        console.log(data);
        the_weather = "Weather: " + data.currently.summary;
        var humidity_data = data.currently.humidity;
        var windspeed_data = data.currently.windSpeed;
        humidity_data = humidity_data * 100;
        var the_humidity = "\nHumidity: " + humidity_data + "%"
        var the_windspeed = "\nWindspeed: " + windspeed_data + "mph";
        the_temperature = data.currently.apparentTemperature;
        the_temperature = "\nTemperature: " + the_temperature + " F";
        var weather_window = document.createElement("textarea");
        var node = document.createTextNode(the_weather);
        weather_window.appendChild(node);
        var the_second_node = document.createTextNode(the_temperature);
        weather_window.appendChild(the_second_node);
        var humidity_node = document.createTextNode(the_humidity);
        weather_window.appendChild(humidity_node);
        var windspeed_node = document.createTextNode(the_windspeed);
        weather_window.appendChild(windspeed_node);
        weather_window.style.position = "absolute";
        weather_window.style.zIndex = 2;
        weather_window.style.right = 0;
        weather_window.style.top = "12%";
        weather_window.style.width = "15%";
        weather_window.style.height = "20%";

        var x = document.getElementsByTagName("BODY")[0];
        x.appendChild(weather_window);
        //console.log(data.currently.summary);
      });
    }),
      <CurrentLocation
        centerAroundCurrentLocation
        google={this.props.google}
      >
        <Marker onClick={this.onMarkerClick} name={'Local weather in current location'} />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </CurrentLocation>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBYhOeoQKVFl9KxmSXY5vdhKoVP_4prg9Y'
})(MapContainer);
