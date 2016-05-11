import React from 'react';
import { Link } from 'react-router';
import { Form,FormGroup,ControlLabel,FormControl,HelpBlock,Checkbox,Radio,Input,Row } from 'react-bootstrap';
import { insertDocument } from '../../api/documents/methods.js';

  const booking(){
    return Booking.findOne({});
  },
  departureCity(){
//    var routes = City.find({},{sort:{'sequence': 1}}).fetch();
//    return routes;

    var fare = Fare.find({status: 'Active'}).fetch();
    
    var fareCity = _.pluck(fare, 'departureCity');
    var departureCity = _.uniq(fareCity);
    
    return City.find({city: { $in: departureCity }},{sort:{'sequence': 1}}).fetch();
  },
  const departureLocation(){
    var city = Session.get('departureCity');
    return Helipad.find({'location.city': city},{sort:{'_id': 1}}).fetch();
  },
  const destinationCity(){
    var city = Session.get('departureCity');
    var departureId = Session.get('departureId'); 
    var fare = {};
    if(departureId)
      fare = Fare.find({'departureCity': city, 'departureId': departureId}).fetch();
    else
      fare = Fare.find({'departureCity': city}).fetch();
    
    var arrivalCity = _.pluck(fare, 'arrivalCity');
    var destinationCity = _.uniq(arrivalCity);
    
    return City.find({city: { $in: destinationCity }},{sort:{'sequence': 1}}).fetch();
    
  },
  const destinationLocation(){
    var arrivalCity = Session.get('destinationCity');
    var departureCity = Session.get('departureCity');
    var departureId = Session.get('departureId'); 
    var data = Fare.find({'departureCity': departureCity,'arrivalCity': arrivalCity,'departureId': departureId},{sort:{'_id': 1}}).fetch();
    return data;
  },
  const amountString(){
    var departureCity = Session.get('departureCity');
    var departureId = Session.get('departureId'); 
    var arrivalCity = Session.get('destinationCity');
    var arrivalId = Session.get('destinationId'); 
    
    if(departureCity && departureId && arrivalCity && arrivalId){
      var data = Fare.findOne({'departureCity': departureCity,'arrivalCity': arrivalCity,'departureId': departureId, 'arrivalId': arrivalId});
      //console.log('fare amount: ', data);
      if(data){
        Session.set('amount', data.price);
        return accounting.formatNumber(data.price);
      }else{
        Session.set('amount', 0);
        return 0;
      }
    }else{
      Session.set('amount', 0);
      return 0;
    }
  },
  const  amount(){
    return parseFloat(Session.get('amount'));
  },
  

export const  AddBooking = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();
    var flightDate = this.refs.flightDate.value.trim();
    var fullName = this.refs.fullName.value.trim();
    var departureCity = this.refs.departureCity.value.trim(); 
    //var departureLocation = this.refs.departureLocation.value.trim(); 
    var destinationCity = this.refs.destinationCity.value.trim(); 
    //var destinationLocation = this.refs.destinationLocation.value.trim(); 
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
    },
  changeDepartureCity: function(event){
    event.preventDefault();
    var city = this.refs.departureCity.value.trim();
    Session.set('departureCity', city);
    var destinationLocation = Helipad.find({'location.city': city});
    if(destinationLocation){
      $('#departureCollapse').collapse('show');
    }
    else{
      $('#departureCollapse').collapse('hide');
    }
    
  },

  changeDepartureLocation: (event) => {
    event.preventDefault();
    var departureId = $('#departureLocation').val();
    Session.set('departureId', departureId);
  },
  changeDestinationLocation:(event) => {
    event.preventDefault();
    var destinationId = $('#destinationLocation').val();
    Session.set('destinationId', destinationId);
  },

  changeDestinationCity: (event) => {
    event.preventDefault();
    var city = $('#destinationCity').val();
    Session.set('destinationCity', city);
    var destinationLocation = Helipad.find({'location.city': city});
    if(destinationLocation)
      $('#destinationCollapse').collapse('show');
    else
      $('#destinationCollapse').collapse('hide');
  },
  
  clicCancel: (e)=>{
    e.preventDefault();
    window.history.back();
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
                          id="departureCity"
                          onChange="{this.changeDepartureCity}">
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
                            id="departureLocation"
                            onChange="{this.changeDepartureLocation}">
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
                          id="destinationCity"
                          onChange="changeDestinationCity">
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
