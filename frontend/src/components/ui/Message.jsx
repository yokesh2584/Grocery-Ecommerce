import { Alert } from "react-bootstrap";

const Message = ({
  variant = "info",
  children,
  dismissible = false,
  onClose,
}) => {
  return (
    <Alert variant={variant} dismissible={dismissible} onClose={onClose}>
      {children}
    </Alert>
  );
};

export default Message;
