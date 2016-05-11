import React from 'react';
import { Row, Col, ListGroupItem, Table, Link} from 'react-bootstrap';
//import { updateDocument, removeDocument } from '../../api/documents/methods.js';

export const BookingList = ({ booking }) => (
 <Row>
    <Col xs={ 12 } sm={ 12 }> 
      <Table striped condensed hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Booking Code</th>
            <th>Booked By</th>
            <th>Pax</th>
            <th>Date</th>
            <th>Time</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>HAP1628070</td>
            <td>Bibit Nugroho</td>
            <td>2</td>
            <td>28/04/2016</td>
            <td>13.00</td>
            <td>Mitra</td>
            <td>Semanggi</td>
            <td>24,000,000</td>
            <td>Open</td>
          </tr>
        </tbody>
      </Table>
    </Col>  
</Row> 
  );
