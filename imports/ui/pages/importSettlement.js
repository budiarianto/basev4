import React from 'react';
import { Row, Col } from 'react-bootstrap';
//import DocumentsList from '../containers/documents-list.js';
//import { AddDocument } from '../components/add-document.js';
import { ImportSettlement } from '../components/import-settlement.js';

export const Settlement = () => (
  <Row>
    <Col xs={ 12 }>
      <h4 className="page-header">Import Settlement</h4>
      <ImportSettlement />
    </Col>
  </Row>
);
