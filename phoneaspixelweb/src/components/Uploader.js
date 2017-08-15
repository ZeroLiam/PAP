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
    this.props.onUpdate(url);
  }

  onChangeSrc(e){
    let url = e.target.value;
    $("img").fadeIn("fast").attr('src', url);
    this.props.onUpdate(url);
  }

  onChangeSubmit(e){
    e.preventDefault();

    let url = $("#i_url").val();
    if(url && (url != null || url != '') && (url.match(/(\.jpg|\.jpeg|\.png|\.gif)$/g))){
      $("img").fadeIn("fast").attr('src', url);
      this.props.onUpdate(url);
    }else{
      $(".warning-img").css("display", "block");
    }
  }

  render(){
    let UploaderStyle = {
      display: 'none'
    }

    /*
    * In case we want to make the functionality for upload, let's have this here:
          <strong>Upload a file: </strong> <input type="file" id="i_file" value="" onChange={(...args) => this.onChangeUpload(...args)} />
          <br /><strong>or</strong>
    */
    return(
      <div className="uploader-container">

          <div>
              <strong>Insert an URL for the image </strong><br/>
              <input type="url" id="i_url" placeholder="image url here" /><br/>
              <input type="button" id="i_button" name="i_button" value="Send Image to Devices!" onClick={(...args) => this.onChangeSubmit(...args)} /><br/><br/>
              <strong className="warning-img" style={{display: 'none'}}>Hey, the URL field is empty or not valid. Try again with a real url image.</strong>
          </div>
      </div>
    );
  }
}

export default Uploader;
