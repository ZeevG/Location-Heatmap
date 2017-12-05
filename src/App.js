import React, { Component } from 'react';
import { Provider } from 'react-redux'

import IntroContainer from './intro/intro.js';
import MapContainer from './map.js';
import './App.css';
import { store } from "./index.js";

class App extends Component {
  render() {
    return (
		<Provider store={store}>
			<div>
	      		<IntroContainer/>
	      		<MapContainer/>
	  		</div>
		</Provider>
    );
  }
}

export default App;
