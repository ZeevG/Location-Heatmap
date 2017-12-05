import React from 'react';
import { connect } from 'react-redux'
import { messageAction, geoJsonAction } from "../actions.js";
import parser from "../parser.js";
import DropZone from "./dropZone.js";

import takeout from "./takeout.png";
import archive from "./archive.png";
import download from "./download.png";
import "./dropZone.css";

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

        reader.readAsBinaryString(event.dataTransfer.files[0]);
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


function IntroContainer(props) {
    return(
        <div>
            <header className="intro-header">
                <div className="header-text">
                    <h1> Location Heatmap Thingy</h1>
                    <DropZoneContainer className="slim drop-zone" />
                </div>
            </header>
            <div className="intro-container">
                <h2>Getting Started</h2>
                <p>This is an interactive app for browsing your Google location history.
                You will need to export your location history using Google Takeout before you can use this service.
                </p>
                <br/>

                <h4>Step 1 - head to Google Takeout</h4>
                <p>Google Takeout is a service which allows you to export all your personal data held by Google.
                Use this service to export your location data.</p>
                <p>Visit <a href="https://takeout.google.com" target="_blank" rel="noopener noreferrer">Google Takeout</a> and export your location history in JSON format.</p>
                <img src={takeout} className="intro-image" alt="Takeout service with only Location History selected"/>

                <h4>Step 2 - Accept default archive format</h4>
                <img src={archive} className="intro-image" alt="Takeout service with default settings."/>

                <h4>Step 3 - Download the archive</h4>
                <p>Google says they will email you when the export is ready. I've found it appears on the website fairly quickly.</p>
                <img src={download} className="intro-image" alt="Page with download link."/>

                <h4>Step 4 - Open the ZIP archive and find the "Location History.json" file</h4>
                <p>Find the "Location History.json" file (not the folder) and drop it into the box below.</p>
                
                <DropZoneContainer className="final drop-zone"/>

                <br/><br/><br/><br/>
            </div>
        </div>
    )
}


export default IntroContainer;
