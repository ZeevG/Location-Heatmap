import React, { Component } from 'react';
import { connect } from 'react-redux';
import { messageAction, geoJsonAction } from "../actions.js";
import parser from "../parser.js";
import oboe from 'oboe';

class DropZone extends Component {

  componentDidMount() {
    this.el.addEventListener("drop", this.props.onFileDrop);
    this.el.addEventListener("dragover", this.handleDragOver);

    this.el2.addEventListener("change", this.props.onFileDrop);

  }

  componentWillUnmount() {
    this.el.removeEventListener("drop", this.props.onFileDrop);
    this.el.removeEventListener("dragover", this.handleDragOver);

    this.el2.removeEventListener("change", this.props.onFileDrop);
  }

  handleDragOver = (event) => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };

  handleInputFile = (event) => {
    this.props.onFileDrop({
      'dataTransfer': {
        'files': event.files
      }
    });
  }

  render() {
    return (
        <div>
          <div className={this.props.className} ref={elem => this.el = elem}>
           <p className="message">{this.props.message}</p>
          </div>
          <input type="file" ref={elem => this.el2 = elem} />
        </div>


    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFileDrop: async (event) => {
        console.log("Drop:", event);
        event.stopPropagation();
        event.preventDefault();

        let textDecoder = new TextDecoder('utf-8');

        let reader = new FileReader();
        reader.onloadend = (event) => {
            let start = Date.now();
            const byteLength = reader.result.byteLength;
            const sliceSize = 1000000;
            const slices = byteLength/sliceSize;
            let oboeStream = new oboe();

            let round = (value) => {
                value = value * Math.pow(10, 4);
                value = Math.round(value);
                value = value / Math.pow(10, 4);
                return value;
            }

            oboeStream.node('locations.*', (location) => {
                if ( typeof location["latitudeE7"] === 'undefined') {
                    return oboe.drop;
                }

                return {
                    "latitude": round(location['latitudeE7'] / 10000000.0),
                    "longitude": round(location['longitudeE7'] / 10000000.0)
                }
            }).done((data) => {
                let url = parser(data.locations);
                dispatch(geoJsonAction(url));
                console.log("start: " + start);
                console.log("end: " + Date.now());
            })

            for(let i = 0; i < slices; i++) {
                setTimeout(function(){
                    let jsonSlice = textDecoder.decode(reader.result.slice(i*sliceSize, (i+1)*sliceSize), {'stream': true});
                    oboeStream.emit('data', jsonSlice);

                    const percent = Math.floor((i / slices) * 100);
                    const message = `Loading File: ${percent}%`;
                    console.log(message)

                    dispatch(messageAction(message));
                }, 0);
            }
        };
        reader.onerror = (event) => {
            console.log("error yo");
        };

        let file;
        if (event.target.files) {
          file = event.target.files[0];
        } else {
          file = event.dataTransfer.files[0];
        }

        reader.readAsArrayBuffer(file);
    }
  }
}

const mapStateToProps = (state, ownProps) => {
    return Object.assign({
        message: state.message
    }, ownProps);
}

const DropZoneContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DropZone)

export default DropZoneContainer;
