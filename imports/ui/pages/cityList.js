import React from 'react';
import { Row, Col } from 'react-bootstrap';
//import DocumentsList from '../containers/documents-list.js';
//import { AddDocument } from '../components/add-document.js';

import { SearchCity } from '../components/search-city.js';

export const City = () => (
  <Row>
    <Col xs={ 12 }>
      <h4 className="page-header">City List</h4>
      <SearchCity />
      
    </Col>
  </Row>
);
