import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { ListGroupItem,Button,Glyphicon,Div,Navbar,Nav,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';
//import { updateDocument, removeDocument } from '../../api/documents/methods.js';

/*const handleUpdateDocument = (documentId, event) => {
  const title = event.target.value.trim();
  if (title !== '' && event.keyCode === 13) {
    updateDocument.call({
      _id: documentId,
      update: { title },
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Document updated!', 'success');
      }
    });
  }
};
const handleRemoveDocument = (documentId, event) => {
  event.preventDefault();
  if (confirm('Are you sure? This is permanent.')) {
    removeDocument.call({
      _id: documentId,
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Document removed!', 'success');
      }
    });
  }
};*/

export const SearchBooking = ({  }) => (
 <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#"></a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <LinkContainer to="/addBooking">
          <NavItem eventKey={ 1 } href="/addBooking">Add New </NavItem>
        </LinkContainer>
        <NavItem>
          <label for="status">Booking Status </label>
          <select>                
            <option value="undefined">All</option>
            <option value="Open">Open</option>
            <option value="Requesting">Requesting</option>
            <option value="Waiting">Waiting</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Paid">Paid</option>
          </select>
        </NavItem>
        <NavItem>
          <label for="fromDate">&nbsp;&nbsp;Flight From</label>
          <input placeholder="DD/MM/YYYY" />
        </NavItem>
        <NavItem>
          <label for="thruDate">Thru</label>
          <input placeholder="DD/MM/YYYY" />
        </NavItem>
        <NavItem>
          <label for="keyword">Search</label>
          <input placeholder="Enter Keywords" />
        </NavItem>

      </Nav>
      
    </Navbar.Collapse>
  </Navbar>
);
