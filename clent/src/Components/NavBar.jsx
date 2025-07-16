import React, { useContext } from "react";
import { assets } from "../assets/assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../Context/AppContext";
const NavBar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const navigate = useNavigate()
  const {setShowRecruiterLogin} = useContext(AppContext)

  return (
    <div className="shadow-md py-4 bg-white">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        <img onClick={()=>navigate('/')} src={assets.logo} alt="Logo" className="w-32 sm:w-40 cursor-pointer" />

        {user ? (
          <div className="flex items-center gap-4 text-sm sm:text-base font-medium text-gray-700">
            <Link
              to={"/applications"}
              className="hover:text-blue-600 transition"
            >
              Applied Jobs
            </Link>
            <span className="text-gray-400">|</span>
            <p className="max-sm:hidden">
              Hi,{" "}
              <span className="font-semibold">
                {user.firstName + " " + user.lastName}
              </span>
            </p>
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <div className="flex gap-3 sm:gap-4 items-center text-sm sm:text-base">
            <button  onClick={e=>setShowRecruiterLogin(true)} className="text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out">
              Recruiter Login
            </button>
            <button
              onClick={(e) => openSignIn()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-full shadow-md transition duration-200"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
