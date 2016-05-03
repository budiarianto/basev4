import React from 'react';
import { Row, Col,Nav,NavItem, } from 'react-bootstrap';
//import DocumentsList from '../containers/documents-list.js';
//import { AddDocument } from '../components/add-document.js';
import { InviteUser } from '../components/invite-user.js';
import { InviteList } from '../components/invite-list.js';
import { UserList } from '../components/user-list.js';


export const UserManagement = () => (
  <Row>
    <Col xs={ 12 }>
      <h4 className="page-header">User Management</h4>
      <InviteUser />
      <InviteList />
      <UserList />
    </Col>
  </Row>
);


