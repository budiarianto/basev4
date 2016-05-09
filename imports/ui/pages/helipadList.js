import React from 'react';
import { Row, Col } from 'react-bootstrap';
//import DocumentsList from '../containers/documents-list.js';
//import { AddDocument } from '../components/add-document.js';
import { SearchHelipad } from '../components/search-helipad.js';

export const Helipad = () => (
  <Row>
    <Col xs={ 12 }>
      <h4 className="page-header text-thin text-din hidden-xs">Helipad List</h4>
      <SearchHelipad />
    </Col>
  </Row>
);
