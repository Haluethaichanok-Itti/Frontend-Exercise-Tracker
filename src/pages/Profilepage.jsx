// Profile.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { validateProfile } from "../utils/validateProfile";
import axios from "axios";
import swal from "sweetalert";
import Layout from "../components/Layout";
import ProfileForm from "../components/ProfileForm";
import "../assets/styles/ProfilePage.css";
import Webcam from "react-webcam";
const Profile = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});
  const [srcImg, setSrcImg] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorImg, setErrorImg] = useState("");
  const [openChoose, setOpenChoose] = useState(false);
  const fetchData = async () => {
    const backend = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await axios.get(`${backend}/profile`);
      setUserData(response.data.data);
      setSrcImg(response.data.data.picture);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangePic = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setSrcImg(URL.createObjectURL(file));
      setUserData((prevData) => ({ ...prevData, picture: file }));
      setOpenChoose(false);
      console.log("change");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const backend = import.meta.env.VITE_BACKEND_URL;
    setIsSubmit(true);
    setErrorImg("");

    const error = validateProfile(userData);
    setFormErrors(error);

    if (Object.keys(error).length === 0) {
      setIsProcessing(true);
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      try {
        const response = await axios.put(
          `${backend}/profile/update`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const updateData = response.data.data;
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        Object.assign(currentUser, {
          firstName: updateData.firstName,
          lastName: updateData.lastName,
          email: updateData.email,
          height: updateData.height,
          weight: updateData.weight,
          picture: updateData.picture,
        });
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        swal("Updated!", "Your profile has been updated!", "success");
        navigate("/dashboard");
      } catch (err) {
        console.log(err);
        setIsProcessing(false);
        if (err.request.status === 500) {
          setErrorImg("Invalid file image type!");
        }
        swal("Oops", "Something went wrong!", "error");
      }
    }
  };

  const handleDeleteProfile = async (e) => {
    e.preventDefault();
    const backend = import.meta.env.VITE_BACKEND_URL;
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this account!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.delete(`${backend}/profile/delete`);
          swal("Your account has been deleted!", { icon: "success" });
          localStorage.removeItem("currentUser");
          localStorage.removeItem("token");
          navigate("/");
        } catch (error) {
          console.log(error);
          swal("Oops", "Something went wrong!", "error");
        }
      } else {
        swal("Your account is safe!");
      }
    });
  };

  useEffect(() => {
    fetchData();
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
    setUserData((prevInputs) => ({
      ...prevInputs,
      picture: imageSrc,
    }));
    setOpenChoose(false);
  }, [webcamRef, setUserData]);
  console.log("userData:", userData);
  //close window react webcam
  const uploadRefProfile = useRef(null);
  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      if (!uploadRefProfile.current.contains(e.target)) {
        setOpenChoose(false);
      }
    });
  });
  return (
    <Layout>
      {openChoose && (
        <div className="gb-black" id="boxChoose">
          <div className="choose-box">
            <div className="wrap-select-file">
              <div className="select-file" ref={uploadRefProfile}>
                <div className="btn-wrap-select-file">
                  <label htmlFor="uploadInput" className="upload-img-label">
                    Upload File
                  </label>
                  <input
                    onChange={handleChangePic}
                    name="picture"
                    id="uploadInput"
                    type="file"
                    accept="image/*"
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
      <ProfileForm
        userData={userData}
        srcImg={srcImg}
        formErrors={formErrors}
        isProcessing={isProcessing}
        handleChangePic={handleChangePic}
        handleChange={handleChange}
        handleUpdateProfile={handleUpdateProfile}
        handleDeleteProfile={handleDeleteProfile}
        errorImg={errorImg}
        setOpenChoose={setOpenChoose}
        setSrcImg={setSrcImg}
      />
    </Layout>
  );
};

export default Profile;
