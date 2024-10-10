import styles from "./Button.module.css";
export function Button({ activeButton, setActiveButton }) {
  function handleLogIn() {
    setActiveButton("login");
    console.log("loggin in...");
  }
  function handleSignUp() {
    setActiveButton("signup");
  }
  return (
    <div className={styles.btn}>
      <button
        className={activeButton === `login` ? `${styles.active}` : ""}
        onClick={handleLogIn}
      >
        Log in
      </button>
      <button
        className={activeButton === `signup` ? `${styles.active}` : ""}
        onClick={handleSignUp}
      >
        Sign up
      </button>
    </div>
  );
}
