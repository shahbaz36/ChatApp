import styles from "./Button.module.css";
export function Button({ activeButton, setActiveButton }) {
  function handleLogIn() {
    setActiveButton("login");
  }
  function handleSignUp() {
    setActiveButton("signup");
  }
  return (
    <div className={styles.btn}>
      <button
        className={
          activeButton === `login` ? `${styles.active}` : `${styles.inactive}`
        }
        onClick={handleLogIn}
      >
        Log in
      </button>
      <button
        className={
          activeButton === `signup` ? `${styles.active}` : `${styles.inactive}`
        }
        onClick={handleSignUp}
      >
        Sign up
      </button>
    </div>
  );
}
