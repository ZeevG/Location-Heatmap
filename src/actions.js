const MESSAGE_UPDATE = 'MESSAGE_UPDATE'
const GEO_JSON = 'GEO_JSON'
const SET_STARTING_COORDS = 'SET_STARTING_COORDS'

function messageAction(message) {
	return {
		type: MESSAGE_UPDATE,
		message
	}
}

function geoJsonAction(url) {
	return {
		type: GEO_JSON,
		url
	}
}

function setStartingCoordsAction(coords) {
	return {
		type: SET_STARTING_COORDS,
		coords
	}
}



export {MESSAGE_UPDATE, messageAction, GEO_JSON, geoJsonAction, SET_STARTING_COORDS, setStartingCoordsAction}