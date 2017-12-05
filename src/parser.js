import { store } from "./index.js";
import { messageAction, setStartingCoordsAction } from "./actions.js";

function extractLatLng(locations) {

    let round = (value) => {
        value = value * Math.pow(10, 4);
        value = Math.round(value);
        value = value / Math.pow(10, 4);
        return value;
    }

    return locations.map((location) => {
        if ( typeof location["latitudeE7"] === 'undefined') {
            return false;
        }

        return {
            "latitude": round(location['latitudeE7'] / 10000000.0),
            "longitude": round(location['longitudeE7'] / 10000000.0)
        }
    })
}

function removeEmpties(list) {
    return list.filter(element => element !== false);
}

function cluster(list) {
    let counts = {};
    list.forEach( location => {
        let lngLat = [location['longitude'], location['latitude']]
        counts[lngLat] = (counts[lngLat] || 1)+1;
    });

    let highestCount = {
        'count': 0
    };

    let data = Object.entries(counts).map((entries) => {
        let lngLat = entries[0].split(",");
        
        if (entries[1] >= highestCount.count) {
            highestCount = {
                'coords': lngLat,
                'count': entries[1]
            }
        }

        return {
            "geometry": {
                "type": "Point", 
                "coordinates": lngLat
            },
            "type": "Feature", 
            "properties": {
                "count": entries[1]
            }
        }
    });

    store.dispatch(setStartingCoordsAction(highestCount.coords));
    return data;
}

function wrapInGeoJson(features) {
    return {
        "type": "FeatureCollection", 
        features
    }
}

export default function parser(binaryString) {
    let data = JSON.parse(binaryString);
    data = extractLatLng(data['locations']);
    data = removeEmpties(data);
    data = cluster(data);
    store.dispatch(messageAction(`Phew! ${data.length} locations...`));
    data = wrapInGeoJson(data);

    let blob = new Blob([JSON.stringify(data)], {type : 'application/json'});
    return URL.createObjectURL(blob)
}
