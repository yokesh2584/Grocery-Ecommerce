import { Spinner } from "react-bootstrap";

const Loader = ({ size = "md" }) => {
  return (
    <div className="d-flex justify-content-center align-items-center p-5">
      <Spinner
        animation="border"
        role="status"
        variant="primary"
        className={`spinner-${size}`}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default Loader;
