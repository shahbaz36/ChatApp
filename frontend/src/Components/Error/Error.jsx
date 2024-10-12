import { useState, useEffect } from "react";
import { X } from "lucide-react";
import styles from "./Error.module.css";

const ErrorPopup = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={styles.errorPopup}>
      <p className={styles.errorMessage}>{message}</p>
      <button
        onClick={() => setIsVisible(false)}
        className={styles.closeButton}
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default ErrorPopup;
