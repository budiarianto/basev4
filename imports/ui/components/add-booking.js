import React from 'react';
import { Link } from 'react-router';
import { Form,FormGroup,ControlLabel,FormControl,HelpBlock,Checkbox,Radio,Input,Row } from 'react-bootstrap';
import { insertDocument } from '../../api/documents/methods.js';


export const  AddBooking = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();
    var flightDate = this.refs.flightDate.value.trim();
    var fullName = this.refs.fullName.value.trim();
    var departureCity = this.refs.departureCity.value.trim(); 
    var departureLocation = this.refs.departureLocation.value.trim(); 
    var destinationCity = this.refs.destinationCity.value.trim(); 
    var destinationLocation = this.refs.destinationLocation.value.trim(); 
    var pax = this.refs.pax.value.trim();  
    var notes = this.refs.notes.value.trim();
    var fare = this.refs.fare.value.trim();

    console.log(flightDate+
      fullName+
      departureCity+
      departureLocation+
      destinationCity+
      destinationLocation+
      pax+
      notes+
      fare
      );
    // insertDocument.call({title,});
    // if (!title ) {
    //   Bert.alert('Please Fill !', 'warning');
    //   return;
    // }
    // TODO: send request to the server
    //this.refs.flightDate.value = '';
    //this.refs.text.value = '';
    return;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="col-sm-3">
          </div>
          <div className="col-sm-6">
            <h3 className="text-thin text-din">Create New Book</h3>
            <div className="row">
              <div className="col-xs-12">
                <div className="form-group">
                  <label for="flightDate">Flight Date Time</label>
                  <div className="form-group">
                    <div className='input-group date'>
                      <input 
                            type="date" 
                            placeholder="DD/MM/YYYY HH:mm"
                            className="form-control" 
                            id="flightDate"
                            ref="flightDate"/>
                      <span className="input-group-addon">
                        <span className="glyphicon glyphicon-calendar"></span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-12">
                  <div className="form-group">
                    <label for="user">Booked By</label>
                    <div className="input-group" id="fullName">
                      <input 
                              type="text" 
                              className="form-control" 
                              placeholder="member full name" 
                              id="fullName" 
                              ref="fullName" 
                              readonly />
                      <input type="hidden" className="form-control" id="userId" name="userId" / >
                        <span className="input-group-addon" data-toggle="modal" data-target="#memberModal" id="searchUser">
                          <span className="glyphicon glyphicon-user"></span>
                        </span>
                      </div>
                  </div>
              </div>
              <div className="col-xs-12">
                <div className="form-group">
                  <label for="departureCity">Departure City</label>
                  <select  
                          className="form-control" 
                          ref="departureCity" 
                          id="departureCity">
                    <option value="undefined">Please select city</option>
                    <option value="Jakarta">Jakarta</option>
                    <option value="Bandung">Bandung</option>
                    </select>
                </div>  
              </div>
              <div className="col-xs-12">
              
                <div className="form-group">
                  <label for="departureLocation">Departure Location</label>
                    <select  
                            className="form-control" 
                            ref="departureLocation" 
                            id="departureLocation">
                      <option value="undefined">Please select location</option>
                      <option value="Mitra">Mitra</option>
                      <option value="transStudio">Trans Studio</option>
                      <option value="Hotel Indonesia">Hotel Indonesia</option>
                    </select>
                  
                  {/*<label id="departureLocation-not-found" className="error" for="departureLocation">departure location not found.</label>*/}
                  
                </div>  
              
            </div>
            <div className="col-xs-12">
                <div className="form-group">
                  <label for="destinationCity">Destination City</label>
                  <select  
                          className="form-control" 
                          ref="destinationCity" 
                          id="destinationCity">
                      <option value="undefined">Please select city</option>
                      <option value="Jakarta">Jakarta</option>
                      <option value="Bandung">Bandung</option>
                  </select>
                </div>  
            </div>
            <div className="col-xs-12">
              
                <div className="form-group">
                  <label for="destinationLocation">Destination Location</label>
                  <select  
                      className="form-control" 
                      ref="destinationLocation">
                    <option value="undefined">Please select location</option>
                    <option value="Mitra">Mitra</option>
                    <option value="transStudio">Trans Studio</option>
                    <option value="Hotel Indonesia">Hotel Indonesia</option>
                  </select>
                 </div>  
              
            </div>
            <div className="col-xs-12">
              <div className="form-group">
                <label for="pax">Pax</label>
                <input 
                      type="number" 
                      className="form-control" 
                      placeholder="Number of passengers" 
                      id="pax" 
                      min="1" 
                      max="4" 
                      ref="pax" />
              </div>
            </div>
            <div className="col-xs-12">
              <div className="form-group">
                <label for="descriptions">Notes</label>
                <textarea 
                        id="notes" 
                        className="form-control" 
                        ref="notes" 
                        rows="2" 
                        placeholder="Booking notes (max 30 chars)" 
                        maxlength="30"></textarea>
              </div>
            </div>
            <div className="col-xs-12">
              <div className="form-group pull-right">
                <h4 className="text-din text-thin" >Total: </h4>
                <input 
                      type="hidden" 
                      id="fare" 
                      ref="fare" 
                      value="" />
              </div>
            </div>
            <div className="col-xs-12">
              <div className="form-group buttonCenter">
                <Link className="btn btn-danger" id="cancel" to="/bookingList">Cancel</Link>
                <input type="submit" className="btn btn-primary" value="Save" />
              </div>
            </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
});
