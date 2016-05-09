import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
// import { Input } from 'react-bootstrap';
// import { insertDocument } from '../../api/documents/methods.js';


export const  AddFare = React.createClass({

  handleSubmit: function(event) {
    event.preventDefault();
    var fareName = this.refs.fareName.value.trim();
    var fareStartTime = this.refs.fareStartTime.value.trim();
    var price = this.refs.price.value.trim();
    var departureCity = this.refs.departureCity.value.trim();
    var departureLocation = this.refs.departureLocation.value.trim();
    var destinationCity = this.refs.destinationCity.value.trim();
    var destinationLocation = this.refs.destinationLocation.value.trim();
    var fareStatus = this.refs.fareStatus.value.trim();
    var descriptions = this.refs.descriptions.value.trim();
    
    
    console.log(fareName+fareStatus);
  },

  render :function(){
    return (
            
              <form id="fareForm" className="form-group" onSubmit={this.handleSubmit}>
                <div className="row">
                  <div className="col-sm-3">
                  </div>
                  <div className="col-sm-6">
                    <h3 className="text-thin text-din"></h3>
                    <div className="row">
                      <div className="col-xs-12">
                        <div className="form-group">
                          <label for="fareName">Fare Name</label>
                          <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Fare Name" 
                                id="fareName" 
                                maxlength="150" 
                                name="fareName" 
                                ref="fareName" 
                                />
                        </div>
                      </div>
                      <div className="col-xs-12">
                        <div className="form-group">
                          <label for="fareStartTime">Air Time</label>
                          <div className="form-group">
                            <div className='input-group date' id='fareStartTime'>
                              <input 
                                    type='text' 
                                    placeholder="HH:MM"  
                                    className="form-control" 
                                    name='fareStartTime' 
                                    ref='fareStartTime' 
                                    value=""/>
                              <span className="input-group-addon">
                                <span className="glyphicon glyphicon-time"></span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xs-12">
                        <div className="form-group">
                          <label for="fareName">Price</label>
                          <input 
                                type="number" 
                                className="form-control" 
                                placeholder="Price" 
                                id="price" 
                                min="0" 
                                maxlength="150" 
                                name="price"
                                ref="price"
                                value="" />
                        </div>
                      </div>
                      <div className="col-xs-12">
                        <div className="form-group">
                          <label for="departureCity">Departure City</label>
                          <select  
                                  className="form-control" 
                                  name="departureCity" 
                                  id="departureCity"
                                  ref="departureCity">
                            <option value="undefined">Please select city</option>
                          </select>
                        </div>  
                      </div>
                      <div className="col-xs-12">
                        <div className="collapse" id="departureCollapse">
                          <div className="form-group well">
                            <label for="departureLocation">Departure Location</label>
                            
                            <select  
                                    className="form-control" 
                                    name="departureLocation" 
                                    id="departureLocation"
                                    ref="departureLocation"
                                    >
                              <option value="undefined">Please select location</option>
                            </select>
                            
                              <label id="departureLocation-not-found" className="error" for="departureLocation">departure location not found.</label>
                            
                          </div>  
                        </div>
                      </div>
                      <div className="col-xs-12">
                          <div className="form-group">
                            <label for="destinationCity">Destination City</label>
                            <select  
                                    className="form-control" 
                                    name="destinationCity" 
                                    id="destinationCity"
                                    ref="destinationCity">
                              
                                <option value="undefined">Please select city</option>
                                
                            </select>
                          </div>  
                      </div>
                      <div className="col-xs-12">
                        <div className="collapse" id="destinationCollapse">
                          <div className="form-group well">
                            <label for="destinationLocation">Destination Location</label>
                            
                            <select  
                                    className="form-control" 
                                    name="destinationLocation" 
                                    id="destinationLocation"
                                    ref="destinationLocation">
                              <option value="undefined">Please select location</option>
                              
                            </select>
                            
                              <label id="destinationLocation-not-found" className="error" for="destinationLocation">destination location not found.</label>
                            
                          </div>  
                        </div>
                      </div>
                      
                      <div className="col-xs-12">
                        <div className="form-group">
                          <div>
                          <label for="active">Status &nbsp;&nbsp;</label>
                          </div>
                          <div>
                          <label className="radio-inline">
                            <input 
                                  type="radio" 
                                  name="fareStatus" 
                                  id="active" 
                                  ref="fareStatus" 
                                  value="Active" 
                                  /> Active
                          </label>
                          <label className="radio-inline">
                            <input 
                                  type="radio" 
                                  name="fareStatus"
                                  ref="fareStatus"  
                                  id="inactive" 
                                  value="Inactive" /> Not Active
                          </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-xs-12">
                        <div className="form-group">
                          <label for="descriptions">Fare Descriptions</label>
                          <textarea 
                                  id="descriptions"
                                  ref="descriptions"
                                  className="form-control" 
                                  name="descriptions" 
                                  rows="6">
                          </textarea>
                        </div>
                      </div>
                      <div className="col-xs-12">
                        <div>
                          <div className="form-group">
                            <div className="form-group">
                              <Link className="btn btn-danger" id="cancel" to="/fareList">Cancel</Link>
                              <input type="submit" className="btn btn-primary" value="Save" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-3">
                  </div>
                </div>
              </form>
            
      );
  }
});
