import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets/assets";
import { useContext } from "react";
import AppContext from "../Context/AppContext";
import { useEffect } from "react";

const Dashboard = () => {
  const {companyData,setCompanyData , setCompanyToken} = useContext(AppContext)
  // function to logout from the company
  const logout = ()=>{
    setCompanyToken(null);
    localStorage.removeItem('companyToken')
    setCompanyData(null)
    navigate('/')
  }
  useEffect(()=>{
    if(companyData){
      navigate('/dashboard/manage-jobs')
    }
  },[companyData])

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="shadow py-4">
        <div className="px-5 flex justify-between items-center">
          <img onClick={() => navigate("/")} src={assets.logo} alt="logo" className="cursor-pointer" />
          {companyData && (
            <div className="flex items-center gap-3">

            

            <p className="max-sm:hidden">Welcome, {companyData.name}</p>
            <div className="relative group">
              <img
                className="w-8 h-8 border rounded-full object-cover"
                src={companyData.image}
                alt="company"
              />
              <div className="absolute hidden group-hover:block top-full right-0 z-10 text-black rounded">
                <ul className="bg-white rounded-md text-sm shadow-md">
                  <li className="py-1 px-4 cursor-pointer hover:bg-gray-100" onClick={logout}>Logout</li>
                </ul>
              </div>
            </div>
          </div>

          )}
         
          
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-[220px] border-r-2 min-h-screen bg-white">
          <ul className="flex flex-col items-start pt-5 text-gray-800">
            <NavLink
              to={"add-job"}
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                  isActive && "bg-blue-100 border-r-4 border-blue-500"
                }`
              }
            >
              <img src={assets.add_icon} alt="Add" className="w-5 h-5" />
              <p className="max-sm:hidden">Add Job</p>
            </NavLink>
            <NavLink
              to={"manage-jobs"}
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                  isActive && "bg-blue-100 border-r-4 border-blue-500"
                }`
              }
            >
              <img src={assets.home_icon} alt="Manage" className="w-5 h-5" />
              <p className="max-sm:hidden">Manage Jobs</p>
            </NavLink>
            <NavLink
              to={"view-applications"}
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                  isActive && "bg-blue-100 border-r-4 border-blue-500"
                }`
              }
            >
              <img src={assets.person_tick_icon} alt="Applications" className="w-5 h-5" />
              <p className="max-sm:hidden">View Applications</p>
            </NavLink>
          </ul>
        </div>

        {/* Main dynamic content (Outlet) */}
        <div className="flex-1 px-6 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
