import React from 'react';
import { browserHistory } from 'react-router';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';



const userName = () => {
  const user = Meteor.user();
  const name = user && user.profile ? user.profile.name : '';
  return user ? `${name.first} ${name.last}` : '';
};

const handleLogout = () => { 
  Bert.alert('Thanks You '+userName ()+' !', 'success');
  Meteor.logout(() => browserHistory.push('/login'));
};

export const AuthenticatedNavigation = () => (
  <div>
    <Nav>
      <IndexLinkContainer to="/">
        <NavItem eventKey={ 1 } href="/">Index</NavItem>
      </IndexLinkContainer>
      
      <LinkContainer to="/bookingList">
        <NavItem eventKey={ 3 } href="/bookingList">Booking</NavItem>
      </LinkContainer>
      <LinkContainer to="/historyList">
        <NavItem eventKey={ 4 } href="/historyList">History</NavItem>
      </LinkContainer>
      <LinkContainer to="/cityList">
        <NavItem eventKey={ 5 } href="/cityList">City</NavItem>
      </LinkContainer>
      <LinkContainer to="/helipadList">
        <NavItem eventKey={ 6 } href="/helipadList">Helipad</NavItem>
      </LinkContainer>
      <LinkContainer to="/fareList">
        <NavItem eventKey={ 7 } href="/fareList">Fare</NavItem>
      </LinkContainer>

      <NavDropdown eventKey={8} title="Reconciliation" id="nav-dropdown">
        <LinkContainer to="/importSettlement">
          <NavItem eventKey={ 8.1 } href="/importSettlement">Import CSV</NavItem>
        </LinkContainer>
        <LinkContainer to="/reconcile">
          <NavItem eventKey={ 8.2 } href="/reconcile">Reconcile</NavItem>
        </LinkContainer>
        <LinkContainer to="/settlement">
          <NavItem eventKey={ 8.3 } href="/settlement">Settlement</NavItem>
        </LinkContainer>
      </NavDropdown> 

      <LinkContainer to="/userManagement">
        <NavItem eventKey={ 9 } href="/userManagement">User Management</NavItem>
      </LinkContainer> 
      <LinkContainer to="/memberList">
        <NavItem eventKey={ 10 } href="/memberList">Member List</NavItem>
      </LinkContainer>     
      <LinkContainer to="/ticketSupport">
        <NavItem eventKey={ 11 } href="/ticketSupport">Ticket Support</NavItem>
      </LinkContainer> 
    </Nav>
    <Nav pullRight>
      <NavDropdown eventKey={ 12 } title={ userName() } id="basic-nav-dropdown">
        <MenuItem eventKey={ 12.1 } onClick={ handleLogout }>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </div>
);