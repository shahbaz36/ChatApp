import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={styles.loadingSpinnerContainer}>
      <div className={styles.loadingSpinner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
