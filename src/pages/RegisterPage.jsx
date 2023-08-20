import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { validate } from "../utils/validateRegister";
import RegisterForm from "../components/authenticateComponents/RegisterForm";
import Layout from "../components/Layout";
import axios from "axios";
import Cat from "/hero/hero-img.png";
import "../assets/styles/authenticateCSS/RegisterPage.css";
import swal from "sweetalert";
import Webcam from "react-webcam";
function FormRegister() {
  // useStates and variables
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [srcImg, setSrcImg] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [error, setError] = useState("");
  const [errorImg, setErrorImg] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [openChoose, setOpenChoose] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    confirmpassword: "",
    picture: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    weight: "",
    height: "",
  });

  // Function to handle change in input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  function handleFileChange(e) {
    const { files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setSrcImg(URL.createObjectURL(file));
      setFormValues((prevInputs) => ({ ...prevInputs, picture: file }));
      setOpenChoose(false);
    }
  }

  // Function to handle save inputs
  const saveInput = async (e) => {
    e.preventDefault();
    const backend = import.meta.env.VITE_BACKEND_URL;
    setErrorImg("");
    setIsSubmit(true);

    const error = validate(formValues);

    setFormErrors(error);

    if (Object.keys(error).length === 0) {
      setIsProcessing(!isProcessing);
      const { confirmpassword, ...userData } = formValues;

      const formData = new FormData();

      for (const [key, value] of Object.entries(userData)) {
        formData.append(key, value);
      }

      try {
        const response = await axios.post(
          `${backend}/auth/register`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        swal("Registered!", "Let's get started!", "success");
        navigate("/login");
      } catch (error) {
        setError(error.response.data.message);
        setIsSubmit(false);
        setIsProcessing(false);
        if (error.request.status === 500) {
          setErrorImg("Invalid file image type!");
        }
        swal("Oops", "Something went wrong!", "error");
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //react webcam
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const webcamRef = useRef(null);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSrcImg(imageSrc);
    setFormValues((prevInputs) => ({
      ...prevInputs,
      picture: imageSrc,
    }));
    setOpenChoose(false);
  }, [webcamRef, setFormValues]);

  //close window react webcam
  const uploadRef = useRef(null);
  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      if (!uploadRef.current.contains(e.target)) {
        setOpenChoose(false);
      }
    });
  });

  return (
    <Layout>
      <section className="fullpage">
        {openChoose && (
          <div className="gb-black">
            <div className="choose-box">
              <div className="wrap-select-file">
                <div className="select-file" ref={uploadRef}>
                  <div className="btn-wrap-select-file">
                    <label htmlFor="uploadInput" className="upload-img-label">
                      Upload File
                    </label>
                    <input
                      onChange={handleFileChange}
                      name="picture"
                      id="uploadInput"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </div>
                  <div className="btn-wrap-select-file">
                    <button onClick={capture}>Capture photo</button>
                  </div>
                </div>
              </div>
              {/* selfie */}
              <Webcam
                audio={false}
                height={380}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={1280}
                videoConstraints={videoConstraints}
              />
            </div>
          </div>
        )}
        <RegisterForm
          className="left-form"
          srcImg={srcImg}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          formValues={formValues}
          formErrors={formErrors}
          saveInput={saveInput}
          error={error}
          isProcessing={isProcessing}
          errorImg={errorImg}
          setSrcImg={setSrcImg}
          setFormValues={setFormValues}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          setIsSubmit={setIsSubmit}
          openChoose={openChoose}
          setOpenChoose={setOpenChoose}
        />
        <div className="register-cats">
          <img src={Cat} alt="Muscular Orange Cat" className="right" />
        </div>
      </section>
    </Layout>
  );
}

export default FormRegister;
