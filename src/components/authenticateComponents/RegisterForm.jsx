import React, { useRef, useCallback, useState } from "react";
import "../../assets/styles/authenticateCSS/RegisterForm.css";
import BarLoader from "react-spinners/BarLoader";
import Webcam from "react-webcam";

const RegisterForm = ({
  srcImg,
  handleChange,
  handleFileChange,
  formValues,
  formErrors,
  saveInput,
  error,
  isProcessing,
  errorImg,
  setSrcImg,
  setFormValues,
  imageUrl,
  setImageUrl,
}) => {
  const [openChoose, setOpenChoose] = useState(false);
  const openWindow = (e) => {
    setOpenChoose(true);
  };
  //camera
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const webcamRef = useRef(null);

  // const capture = useCallback(() => {
  //   const imageSrc = webcamRef.current.getScreenshot();
  //   setSrcImg(imageSrc); // Store the captured image in state

  //   // setFormValues((prevInputs) => ({
  //   //   ...prevInputs,
  //   //   picture: imageSrc, // Store the captured image in formValues
  //   // }));

  //   //try
  //   // // Extract the base64-encoded data part of the URI
  //   // const base64Data = imageSrc.split(",")[1];

  //   // // Convert base64-encoded data to binary data
  //   // const binaryData = atob(base64Data);

  //   // // Create a Uint8Array from binary data
  //   // const uint8Array = new Uint8Array(binaryData.length);
  //   // for (let i = 0; i < binaryData.length; i++) {
  //   //   uint8Array[i] = binaryData.charCodeAt(i);
  //   // }
  //   // // Create a Blob object from Uint8Array
  //   // const blob = new Blob([uint8Array], { type: "image/jpeg" });

  //   // Generate a URL from the Blob
  //   // const imageUrl = URL.createObjectURL(blob);
  //   setImageUrl(URL.createObjectURL(blob));

  //   // Now, you can use the imageUrl to display or save the image
  //   console.log("Image URL:", imageUrl);

  //   // setFormValues((prevInputs) => ({
  //   //   ...prevInputs,
  //   //   picture: imageUrl, // Store the captured image in formValues
  //   // }));

  //   const base64Data = imageSrc.split(",")[1];
  //   const binaryData = atob(base64Data);
  //   const uint8Array = new Uint8Array(binaryData.length);
  //   for (let i = 0; i < binaryData.length; i++) {
  //     uint8Array[i] = binaryData.charCodeAt(i);
  //   }
  //   const blob = new Blob([uint8Array], { type: "image/jpeg" });

  //   // Convert the Blob to a File
  //   const file = new File([blob], "image.jpg", { type: "image/jpeg" });

  //   setFormValues((prevInputs) => ({
  //     ...prevInputs,
  //     picture: file,
  //   }));
  // }, [setSrcImg, setFormValues]);
  // const capture = useCallback(() => {
  //   const imageSrc = webcamRef.current.getScreenshot();

  //   // Convert the base64 image data to a Blob
  //   const byteCharacters = atob(imageSrc.split(",")[1]);
  //   const byteNumbers = new Array(byteCharacters.length);
  //   for (let i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }
  //   const byteArray = new Uint8Array(byteNumbers);
  //   const blob = new Blob([byteArray], { type: "image/jpeg" });

  //   // Create a File object from the Blob
  //   const file = new File([blob], "image.jpg", { type: "image/jpeg" });
  //   // Store the captured image in state for display
  //   setSrcImg(imageSrc);
  //   console.log(srcImg);
  //   // Update the form values with the captured image
  //   setFormValues((prevInputs) => ({
  //     ...prevInputs,
  //     picture: srcImg,
  //   }));

  //   // // Store the captured image in state for display
  //   // setSrcImg(imageSrc);
  // }, [setSrcImg, setFormValues]);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSrcImg(imageSrc);
    setFormValues((prevInputs) => ({
      ...prevInputs,
      // picture: srcImg,
      picture: imageSrc,
    }));
  }, [webcamRef, setFormValues]);
  console.log("formval:", formValues);
  // console.log("Type of srcImg:", typeof srcImg);
  // console.log(srcImg);
  //Function Reset photo
  const handleOnReset = () => {
    setSrcImg("");
  };
  return (
    <form onSubmit={saveInput} className="form">
      <h1 className="register-title">Register</h1>

      {/* Profile Picture */}

      <div className="wrap">
        <label htmlFor="uploadInput">
          <img
            id="profilePhoto"
            // src={srcImg}
            src={srcImg}
            className={srcImg ? "uploaded-picture" : ""}
          />
        </label>

        {/* {srcImg && (
          <label htmlFor="uploadInput">
            <div className="captured-image-container">
              <img
                id="profilePhoto"
                src={srcImg}
                alt="Captured"
                // className="captured-image"
              />
            </div>
          </label>
        )} */}

        <div className="plus-symbols" onClick={openWindow}>
          <button>+</button>
        </div>
      </div>
      {openChoose && (
        <div className="gb-black">
          <div className="choose-box">
            <label htmlFor="uploadInput">
              <input
                onChange={handleFileChange}
                name="picture"
                id="uploadInput"
                type="file"
                accept="image/*"
              />
              <button onClick={capture}>Capture photo</button>
              <button onClick={handleOnReset}>Reset photo</button>
            </label>
            {/* selfie */}
            <Webcam
              audio={false}
              height={120}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={1280}
              videoConstraints={videoConstraints}
            />

            {/* {capturedImage && (
              <div className="captured-image-container">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="captured-image"
                />
              </div>
            )} */}
          </div>
        </div>
      )}

      <div className="allInform">
        {/* First Name */}
        <div className="register-field-container">
          <label className="labelInput">First Name*</label>
          <input
            onChange={handleChange}
            name="firstName"
            value={formValues.firstName}
            type="text"
            placeholder="First Name"
          />
          <span className="texterr"> {formErrors.firstName}</span>
        </div>

        {/* Last Name */}
        <div className="register-field-container">
          <label className="labelInput">Last Name*</label>
          <input
            onChange={handleChange}
            name="lastName"
            value={formValues.lastName}
            type="text"
            placeholder="Last Name"
          />
          <span className="texterr"> {formErrors.lastName}</span>
        </div>

        {/* Date of Birth */}
        <div className="register-field-container">
          <label className="labelInput">Date of Birth*</label>
          <input
            onChange={handleChange}
            value={formValues.birthDate}
            name="birthDate"
            type="date"
            placeholder="Date of Birth"
            max={new Date(
              new Date().getFullYear() - 7,
              new Date().getMonth(),
              new Date().getDate()
            )
              .toISOString()
              .slice(0, 10)}
          />
          <span className="texterr"> {formErrors.birthDate}</span>
        </div>

        {/* Weight */}
        <div className="register-field-container">
          <label className="labelInput">Weight*</label>
          <input
            onChange={handleChange}
            value={formValues.weight}
            name="weight"
            type="number"
            placeholder="Weight (in kg.)"
          />
          <span className="texterr"> {formErrors.weight}</span>
        </div>

        {/* Height */}
        <div className="register-field-container">
          <label className="labelInput">Height* </label>
          <input
            onChange={handleChange}
            value={formValues.height}
            name="height"
            type="number"
            placeholder="Height (in cm.)"
          />
          <span className="texterr"> {formErrors.height}</span>
        </div>

        {/* Email */}
        <div className="register-field-container">
          <label className="labelInput">Email*</label>
          <input
            onChange={handleChange}
            value={formValues.email}
            name="email"
            type="text"
            placeholder="Email"
          />
          <span className="texterr"> {formErrors.email}</span>
        </div>

        {/* Password */}
        <div className="register-field-container">
          <label className="labelInput">Password*</label>
          <input
            onChange={handleChange}
            value={formValues.password}
            name="password"
            type="password"
            placeholder="Password"
          />
          <span className="texterr"> {formErrors.password}</span>
        </div>

        {/* Confirm Password */}
        <div className="register-field-container">
          <label className="labelInput">Confirm Password*</label>
          <input
            onChange={handleChange}
            value={formValues.confirmpassword}
            name="confirmpassword"
            type="password"
            placeholder="Confirm Password"
          />
          <span className="texterr"> {formErrors.confirmpassword}</span>
        </div>
      </div>

      {/* Gender */}
      <div className="radio">
        <input
          onChange={handleChange}
          value="male"
          name="gender"
          id="1"
          type="radio"
          checked={formValues.gender === "male"}
          className="selctor"
        />
        <label>Male</label>
        <input
          onChange={handleChange}
          type="radio"
          name="gender"
          id="2"
          value="female"
          checked={formValues.gender === "female"}
          className="selctor"
        />
        <label>Female</label>
      </div>
      <span className="texterr"> {formErrors.gender}</span>

      {/* Submit Button */}
      <button type="submit" className="register-button" disabled={isProcessing}>
        <span>{isProcessing ? "Registering ... " : "Register"}</span>
      </button>
      {isProcessing ? (
        <div className="loading-icon">
          <BarLoader
            color="#FF7B54"
            size={500}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : null}
      {error && <div className="error-message">*{error}*</div>}
      {errorImg && <div className="error-message">*{errorImg}*</div>}
    </form>
  );
};

export default RegisterForm;
