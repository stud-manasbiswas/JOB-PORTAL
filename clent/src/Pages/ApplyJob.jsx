import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../Context/AppContext";
import Loading from "../Components/Loading";
import NavBar from "../Components/NavBar";
import { assets } from "../assets/assets/assets";
import kConvert from "k-convert";
import moment from "moment";
import Jobcard from "../Components/Jobcard";
import Footer from "../Components/Footer";

const ApplyJob = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { jobs } = useContext(AppContext);

  useEffect(() => {
    const fetchJob = () => {
      const data = jobs.find((job) => job._id === id);
      if (data) {
        setJobData(data);
      }
      setIsLoading(false);
    };
    fetchJob();
  }, [id, jobs]);

  if (isLoading) return <Loading />;

  if (!jobData) {
    return (
      <div className="p-8 text-center text-gray-600">
        Job not found or invalid job ID.
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-black">
      <NavBar />
      <div className="min-h-screen py-10 container px-4 2xl:px-20 mx-auto">
        {/* Header card */}
        <div className="bg-blue-100 rounded-xl shadow-md w-full mb-6">
          <div className="flex justify-between flex-wrap gap-8 px-6 sm:px-14 py-12 sm:py-20 border border-gray-200 rounded-xl">
            <div className="flex flex-col md:flex-row items-center text-center md:text-left">
              <img
                className="h-24 w-24 object-contain bg-white rounded-xl p-3 mr-4 max-md:mb-4 border border-gray-200 shadow-sm"
                src={jobData.companyId.image}
                alt=""
              />
              <div className="text-neutral-800">
                <h1 className="text-2xl sm:text-4xl font-semibold">
                  {jobData.title}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4 text-sm text-gray-700">
                  <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full border border-gray-300 shadow-sm">
                    <img src={assets.suitcase_icon} alt="" className="w-4 h-4" />
                    {jobData.companyId.name}
                  </span>
                  <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full border border-gray-300 shadow-sm">
                    <img src={assets.location_icon} alt="" className="w-4 h-4" />
                    {jobData.location}
                  </span>
                  <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full border border-gray-300 shadow-sm">
                    <img src={assets.person_icon} alt="" className="w-4 h-4" />
                    {jobData.label}
                  </span>
                  <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full border border-gray-300 shadow-sm">
                    <img src={assets.money_icon} alt="" className="w-4 h-4" />
                    CTC: ₹{kConvert.convertTo(jobData.salary, "Lakh")}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition">
                Apply Now
              </button>
              <p className="mt-2 text-sm text-gray-600">
                Posted {moment(jobData.date).fromNow()}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column */}
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          {/* Left: Job Description */}
          <div className="w-full lg:w-2/3 bg-white p-6 sm:p-10 rounded-xl shadow border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Job Description
            </h2>
            <div
              className="text-gray-700 leading-relaxed space-y-4 [&>*:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: jobData.description }}
            />
            <button className="mt-6 mb-0 px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition">
              Apply Now
            </button>
          </div>

          {/* Right: More Jobs */}
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">
              More jobs from {jobData.companyId.name}
            </h2>
            {jobs
              .filter(
                (job) =>
                  job._id !== jobData._id &&
                  job.companyId._id === jobData.companyId._id
              )
              .slice(0, 3)
              .map((job, index) => (
                <Jobcard key={index} job={job} />
              ))}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ApplyJob;
