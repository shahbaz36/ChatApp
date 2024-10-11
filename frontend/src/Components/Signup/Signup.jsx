import { useState } from "react";
import styles from "./Signup.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner/Spinner";

export function SignUp() {
  const [pic, setPic] = useState(null);

  const [picUrl, setPicUrl] = useState(
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const handlePhoto = (e) => {
    const { files } = e.target;
    setPic(files[0]);
  };

  const postDetails = async (pic) => {
    if (pic === undefined) {
      console.log("Please select an image");
      return;
    }

    const cloud_name = "dfs1zgypv";
    if (pic) {
      if (pic.type === "image/jpeg" || pic.type === "image/png") {
        const data = new FormData();
        data.append("file", pic);
        data.append("upload_preset", "chatapp");
        data.append("cloud_name", `${cloud_name}`);

        try {
          const result = await fetch(
            `https://api.cloudinary.com/v1_1/${cloud_name}/upload`,
            {
              method: "post",
              body: data,
            }
          );
          const response = await result.json();
          const url = response.url.toString();
          setPicUrl(url);
        } catch (error) {
          console.log(error);
          alert("Error while uploading photo");
          return;
        }
      } else {
        alert("Please select an image with jpeg or png format");
        return;
      }
    }
  };
  const handleSubmit = () => {};
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

      <label htmlFor="passwordConfirm">Confirm Password*</label>
      <input
        type="password"
        id="passwordConfirm"
        name="passwordConfirm"
        value={formData.passwordConfirm}
        onChange={handleChange}
        required
      />

      <label htmlFor="photo">Upload your picture</label>
      <input
        type="file"
        id="photo"
        name="photo"
        className={styles.photo}
        onChange={handlePhoto}
        accept="image/*"
      />

      <button type="submit" className={styles.submit}>
        {isLoading ? <Spinner /> : "Signup"}
      </button>
    </form>
  );
}
