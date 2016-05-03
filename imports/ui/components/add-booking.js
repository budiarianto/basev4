import React from 'react';
import ReactDOM from 'react-dom';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import { Form,FormGroup,ControlLabel,FormControl,HelpBlock,Checkbox,Radio,Input,Row } from 'react-bootstrap';
import { insertDocument } from '../../api/documents/methods.js';

/*const handleInsertDocument = (event) => {
  const target = event.target;
  const title = target.userId.value;
  console.log(title);
  if (title !== '' && event.keyCode === 13) {
    insertDocument.call({
      title,
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        target.value = '';
        Bert.alert('Document added!', 'success');
      }
    });
  }
};*/



// export const AddBooking = React.createClass({
//   render() {
//     return (
//       <form id="bookingForm" className="form-group" method="post">
        // <div className="row">
        //   <div className="col-sm-3">
        //   </div>
        //   <div className="col-sm-6">
        //     <h3 className="text-thin text-din">Create New Book</h3>
        //     <div className="row">
        //       <div className="col-xs-12">
        //         <div className="form-group">
        //           <label for="flightDate">Flight Date Time</label>
        //           <div className="form-group">
        //             <div className='input-group date' id='flightDate'>
        //               <input type='date' placeholder="DD/MM/YYYY HH:mm"  className="form-control" name="flightDate"/>
        //               <span className="input-group-addon">
        //                 <span className="glyphicon glyphicon-calendar"></span>
        //               </span>
        //             </div>
        //           </div>
        //         </div>
        //       </div>
        //       <div className="col-xs-12">
        //           <div className="form-group">
        //             <label for="user">Booked By</label>
        //             <div className="input-group" id="fullName">
        //               <input type="text" className="form-control" placeholder="member full name" id="fullName" name="fullName" readonly />
        //               <input type="hidden" className="form-control" id="userId" name="userId" / >
        //                 <span className="input-group-addon" data-toggle="modal" data-target="#memberModal" id="searchUser">
        //                   <span className="glyphicon glyphicon-user"></span>
        //                 </span>
        //               </div>
        //           </div>
        //       </div>
        //       <div className="col-xs-12">
        //         <div className="form-group">
        //           <label for="departureCity">Departure City</label>
        //           <select  className="form-control" name="departureCity" id="departureCity">
        //             <option value="undefined">Please select city</option>
                    
        //           </select>
        //         </div>  
        //       </div>
        //       <div className="col-xs-12">
        //       <div className="collapse" id="departureCollapse">
        //         <div className="form-group">
        //           <label for="departureLocation">Departure Location</label>
                  
        //           <select  className="form-control" name="departureLocation" id="departureLocation">
        //             <option value="undefined">Please select location</option>
                   
        //             <option value=""></option>
                    
        //           </select>
                  
        //             <label id="departureLocation-not-found" className="error" for="departureLocation">departure location not found.</label>
                  
        //         </div>  
        //       </div>
        //     </div>
        //     <div className="col-xs-12">
        //         <div className="form-group">
        //           <label for="destinationCity">Destination City</label>
        //           <select  className="form-control" name="destinationCity" id="destinationCity">
                    
        //               <option value="undefined">Please select city</option>
        //               <option value=""></option>
                      
        //               <option value="undefined">Departure city not registered</option>
                    
        //           </select>
        //         </div>  
        //     </div>
        //     <div className="col-xs-12">
              
        //         <div className="form-group">
        //           <label for="destinationLocation">Destination Location</label>
        //           <select  className="form-control" ref="destinationLocation">
        //             <option value="undefined">Please select location</option>
        //             <option value=""></option>
        //           </select>
        //          </div>  
              
        //     </div>
        //     <div className="col-xs-12">
        //       <div className="form-group">
        //         <label for="pax">Pax</label>
        //         <input type="number" className="form-control" placeholder="Number of passengers" id="pax" min="1" max="4" name="pax" />
        //       </div>
        //     </div>
        //     <div className="col-xs-12">
        //       <div className="form-group">
        //         <label for="descriptions">Notes</label>
        //         <textarea id="notes" className="form-control" name="notes" rows="2" placeholder="Booking notes (max 30 chars)" maxlength="30"></textarea>
        //       </div>
        //     </div>
        //     <div className="col-xs-12">
        //       <div className="form-group pull-right">
        //         <h4 className="text-din text-thin" >Total: </h4>
        //         <input type="hidden" id="fare" name="fare" value="{{amount}}" />
        //       </div>
        //     </div>
        //     <div className="col-xs-12">
        //       <div className="form-group buttonCenter">
        //         <a href="bookingList" className="btn btn-default" id="cancel">Cancel</a>
        //         <input type="submit" onclick={ handleInsertDocument } className="btn btn-primary" value="Save" />
        //       </div>
        //     </div>
        //     </div>
        //   </div>
        // </div>
//       </form>
//     );
//   }
// });
let component;
export const  AddBooking = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var title = ReactDOM.findDOMNode(this.refs.flightDate).value.trim();
    //ReactDOM.findDOMNode(this.refs.flightDate).value.trim();

    //var text = ReactDOM.findDOMNode(this.refs.text).value.trim();
    console.log(title);
    insertDocument.call({title,});
    if (!title ) {
      Bert.alert('Please Fill !', 'warning');
      return;
    }
    // TODO: send request to the server
    ReactDOM.findDOMNode(this.refs.flightDate).value = '';
    //ReactDOM.findDOMNode(this.refs.text).value = '';
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
                      <input type='date' 
                              placeholder="DD/MM/YYYY HH:mm"  
                              className="form-control" 
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
                      <input type="text" className="form-control" placeholder="member full name" id="fullName" name="fullName" readonly />
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
                  <select  className="form-control" name="departureCity" id="departureCity">
                    <option value="undefined">Please select city</option>
                    
                  </select>
                </div>  
              </div>
              <div className="col-xs-12">
              <div className="collapse" id="departureCollapse">
                <div className="form-group">
                  <label for="departureLocation">Departure Location</label>
                  
                  <select  className="form-control" name="departureLocation" id="departureLocation">
                    <option value="undefined">Please select location</option>
                   
                    <option value=""></option>
                    
                  </select>
                  
                    <label id="departureLocation-not-found" className="error" for="departureLocation">departure location not found.</label>
                  
                </div>  
              </div>
            </div>
            <div className="col-xs-12">
                <div className="form-group">
                  <label for="destinationCity">Destination City</label>
                  <select  className="form-control" name="destinationCity" id="destinationCity">
                    
                      <option value="undefined">Please select city</option>
                      <option value=""></option>
                      
                      <option value="undefined">Departure city not registered</option>
                    
                  </select>
                </div>  
            </div>
            <div className="col-xs-12">
              
                <div className="form-group">
                  <label for="destinationLocation">Destination Location</label>
                  <select  className="form-control" ref="destinationLocation">
                    <option value="undefined">Please select location</option>
                    <option value=""></option>
                  </select>
                 </div>  
              
            </div>
            <div className="col-xs-12">
              <div className="form-group">
                <label for="pax">Pax</label>
                <input type="number" className="form-control" placeholder="Number of passengers" id="pax" min="1" max="4" name="pax" />
              </div>
            </div>
            <div className="col-xs-12">
              <div className="form-group">
                <label for="descriptions">Notes</label>
                <textarea id="notes" className="form-control" name="notes" rows="2" placeholder="Booking notes (max 30 chars)" maxlength="30"></textarea>
              </div>
            </div>
            <div className="col-xs-12">
              <div className="form-group pull-right">
                <h4 className="text-din text-thin" >Total: </h4>
                <input type="hidden" id="fare" name="fare" value="{{amount}}" />
              </div>
            </div>
            <div className="col-xs-12">
              <div className="form-group buttonCenter">
                <a href="bookingList" className="btn btn-default" id="cancel">Cancel</a>
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
