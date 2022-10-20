import { Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';

function SpinnerApp() {
  return (
    <div style={{
      height: "70vh", display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <Button disabled style={{ width: "10%", height: "10%", backgroundColor:"#66B2B9" }}
      >
        <Spinner
          as="span"
          animation="border"
          role="status"
          aria-hidden="true"
        />
        <span className="visually-hidden">Loading...</span>
        <p>Se incarca...</p>
      </Button>
    </div>
  );
}

export default SpinnerApp;