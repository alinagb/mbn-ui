import React from 'react';
import { useRef } from 'react';
import { Button } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import ViewRegistration from './ViewRegistration';

export default function ExportPdfComponent() {

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
    
      <ViewRegistration ref={componentRef} />

      <Button
      download
        className="searchBtn"
        style={{ marginLeft: "2%", marginBottom: "5%", marginTop: "-3%" }}
        onClick={handlePrint}
      >
        {" "}
        Printeaza raport{" "}
      </Button>

    </div>
  );
}