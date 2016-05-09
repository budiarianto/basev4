import React from 'react';
import { Row, Col } from 'react-bootstrap';
//import DocumentsList from '../containers/documents-list.js';
//import { AddDocument } from '../components/add-document.js';
import { SearchSettlement } from '../components/search-Settlement';

export const SettlementList = () => (
  <Row>
    <Col xs={ 12 }>
      <h4 className="page-header">Settlement</h4>

      <SearchSettlement />
      
    </Col>
  </Row>
);
