import { useState } from "react";
import styles from "./Signup.module.css";

export function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your signup logic here
    console.log("Signup submitted", formData);
  };

  return (
    <form className={styles.signup} onSubmit={handleSubmit}>
      <label htmlFor="name">Name*</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <label htmlFor="email">Email*</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <label htmlFor="password">Password*</label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <label htmlFor="confirmPassword">Confirm Password*</label>
      <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />

      <label htmlFor="photo">Upload your picture</label>
      <input
        type="file"
        id="photo"
        name="photo"
        className={styles.photo}
        onChange={handleChange}
        accept="image/*"
      />

      <button type="submit" className={styles.submit}>
        Signup
      </button>
    </form>
  );
}
