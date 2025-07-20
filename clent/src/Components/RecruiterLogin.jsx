import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets/assets.js";
import AppContext from "../Context/AppContext";
import axios from 'axios';
import {useNavigate}  from 'react-router-dom'
import { toast } from "react-toastify";

const RecruiterLogin = () => {

  const navigate = useNavigate()

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [image, setImage] = useState(false);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);
  const { setShowRecruiterLogin ,backendUrl , setCompanyToken , setCompanyData} = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (state === "Sign Up" && !isTextDataSubmitted) {
       return setIsTextDataSubmitted(true);
    }
    try {
      if (state==='Login') {
         const { data } = await axios.post(`${backendUrl}/api/company/login`, {
    email,
    password
  });

        if(data.success){
          
          setCompanyData(data.company)
          setCompanyToken(data.token)
          localStorage.setItem('companyToken',data.token)
          setShowRecruiterLogin(false)
          navigate('/dashboard')

        }
        else {
          toast.error(data.message)
        }


      }
      else{
        const formData = new FormData()
        formData.append('name',name)
        formData.append('password',password)
        formData.append('email',email)
        console.log(image) 
        formData.append('image',image)

        const {data} = await axios.post(`${backendUrl}/api/company/register`, formData)

        if(data.success){
            
          setCompanyData(data.company)
          setCompanyToken(data.token)
          localStorage.setItem('companyToken',data.token)
          setShowRecruiterLogin(false)
          navigate('/dashboard')
        }
        else{
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  });
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white rounded-xl shadow-2xl px-8 py-10 w-[90%] max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Recruiter {state}
        </h1>
        <p className="text-center text-gray-500 text-sm">
          Welcome back! Please sign in to continue
        </p>
        { state === "Sign Up" && isTextDataSubmitted ? (
          <>
            <div className="flex item-center gap-4 my-10">
              <label htmlFor="image">
                <img
                  className="w-16 rounded-full"
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt=""
                />
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  hidden
                  id="image"
                />
              </label>
              <p>
                Upload company <br /> Logo
              </p>
            </div>
          </>
        ) : (
          <>
            {state !== "Login" && (
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 gap-3 focus-within:ring-2 focus-within:ring-blue-400 bg-gray-50">
                <img src={assets.person_icon} alt="" className="h-5 w-5" />
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Company Name"
                  required
                  className="w-full outline-none text-sm text-gray-700 bg-transparent"
                />
              </div>
            )}

            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 gap-3 focus-within:ring-2 focus-within:ring-blue-400 bg-gray-50">
              <img src={assets.email_icon} alt="" className="h-5 w-5" />
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email Id"
                required
                className="w-full outline-none text-sm text-gray-700 bg-transparent"
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 gap-3 focus-within:ring-2 focus-within:ring-blue-400 bg-gray-50">
              <img src={assets.lock_icon} alt="" className="h-5 w-5" />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
                className="w-full outline-none text-sm text-gray-700 bg-transparent"
              />
            </div>
          </>
        )}
        {state === "Login" && (
          <p className="text-sm text-blue-600 my-4 cursor-pointer">
            Forgot Password
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r mt-4 from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition duration-200 font-semibold shadow-md"
        >
          {state === "Login"
            ? "Login"
            : isTextDataSubmitted
            ? "Create Account"
            : "next"}
        </button>
        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Sign Up")}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already hava an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Login")}
            >
              Login
            </span>
          </p>
        )}

        <img
          onClick={() => {
            ;
            setShowRecruiterLogin(false);
          }}
          className="absolute top-5 right-5 z-50 cursor-pointer w-5 h-5"
          src={assets.cross_icon}
          alt="Close"
        />
      </form>
    </div>
  );
};

export default RecruiterLogin;
