import { useState } from "react";
import styles from "./Signup.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner/Spinner";
import ErrorPopup from "../Error/Error";

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
  const [error, setError] = useState("");
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
      throw new Error("Please select an image");
    }

    //Cloudinary
    const cloud_name = "dfs1zgypv";
    try {
      if (pic) {
        if (pic.type === "image/jpeg" || pic.type === "image/png") {
          const data = new FormData();
          data.append("file", pic);
          data.append("upload_preset", "chatapp");
          data.append("cloud_name", `${cloud_name}`);

          const result = await fetch(
            `https://api.cloudinary.com/v1_1/${cloud_name}/upload`,
            {
              method: "post",
              body: data,
            }
          );
          const response = await result.json();

          if (response.error && response.error.message) {
            const regex = /(\bFile size too large\b)/g;
            if (regex.test(response.error.message)) {
              throw new Error("File size too large upload smaller photo");
            }
          }

          if (!response.url) {
            throw new Error("Image upload failed");
          }

          const url = response.url.toString();
          setPicUrl(url);
        } else {
          throw new Error("Please select an image with jpeg or png format");
        }
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    try {
      //Check if all fields are filled
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.passwordConfirm
      ) {
        throw new Error("Please fill all the fields before submitting");
      }

      if (formData.password !== formData.passwordConfirm) {
        throw new Error("Password and confirm Password does not match");
      }

      //Upload Image to cloudinary
      if (pic) {
        await postDetails(pic);
      }

      //POST /api/v1/users
      //To signup the user
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      const { name, email, password, passwordConfirm } = {
        ...formData,
      };

      const { data } = await axios.post(
        "/api/v1/users",
        {
          name,
          email,
          password,
          passwordConfirm,
          picUrl,
        },
        config
      );

      //Save the response of post request in local storage
      localStorage.setItem("userInfo", JSON.stringify(data));

      //Redirect user to the Chat page
      navigate("/chats");

      alert("User created succesfully");
    } catch (e) {
      console.log(e);
      if (e.response) {
        if (e.response.data.error.code === 11000)
          setError("A user already exist with the provided Email");
      } else setError("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
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
      {error && <ErrorPopup message={error} />}
    </div>
  );
}
