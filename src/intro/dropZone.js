import React, { Component } from 'react';
import { connect } from 'react-redux';
import { messageAction, geoJsonAction } from "../actions.js";
import parser from "../parser.js";

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
    onFileDrop: (event) => {
        console.log("Drop:", event);
        event.stopPropagation();
        event.preventDefault();

        let reader = new FileReader();
        reader.onprogress = (event) => {
            const percent = Math.floor((event.loaded / event.total) *100);
            const message = `Loading File: ${percent}%`;

            dispatch(messageAction(message));
        };
        reader.onload = (event) => {
            let url = parser(event.target.result);
            dispatch(geoJsonAction(url));
        };

        let file;
        if (event.target.files) {
          file = event.target.files[0];
        } else {
          file = event.dataTransfer.files[0];
        }

        reader.readAsBinaryString(file);
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
