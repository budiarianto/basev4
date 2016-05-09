import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { insertDocument } from '../../api/documents/methods.js';


export const  AddHelipad = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();
    var helipadId = this.refs.helipadId.value.trim();
    var helipadName = this.refs.helipadName.value.trim();
    var helipadStartDate = this.refs.helipadStartDate.value.trim();
    var helipadEndDate = this.refs.helipadEndDate.value.trim();
    var helipadStartTime = this.refs.helipadStartTime.value.trim();
    var helipadEndTime = this.refs.helipadEndTime.value.trim();
    var helipadType = this.refs.helipadType.value.trim();
    var descriptions = this.refs.descriptions.value.trim();
    var city = this.refs.city.value.trim();
    var location = this.refs.location.value.trim();
    var longitude = this.refs.longitude.value.trim();
    var latitude = this.refs.latitude.value.trim();
    var fareName = this.refs.fareName.value.trim();
    var fareName = this.refs.fareName.value.trim();
    
    
    
  },
  render :function(){
    return (
            <div>
            <h3 className="sub-header" >Create New Helipad</h3>
            <form id="helipadForm" className="form-group" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-sm-7">
                  <div className="row">
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="helipadId">Helipad ID</label>
                        <input 
                              type="text" 
                              className="form-control" 
                              placeholder="Helipad ID" 
                              id="helipadId" 
                              name="helipadId"
                              ref="helipadId" 
                              maxlength="32" 
                              value="" />
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="helipadName">Helipad Name</label>
                        <input 
                              type="text" 
                              className="form-control" 
                              placeholder="Helipad Name" 
                              id="helipadName" 
                              name="helipadName" 
                              ref="helipadName" 
                              maxlength="100" 
                              value=""/>
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <label for="helipadStartDate">Contract Period:</label>
                    </div>
                    <div className="col-xs-6">
                      <div className="form-group">
                        <label for="helipadStartDate">Start Date</label>
                        {/*<input type="text" className="form-control" placeholder="Select start date" name="helipadStartDate" id="helipadStartDate" /> */}
                        <div className="form-group">
                          <div className='input-group date' id='helipadStartDate'>
                            <input 
                                  type="text" 
                                  placeholder="DD/MM/YYYY" 
                                  className="form-control" 
                                  id='helipadStartDate' 
                                  name='helipadStartDate'
                                  ref='helipadStartDate'
                                  value=""/>
                            <span className="input-group-addon">
                              <span className="glyphicon glyphicon-calendar"></span>
                            </span>
                          </div>
                          <div className="errorText error"></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-6">
                      <div className="form-group">
                        <label for="helipadEndDate">End Date</label>
                        {/*<input type="text" class="form-control" placeholder="Select end date" name="helipadEndDate" id="helipadEndDate">*/ }
                        <div className="form-group">
                          <div className='input-group date' id='helipadEndDate'>
                            <input 
                                  type="text" 
                                  placeholder="DD/MM/YYYY" 
                                  className="form-control" 
                                  id='helipadEndDate' 
                                  name='helipadEndDate'
                                  ref='helipadEndDate'
                                  value=""/>
                            <span className="input-group-addon">
                              <span className="glyphicon glyphicon-calendar"></span>
                            </span>
                          </div>
                          <div className="errorText error"></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <label for="helipadStartDate">Operational Time:</label>
                    </div>
                    <div className="col-xs-6">
                      <div className="form-group">
                        <label for="helipadStartTime">From</label>
                        {/*<input type="text" class="form-control timepicker" placeholder="Select start time" name="helipadStartTime" id="helipadStartTime">*/}
                        <div className="form-group">
                          <div className='input-group date' id='helipadStartTime'>
                            <input 
                                  type='text' 
                                  placeholder="HH:MM"  
                                  className="form-control" 
                                  id='helipadStartTime'
                                  name='helipadStartTime'
                                  ref='helipadStartTime'
                                  value=""/>
                              <span className="input-group-addon">
                              <span className="glyphicon glyphicon-time"></span>
                            </span>
                          </div>
                          <div className="errorText error"></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-6">
                      <div className="form-group">
                        <label for="helipadEndTime">To</label>
                        {/*<input type="text" class="form-control timepicker" placeholder="Select end time" name="helipadEndTime" id="helipadEndTime">*/}
                        <div className="form-group">
                          <div className='input-group date' id='helipadEndTime'>
                            <input 
                                  type="text" 
                                  placeholder="HH:MM" 
                                  className="form-control" 
                                  id="helipadEndTime" 
                                  name="helipadEndTime" 
                                  ref="helipadEndTime" 
                                  value=""/>
                            <span className="input-group-addon">
                              <span className="glyphicon glyphicon-time"></span>
                            </span>
                          </div>
                          <div className="errorText error"></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="active">Status &nbsp;&nbsp;</label>
                        <label className="radio-inline">
                          <input 
                                type="radio" 
                                name="helipadType"
                                id="active" 
                                ref="helipadType"
                                value="Available" /> Available
                        </label>
                        <label className="radio-inline">
                          <input 
                                type="radio" 
                                name="helipadType" 
                                id="inactive" 
                                ref="helipadType"
                                value="Unavailable" /> Unavailable
                        </label>
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="descriptions">Helipad Descriptions</label>
                        <textarea 
                                id="descriptions" 
                                className="form-control" 
                                name="descriptions" 
                                ref="descriptions"
                                rows="6"></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-5">
                  <div className="row">
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="city">City </label>
                        <select  
                                name="city" 
                                id="city"
                                ref="city"
                                className="form-control" >
                          <option value="undefined">Please select city</option>
                          
                          <option value=""></option>
                          
                        </select>
                      </div>
                    </div>
                    
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="location">Location</label>
                        {/*Geolocation & full address*/}
                        <input 
                              type="text" 
                              className="form-control" 
                              placeholder="Location" 
                              id="location" 
                              name="location" 
                              ref="location"
                              value="" />
                      </div>
                    </div>            
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="latitude">Longitude - Latitude</label>
                        <div className="form-inline">
                          <div className="form-group">
                          <input 
                                type="text" 
                                className="form-control latlng" 
                                placeholder="longitude" 
                                id="longitude" 
                                name="longitude" 
                                ref="longitude"
                                value="" />
                          </div>
                          <div className="form-group">
                          <input 
                                type="text" 
                                className="form-control latlng" 
                                placeholder="latitude" 
                                id="latitude" 
                                name="latitude" 
                                ref="latitude"
                                value="" />
                          </div>
                          
                            <div className="form-group">
                              
                            </div>
                          
                        </div>
                      </div>
                    </div>            
                    <div className="col-xs-12">
                      <div className="form-group">
                        {/*<label for="location">Location</label> 
                        Geolocation & full address 
                        <input 
                              type="text" 
                              className="form-control" 
                              placeholder="Location" 
                              id="location" 
                              name="location" 
                              ref="location" 
                              value="">*/} 
                        {/*Data alamat persection*/}
                        <input type="hidden" className="form-control" placeholder="country" id="country" name="country" value=""/>
                        <input type="hidden" className="form-control" placeholder="placeId" id="placeId" name="placeId" value=""/>
                        <input type="hidden" className="form-control" placeholder="street" id="street" name="street" value=""/>
                        <input type="hidden" className="form-control" placeholder="state" id="state" name="state" value=""/>
                        <input type="hidden" className="form-control" placeholder="zip" id="zip" name="zip" value=""/>
                        {/*Administrative levels*/}
                        <input type="hidden" className="form-control" placeholder="level1long" id="level1long" name="level1long" value=""/>
                        <input type="hidden" className="form-control" placeholder="level2long" id="level2long" name="level2long" value=""/>
                        <input type="hidden" className="form-control" placeholder="level3long" id="level3long" name="level3long" value=""/>
                        <input type="hidden" className="form-control" placeholder="level4long" id="level4long" name="level4long" value=""/>
                        
                        <div className="clearfix gap-bottom-small"></div>
                        <div className="map-container">
                          {/*{{> googleMap name="map" options=mapOptions}}*/}
                        </div>
                      </div>
                      <br></br>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12">
                  <center>
                    <div className="form-group">
                      <Link className="btn btn-danger" id="cancel" to="/helipadList">Cancel</Link>
                      <input type="submit" className="btn btn-primary" value="Save" />
                    </div>
                  </center>
                </div>
              </div>
            </form>
            </div>
                
    );
  }
});
