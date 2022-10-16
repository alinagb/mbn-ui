import React from 'react';
import Alert from 'react-bootstrap/Alert';

export default function AlertDismissible({ show, color, message }) {
  return (
    <>
      <Alert show={show} variant={color}>
        <Alert.Heading>{message}</Alert.Heading>
        <hr />
      </Alert>
    </>
  );
}
