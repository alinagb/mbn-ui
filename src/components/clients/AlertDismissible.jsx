import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

export default function AlertDismissible({show, color, message}) {
  // const [show, setShow] = useState(true);
  console.log("aaaa")
  return (
    <>
      <Alert show={show} variant={color}>
        <Alert.Heading>{message}</Alert.Heading>
        <hr />

      </Alert>

    </>
  );
}
