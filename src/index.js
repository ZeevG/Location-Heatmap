import App from './App.js';
import { createStore } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { MESSAGE_UPDATE, GEO_JSON, SET_STARTING_COORDS } from './actions.js';

const INITIAL_STATE = {
    "geoJsonUrl": false,
    "message": "Drop a location history file here.",
    "startingCoords": []
};

function reducer(state, action) {
  switch (action.type) {
    case MESSAGE_UPDATE:
        return Object.assign({}, state, {
            "message":  action.message
        })
    case GEO_JSON:
        return Object.assign({}, state, {
            "geoJsonUrl":  action.url
        })

    case SET_STARTING_COORDS:
        return Object.assign({}, state, {
            "startingCoords":  action.coords
        })
    default:
      return state
  }
}

let store = createStore(reducer, INITIAL_STATE, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
ReactDOM.render(<App />, document.getElementById('root'));

export {store};