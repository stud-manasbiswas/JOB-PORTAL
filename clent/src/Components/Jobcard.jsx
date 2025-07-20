import React from "react";
import { assets } from "../assets/assets/assets";
import { useNavigate } from "react-router-dom";

const Jobcard = ({ job }) => {
    const navigate = useNavigate()

  return (
    <div className="backdrop-blur-md bg-white/30 border border-white/20 shadow-xl rounded-xl p-6 transition hover:scale-[1.02] duration-200 min-h-[260px] flex flex-col justify-between">
      {/* Top: Company Logo */}
      <div className="flex justify-between items-center mb-2">
        <img
          className="h-8 object-contain"
          src={job.companyId.image}
          alt="company-logo"
        />
      </div>

      {/* Job Title */}
      <h4 className="font-semibold text-lg text-gray-900 mb-2">{job.title}</h4>

      {/* Tags: Location and Level */}
      <div className="flex flex-wrap gap-2 text-xs mb-3">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
          {job.location}
        </span>
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
          {job.level}
        </span>
      </div>

      {/* Description */}
      <p
        className="text-sm text-gray-800 mb-4 line-clamp-3"
        dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }}
      ></p>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mt-auto">
        <button onClick={()=>{navigate(`/apply-job/${job._id}`); scrollTo(0,0)}} className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow hover:bg-blue-700 transition">
          Apply now
        </button>
        <button onClick={()=>{navigate(`/apply-job/${job._id}`); scrollTo(0,0)}}  className="border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-100 transition">
          Learn more
        </button>
      </div>
    </div>
  );
};

export default Jobcard;
