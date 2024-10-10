import styles from "./Signup.module.css";

export function SignUp() {
  return (
    <div className={styles.signup}>
      <p>Name*</p>
      <input type="text"></input>
      <p>Email*</p>
      <input type="text"></input>
      <p>Password*</p>
      <input type="text"></input>
      <p>Confirm Password*</p>
      <input type="text"></input>
      <p>Upload your picture</p>
      <input type="file" name="" className={styles.photo} />
      <button className={styles.submit}>Signup</button>
    </div>
  );
}
