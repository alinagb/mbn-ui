import React from 'react';
import { useRef } from 'react';
import { Button } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import ViewRegistration from './ViewRegistration';

export default function ExportPdfComponent() {

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    // content: () => componentRef.current
    content: () => {
      const tableStat = componentRef.current.cloneNode(true);
      const PrintElem = document.createElement('div');
      const header =
        `<div class="page-footer">
        <p>Contact:</p>
        <p>Email - mbn_clinik@yahoo.com</p>
        <p>Tel – 0732 041 404 | 0353 401 254</p>
        </div>`;
      PrintElem.innerHTML = header;
      PrintElem.appendChild(tableStat);
      return PrintElem;
    },
  });

  return (
    <div>
      <ViewRegistration ref={componentRef} />

      <Button
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