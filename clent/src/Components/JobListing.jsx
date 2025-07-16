import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/AppContext";
import { assets, JobCategories, JobLocations } from "../assets/assets/assets";
import Jobcard from "./Jobcard";

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext);

  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocation, setSelectedLocations] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const jobsPerPage = 6;

  // Apply filters whenever selection or jobs change
useEffect(() => {
  let filtered = jobs;

  // Filter by selected categories
  if (selectedCategories.length > 0) {
    filtered = filtered.filter((job) =>
      selectedCategories.includes(job.category)
    );
  }

  // Filter by selected locations
  if (selectedLocation.length > 0) {
    filtered = filtered.filter((job) =>
      selectedLocation.includes(job.location)
    );
  }

  // Filter by search title (case-insensitive)
  if (searchFilter.title.trim() !== "") {
    filtered = filtered.filter((job) =>
      job.title.toLowerCase().includes(searchFilter.title.toLowerCase())
    );
  }

  // Filter by search location (case-insensitive)
  if (searchFilter.location.trim() !== "") {
    filtered = filtered.filter((job) =>
      job.location.toLowerCase().includes(searchFilter.location.toLowerCase())
    );
  }

  setFilteredJobs(filtered);
  setCurrentPage(1); 
}, [selectedCategories, selectedLocation, searchFilter, jobs]);


  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((c) => c !== location) : [...prev, location]
    );
  };

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      window.scrollTo({ top: document.getElementById("job-list").offsetTop, behavior: "smooth" });
    }
  };

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      {/* Sidebar */}
      <div className="px-4 sm:px-10 mt-6 w-full lg:w-1/3">
        {isSearched && (searchFilter.title.trim() !== "" || searchFilter.location.trim() !== "") && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Search</h3>
            <div className="flex gap-3 flex-wrap mb-6">
              {searchFilter.title && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium shadow">
                  {searchFilter.title}
                  <img
                    onClick={() => setSearchFilter((prev) => ({ ...prev, title: "" }))}
                    src={assets.cross_icon}
                    alt="Clear title"
                    className="w-4 h-4 cursor-pointer"
                  />
                </span>
              )}
              {searchFilter.location && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium shadow">
                  {searchFilter.location}
                  <img
                    onClick={() => setSearchFilter((prev) => ({ ...prev, location: "" }))}
                    src={assets.cross_icon}
                    alt="Clear location"
                    className="w-4 h-4 cursor-pointer"
                  />
                </span>
              )}
            </div>
          </>
        )}

        <button onClick={() => setShowFilter((prev) => !prev)} className="px-6 py-1.5 rounded border border-gray-400 lg:hidden">
          {showFilter ? "Close" : "Filters"}
        </button>

        {/* Category Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Search by Categories</h4>
          <ul className="space-y-3 text-gray-800 text-sm font-medium">
            {JobCategories.map((category, index) => (
              <li key={index} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  onChange={() => handleCategoryChange(category)}
                  checked={selectedCategories.includes(category)}
                />
                <label className="cursor-pointer">{category}</label>
              </li>
            ))}
          </ul>
        </div>

        {/* Location Filter */}
        <div className={showFilter ? "" : "max-lg:hidden mt-8"}>
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Search by Location</h4>
          <ul className="space-y-3 text-gray-800 text-sm font-medium">
            {JobLocations.map((location, index) => (
              <li key={index} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  onChange={() => handleLocationChange(location)}
                  checked={selectedLocation.includes(location)}
                />
                <label className="cursor-pointer">{location}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Job Listings */}
      <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
        <h3 className="font-medium text-3xl py-2" id="job-list">Latest Jobs</h3>
        <p className="mb-8">Get your desired job from top companies</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {currentJobs.map((job, index) => (
            <Jobcard key={index} job={job} />
          ))}
        </div>

        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className="flex items-center justify-center space-x-2 mt-10">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              <img src={assets.left_arrow_icon} alt="Previous" className="w-4 h-4 opacity-80 hover:opacity-100" />
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index + 1)}
                className={`mx-1 px-3 py-1 rounded-full text-sm font-medium ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-blue-100 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
              <img src={assets.right_arrow_icon} alt="Next" className="w-4 h-4 opacity-80 hover:opacity-100" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListing;
