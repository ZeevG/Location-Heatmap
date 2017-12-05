import React, { Component } from 'react';

class DropZone extends Component {

  componentDidMount() {
    this.el.addEventListener("drop", this.props.onFileDrop);
    this.el.addEventListener("dragover", this.handleDragOver);
  }

  componentWillUnmount() {
    this.el.removeEventListener("drop", this.props.onFileDrop);
    this.el.removeEventListener("dragover", this.handleDragOver);
  }

  handleDragOver = (event) => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };


  render() {
    return (
        <div className={this.props.className} ref={elem => this.el = elem}>
         <p className="message">{this.props.message}</p>
       </div>

    );
  }
}


export default DropZone;
