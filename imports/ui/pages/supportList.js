import React from 'react';
import { Row, Col } from 'react-bootstrap';
//import DocumentsList from '../containers/documents-list.js';
//import { AddDocument } from '../components/add-document.js';
import { SearchSupport } from '../components/search-support.js';

export const SupportList = () => (
  <Row>
    <Col xs={ 12 }>
      <h4 className="page-header">Support List</h4>
      <SearchSupport />
      
    </Col>
  </Row>
);
