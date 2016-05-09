import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
// import { Input } from 'react-bootstrap';
// import { insertDocument } from '../../api/documents/methods.js';


export const  AddMember = React.createClass({

  handleSubmit: function(event) {
    event.preventDefault();
    var memberid = this.refs.memberid.value.trim();
    var fullname = this.refs.fullname.value.trim();
    var nickname = this.refs.nickname.value.trim();
    //var country = this.refs.country.value.trim();     // tempat lahir
    //var country = this.refs.country.value.trim();     // tgl lahir
    var address = this.refs.address.value.trim();
    var emailAddress = this.refs.emailAddress.value.trim();
    var phonenumber = this.refs.phonenumber.value.trim();
    var mobileNumber = this.refs.mobileNumber.value.trim();
    var password = this.refs.password.value.trim();
    var confirmPassword = this.refs.confirmPassword.value.trim();

    console.log(memberid+fullname+nickname+address+emailAddress+phonenumber+mobileNumber+password+confirmPassword);
  },

  render :function(){
    return (
            <form id="memberForm" className="form-group" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-sm-3">
                </div>
                <div className="col-sm-6">
                  <h3 className="text-thin text-din">Add New Member</h3>
                  <div className="gap-bottom-small"></div>
                  <div className="row">
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="memberid">Member Id</label>
                        <div className="form-group">
                          <input 
                                type="text" 
                                name="memberid" 
                                id="memberid" 
                                ref="memberid" 
                                className="form-control" />
                        </div>
                      </div>
                    </div>
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
                                placeholder="Full Name" />
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
                        <label for="">Birth</label>
                        <div className="form-group">
                          <input 
                                type="text" 
                                name="" 
                                id="" 
                                ref="" 
                                className="form-control" 
                                placeholder="Tempat Lahir" />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="">Birth</label>
                        <div className="form-group">
                          <input 
                                type="text" 
                                name="" 
                                id=""
                                ref="" 
                                className="form-control" 
                                placeholder="Tgl Lahir" />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="address">Address</label>
                        <div className="form-group">
                          <input 
                                type="text" 
                                name="address" 
                                id="address"
                                ref="address" 
                                className="form-control" 
                                placeholder="Adress" />
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
                        <label for="mobileNumber">Password</label>
                        <div className="form-group">
                          <input 
                                type="password" 
                                name="password" 
                                id="password"
                                ref="password" 
                                className="form-control" 
                                placeholder="Password" />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="mobileNumber">Confirm Password</label>
                        <div className="form-group">
                          <input 
                                type="password" 
                                name="confirmPassword" 
                                id="confirmPassword"
                                ref="confirmPassword" 
                                className="form-control" 
                                placeholder="Confirm Password" />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group btn-group btn-group-justified">
                        <div className="btn-group" role="group">
                          <Link className="btn btn-danger" id="cancel" to="/memberList">Cancel</Link>
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
