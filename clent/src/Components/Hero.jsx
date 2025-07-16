import React, { useContext, useRef } from "react";
import { assets } from "../assets/assets/assets";
import AppContext from "../Context/AppContext";

const Hero = () => {
    const {setSearchFilter , setIsSearched} = useContext(AppContext)
    const titleRef = useRef(null)
    const locationRef = useRef(null)

    const onSearch = ()=>{
        setSearchFilter({
            title:titleRef.current.value,
            location: locationRef.current.value
        })
        setIsSearched(true)
    }


  return (
    <>
     
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-16 px-4 sm:px-8 rounded-3xl mx-4 sm:mx-12 my-8 shadow-xl">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Over 10,000+ jobs to apply
          </h2>
          <p className="text-sm sm:text-lg text-gray-200 font-light">
            Your Next Big Career Move Starts Right Here – Explore the Best Job
            Opportunities and <br className="hidden sm:block" />
            Take the First Step Toward Your Future!
          </p>

          {/* 🔍 SEARCH BAR */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full flex items-center justify-between p-1 pl-4 shadow-lg max-w-3xl mx-auto mt-6">
            <div className="flex items-center gap-2 flex-1">
              <img
                src={assets.search_icon}
                alt="Search"
                className="w-5 h-5 opacity-100 brightness-125"
              />
              <input ref={titleRef}
                type="text"
                placeholder="Search for jobs"
                className="bg-transparent text-white placeholder:text-gray-300 focus:outline-none w-full text-sm sm:text-base"
              />
            </div>
            <div className="flex items-center gap-2 flex-1 pl-4 border-l border-white/20">
              <img
                src={assets.location_icon}
                alt="Location"
                className="w-5 h-5 opacity-100 brightness-125"
              />
              <input ref ={locationRef}
                type="text"
                placeholder="Location"
                className="bg-transparent text-white placeholder:text-gray-300 focus:outline-none w-full text-sm sm:text-base"
              />
            </div>
            <button onClick={onSearch} className="bg-blue-500 hover:bg-blue-600 transition text-white text-sm sm:text-base px-6 py-2 rounded-full ml-2 font-semibold">
              Search
            </button>
          </div>
        </div>
      </div>

      
      <div className="mt-6 sm:mt-10 bg-white border border-gray-200 rounded-2xl py-6 px-4 sm:px-10 max-w-6xl mx-auto shadow">
        <p className="text-center text-gray-700 text-sm sm:text-base font-medium mb-6">
          Trusted by
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
          <img
            src={assets.microsoft_logo}
            alt="Microsoft"
            className="h-8 sm:h-10 object-contain"
          />
          <img
            src={assets.walmart_logo}
            alt="Walmart"
            className="h-8 sm:h-10 object-contain"
          />
          <img
            src={assets.accenture_logo}
            alt="Accenture"
            className="h-8 sm:h-10 object-contain"
          />
          <img
            src={assets.samsung_logo}
            alt="Samsung"
            className="h-8 sm:h-10 object-contain"
          />
          <img
            src={assets.amazon_logo}
            alt="Amazon"
            className="h-8 sm:h-10 object-contain"
          />
          <img
            src={assets.adobe_logo}
            alt="Adobe"
            className="h-8 sm:h-10 object-contain"
          />
        </div>
      </div>
    </>
  );
};

export default Hero;
