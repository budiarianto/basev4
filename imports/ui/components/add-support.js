import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
// import { Input } from 'react-bootstrap';
// import { insertDocument } from '../../api/documents/methods.js';

// const handleInsertDocument = (event) => {
//   const target = event.target;
//   const title = target.value.trim();

//   if (title !== '' && event.keyCode === 13) {
//     insertDocument.call({
//       title,
//     }, (error) => {
//       if (error) {
//         Bert.alert(error.reason, 'danger');
//       } else {
//         target.value = '';
//         Bert.alert('Document added!', 'success');
//       }
//     });
//   }
// };

// export const AddDocument = () => (
//   <Input
//     type="text"
//     onKeyUp={ handleInsertDocument }
//     placeholder="Type a document title and press enter..."
//   required/>
// );
export const  AddSupport = React.createClass({

  handleSubmit: function(event) {
    event.preventDefault();
    var target = this.refs;
    var fullname = this.refs.fullname.value.trim();
    var nickname = this.refs.nickname.value.trim();
    var emailAddress = this.refs.emailAddress.value.trim();
    var phonenumber = this.refs.phonenumber.value.trim();
    var mobileNumber = this.refs.mobileNumber.value.trim();
    var detailsupport = this.refs.detailsupport.value.trim();
    var categorysupport = this.refs.categorysupport.value.trim();

    if (phonenumber !=='' || mobileNumber !=='') {
         if(categorysupport !=='') {

         }else {
            Bert.alert('Please select category!', 'danger');
         }
        
      }else{
            Bert.alert('Please fill phone or mobile number!', 'danger');
      }
      
    console.log(fullname+nickname+emailAddress+phonenumber+mobileNumber+detailsupport+categorysupport);
  },

  render :function(){
    return (
            <form id="memberForm" className="form-group" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-sm-3">
                </div>
                <div className="col-sm-6">
                  <h3 className="text-thin text-din">New Ticket Support</h3>
                  <div className="gap-bottom-small"></div>
                  <div className="row">
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="fullname">Full Name</label>
                        <div className="form-group">
                          <input 
                                type="text" 
                                name="fullname" 
                                id="fullname"
                                ref="fullname" 
                                className="form-control" 
                                placeholder="Full Name" required/>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="nickname">Nick Name</label>
                        <div className="form-group">
                          <input 
                                type="text" 
                                name="nickname" 
                                id="nickname"
                                ref="nickname" 
                                className="form-control" 
                                placeholder="Nick Name" />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="emailAddress">Email Address</label>
                        <div className="form-group">
                          <input 
                                type="email" 
                                name="emailAddress" 
                                id="emailAddress"
                                ref="emailAddress" 
                                className="form-control" 
                                placeholder="Email Address" />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="phonenumber">Phone Number</label>
                        <div className="form-group">
                          <input 
                                type="text" 
                                name="phonenumber" 
                                id="phonenumber"
                                ref="phonenumber" 
                                className="form-control" 
                                placeholder="Phone Number" />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="mobileNumber">Mobile Number</label>
                        <div className="form-group">
                          <input 
                                type="text" 
                                name="mobileNumber" 
                                id="mobileNumber"
                                ref="mobileNumber" 
                                className="form-control" 
                                placeholder="Mobile Number" />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="mobileNumber">Detail Support</label>
                        <div className="form-group">
                          <textarea 
                                  id="detailsupport"
                                  ref="detailsupport"
                                  className="form-control" 
                                  name="detailsupport" 
                                  rows="6"
                                  required>
                          </textarea>
                          
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="mobileNumber">Category Support</label>
                        <div className="form-group">
                          <select 
                                  id="categorysupport" 
                                  ref="categorysupport" 
                                  className="form-control" >
                            <option value="">--Select Category--</option>
                            <option value="billing">Billing</option>
                            <option value="sales">Sales</option>
                            <option value="technicalSupport">Technical Support</option>
                            <option value="copyright">Hak Cipta</option>
                            <option value="others">Lainnya</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group btn-group btn-group-justified">
                        <div className="btn-group" role="group">
                          <Link className="btn btn-danger" id="cancel" to="/ticketSupport">Cancel</Link>
                        </div>
                        <div className="btn-group" role="group">
                          <input type="submit" className="btn btn-primary" value="Save" />
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
