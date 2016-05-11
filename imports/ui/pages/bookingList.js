import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { BookingList } from '../components/booking.js';
import { SearchBooking } from '../components/search-booking.js';

//import { AddDocument } from '../components/add-document.js';

export const Booking = () => (
  <Row>
    <Col xs={ 12 }>
      <h4 className="page-header text-thin text-din hidden-xs">Booking List</h4>
    <SearchBooking />  
    <BookingList />  
    </Col>
  </Row>
);
