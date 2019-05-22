import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import DarkSkyApi from 'dark-sky-api';
import CurrentLocation from './Map';



const mapStyles = {
  width: '100%',
  height: '100%'
};
var initial_lat;
var initial_lng;

navigator.geolocation.getCurrentPosition(function(position){
  initial_lat = position.coords.latitude;
  initial_lng = position.coords.longitude;
  //console.log(the_lat);
})

// class Gobutton extends Component {
//
//   render(){
//     return(
//       //<div id="big">
//       <button style={{position: "absolute", zIndex: 4, top: "24%", left: "2%"}} onClick={this.props.clickHandler}>
//         Go!
//       </button>
//     //  <MapContainer />
//       //</div>
//     )
//   }
// }
class Weather extends Component {
  render(){
    return(
      <textarea id="weather_report" style={{position: "absolute", zIndex: 2, right: 0, top: "12%", width: "15%", height: "20%"}} value={this.props.value}>
      </textarea>
    )
  }
}


class Country extends Component {
  constructor(props){
    super(props);
    this.state = {
      countries: [],
    };
  };

  componentDidMount(){
    const that = this;
    fetch("https://weather-location-api.herokuapp.com/country/", {
      method: "GET",
      mode: "cors",
    })
    .then(response => response.json())
    .then(function(data){
      //console.log(data.response);
      var the_country = [];
      for(var i = 0; i < data.response.length; i++)
      {
        the_country[i] = data.response[i].country;
      }
      that.setState({countries: the_country});
      for(var k = 0; k < that.state.countries.length; k++)
      {
        let the_option = document.createElement('option');
        the_option.setAttribute("value", that.state.countries[k]);
        let the_text = document.createTextNode(that.state.countries[k]);
        the_option.appendChild(the_text);
        document.getElementById("myCountry").appendChild(the_option);
      }

      var first_country_select = document.createElement('option');
      first_country_select.setAttribute("value", "");
      first_country_select.setAttribute("disabled", true);
      first_country_select.setAttribute("selected", true);
      first_country_select.setAttribute("hidden", true);
      var placetext = document.createTextNode("Please select your country..");
      first_country_select.appendChild(placetext);
      document.getElementById("myCountry").appendChild(first_country_select);
      //weather_window.style.width = "15%";
      //console.log(the_country);
    });
  }
  render(){
    return(
      <select style={{position: "absolute", zIndex: 2, left: "1%", top: "11%", width: "16%", height: "30px"}} id="myCountry" onChange={this.props.onChange}>
      </select>
    )
  }
}

class City extends Component {
  constructor(props){
    super(props);
    this.state = {
      cities: [],
    };
  };

  render(){
    return(
      <select style={{position: "absolute", zIndex: 2, left: "1%", top: "16%", width: "16%", height: "30px"}} id="myCity" onChange={this.props.onChange}>
        <option value="" disabled selected hidden>Please select city ..</option>
      </select>
    )
  }
}
export class MapContainer extends Component {
  constructor(props){
    super(props);
  this.state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    lat: initial_lat,
    lng: initial_lng,
    text_value: "",
    marker_name: "Your current location"
  };
  this.outputEvent = this.outputEvent.bind(this);
  this.country_changed = this.country_changed.bind(this);
  this.city_changed = this.city_changed.bind(this);
};

  // getInitialState : function() {
  //   return {
  //     lat : 20,
  //     lng  : 40
  //   };
  // },

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

    outputEvent(event) {
// the event context comes from the Child
      this.setState({lat: 43.65,
           lng: -79.3849 });

        console.log("Hello");
        console.log(this.state.lat);
    };

    city_changed(event){
      const that = this;
      var country_select = document.getElementById("myCountry");
      var city_select = document.getElementById("myCity");
      //country_select.onchange = function() {
      var the_selected_country = country_select.options[country_select.selectedIndex].text;
      var the_selected_city = city_select.options[city_select.selectedIndex].text;
      this.setState({marker_name: the_selected_city});
      var location_url = "https://weather-location-api.herokuapp.com/country/" + the_selected_country + "/" + the_selected_city;
      fetch(location_url, {
        method: "GET",
        mode: "cors",
      })
      .then(response => response.json())
      .then(function(data){
        console.log(data.response[0]);
        that.setState({
          lat: data.response[0].latitude,
          lng: data.response[0].longitude
        });
      })
      .then(function(){
      console.log(that.state.lat);

      var url = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/66f0e2e0c9db25690560088e286aa4c7/' + that.state.lat + ',' + that.state.lng;
      fetch(url, {
        method: "GET",
      })
      .then((resp) => resp.json())
      .then(function(data){
        console.log(data);
      //  var weather_window = document.getElementById("weather_report");

        //weather_window.value = "";
        var the_weather = "Weather: " + data.currently.summary;

         var the_temperature = "\nTemperature: " + data.currently.apparentTemperature + " F";

         var the_humidity = "\nHumidity: " + data.currently.humidity + "%"

          var the_windspeed = "\nWindspeed: " + data.currently.windSpeed + "mph";

          var the_result = the_weather + the_temperature + the_humidity + the_windspeed;

          that.setState({text_value: the_result});
          //weather_window.value = the_result;
      })
      })
    };

    country_changed(event){
      var country_select = document.getElementById("myCountry");
      var city_select = document.getElementById("myCity");
      //country_select.onchange = function() {
      var the_selected_country = country_select.options[country_select.selectedIndex].text;
      city_select.length = 1;
      var city_url = "https://weather-location-api.herokuapp.com/country/" + the_selected_country;
      fetch(city_url, {
        method: "GET",
        mode: "cors",
      })
      .then(response => response.json())
      .then(function(data){
        var the_cities = [];
        for(var i = 1; i < data.response.length; i++)
        {
          the_cities[i] = data.response[i].city;
        }
        var the_index = 1;
        for(the_index = 1; the_index < the_cities.length; the_index++) {
          city_select.options[the_index] = new Option(the_cities[the_index], the_cities[the_index]);
        }
      })
      //}
    };

    onClose = props => {
      if(this.state.showingInfoWindow) {
        this.setState({
          showingInfoWindow: false,
          activeMarker: null
        });
      }
    };

    componentDidMount(){
      //document.getElementById("big")
      //this.setState({ markers: markerData });
      const that = this;
      var url = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/66f0e2e0c9db25690560088e286aa4c7/' + this.state.lat + ',' + this.state.lng;
      fetch(url, {
        method: "GET",
      })
      .then((resp) => resp.json())
      .then(function(data){
        console.log(data);
        var the_weather = "Weather: " + data.currently.summary;

         var the_temperature = "\nTemperature: " + data.currently.apparentTemperature + " F";

         var the_humidity = "\nHumidity: " + data.currently.humidity + "%"

          var the_windspeed = "\nWindspeed: " + data.currently.windSpeed + "mph";

          var the_result = the_weather + the_temperature + the_humidity + the_windspeed;

          that.setState({text_value: the_result});

      })
    }

  render() {
    return(
//<React.Fragment>
 <div id="big">
    <Map
      google={this.props.google}
      zoom={14}
      style={mapStyles}
      initialCenter={{ lat: this.state.lat, lng: this.state.lng }}
      center={{ lat: this.state.lat, lng: this.state.lng }}
      //markerData={this.state.markers}
    //  onClick={this.mapClicked}
    >
      <Marker
        onClick={this.onMarkerClick}
        name={this.state.marker_name}
        position={{lat:this.state.lat, lng: this.state.lng}}
      />
      <InfoWindow
        marker={this.state.activeMarker}
        visible={this.state.showingInfoWindow}
        onClose={this.onClose}
      >
        <div>
          <h4>{this.state.selectedPlace.name}</h4>
        </div>
      </InfoWindow>
    </Map>
    <Country onChange={this.country_changed} />
    <City onChange={this.city_changed} />
    <Weather value={this.state.text_value} />
  </div>
  )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBYhOeoQKVFl9KxmSXY5vdhKoVP_4prg9Y'
})(MapContainer);

//export default gobutton;
