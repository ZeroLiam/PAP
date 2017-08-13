import React, { Component } from 'react';
import $ from 'jquery';
import _ from 'lodash';

class Uploader extends Component{
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };

    this.onChangeUpload = this.onChangeUpload.bind(this);
    this.onChangeSrc = this.onChangeSrc.bind(this);
    this.onChangeSubmit = this.onChangeSubmit.bind(this);
  }

  onChangeUpload(e){
    let url = URL.createObjectURL(e.target.files[0]);

    $("img").fadeIn("fast").attr('src', url);
    $(".prev").attr('style', 'display:none');
  }

  onChangeSrc(e){
    let url = e.target.value;
    $("img").fadeIn("fast").attr('src', url);
  }

  onChangeSubmit(e){
    e.preventDefault();
  }

  render(){
    let UploaderStyle = {
      display: 'none'
    }

    return(
      <div className="uploader-container">
          <strong>Upload a file: </strong> <input type="file" id="i_file" value="" onChange={(...args) => this.onChangeUpload(...args)} />
          <br />
          <strong>or</strong>
          <div>
              <strong>Insert an URL for the image </strong><br/>
              <input type="url" id="i_url" placeholder="image url here" onChange={(...args) => this.onChangeSrc(...args)} />
          </div>
      </div>
    );
  }
}

export default Uploader;
