import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { NavItem } from 'react-bootstrap';

  //import { Row, Col, ListGroupItem, Input, Button } from 'react-bootstrap';
  //import { updateDocument, removeDocument } from '../../api/documents/methods.js';

  // const handleUpdateDocument = (documentId, event) => {
  //   const title = event.target.value.trim();
  //   if (title !== '' && event.keyCode === 13) {
  //     updateDocument.call({
  //       _id: documentId,
  //       update: { title },
  //     }, (error) => {
  //       if (error) {
  //         Bert.alert(error.reason, 'danger');
  //       } else {
  //         Bert.alert('Document updated!', 'success');
  //       }
  //     });
  //   }
  // };

  // const handleRemoveDocument = (documentId, event) => {
  //   event.preventDefault();
  //   if (confirm('Are you sure? This is permanent.')) {
  //     removeDocument.call({
  //       _id: documentId,
  //     }, (error) => {
  //       if (error) {
  //         Bert.alert(error.reason, 'danger');
  //       } else {
  //         Bert.alert('Document removed!', 'success');
  //       }
  //     });
  //   }
  // };

  export const SearchSupport =React.createClass({
    render (){
      return (
          <nav className="navbar navbar-default" role="navigation">
            <div className="container-fluid">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-form">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand text-din visible-xs">Fare List</a>
              </div>
              <div id="navbar-collapse-form" class="collapse navbar-collapse">
                <ul className="nav navbar-nav">
                    <LinkContainer to="/addSupport">
                        <NavItem eventKey={ 1 } href="/addSupport">Add New</NavItem>
                    </LinkContainer>
                  <li>
                  <form name="searchForm" className="navbar-form navbar-left" >
                    <div className="form-inline">
                          <div className="form-group">
                              <label for="status">Support Status </label>
                              <select name="status" className="form-control memberStatus">                
                                  <option value="Open">Open</option>
                                  <option value="Close">Close</option>
                              </select>
                          </div>
                          <div className="form-group">
                            <label for="keyword">&nbsp;Search</label>
                              <input type="text" id="keyword" className="form-control" placeholder="Search for..." />
                    </div>
                  </div>
                 </form>
                  </li>
                  
                </ul>
              </div>
            </div>
          </nav>
        );
    }
  });