import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
// import { Input } from 'react-bootstrap';
// import { insertDocument } from '../../api/documents/methods.js';


export const  AddCity = React.createClass({

  handleSubmit: function(event) {
    event.preventDefault();
    var sequence = this.refs.sequence.value.trim();
    var city = this.refs.city.value.trim();
    var country = this.refs.country.value.trim();
    
    console.log(sequence+city+country);
  },

  render :function(){
    return (
            <form id="cityForm" className="form-group" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-sm-3">
                </div>
                <div className="col-sm-6">
                  {/*<h3 className="text-thin text-din">{{judul}}</h3>*/}
                  <div className="row">
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="sequence">Sequence Number</label>
                        <input 
                              type="number" 
                              className="form-control" 
                              placeholder="Sequence number" 
                              min="0" 
                              id="sequence" 
                              ref="sequence" />
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="city">City</label>
                        <input 
                              type="text" 
                              className="form-control" 
                              placeholder="City name" 
                              id="city" 
                              ref="city" />
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="form-group">
                        <label for="country">Country</label>
                        <input 
                              type="text" 
                              className="form-control" 
                              placeholder="Country name" 
                              id="country" 
                              ref="country" />
                      </div>
                    </div>
                    <div class="col-xs-12">
                      <div class="form-group">
                        <Link className="btn btn-danger" id="cancel" to="/cityList">Cancel</Link>
                        <input type="submit" className="btn btn-primary" value="Save" />
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
