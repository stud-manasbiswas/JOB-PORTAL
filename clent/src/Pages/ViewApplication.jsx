import React, { useContext, useEffect, useState } from "react";
import { assets, viewApplicationsPageData } from "../assets/assets/assets";
import AppContext from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../Components/Loading";

const ViewApplication = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const [applicants, setApplicants] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state for actions

  // ENHANCED: function to fetch company job applications data with debugging
  const fetchCompanyJobApplications = async () => {
    console.log("📡 Fetching applications...");
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { token: companyToken },
      });

      console.log("📋 Fetch response:", data);
      
      if (data.success) {
        console.log("📋 Applications data:", data.applications);
        console.log("📋 Total applications:", data.applications.length);
        
        // Log first few applications with their status
        data.applications.slice(0, 3).forEach((app, index) => {
          console.log(`📋 App ${index + 1} status:`, app.status);
        });
        
        // Filter out invalid applications on the frontend as well
        const validApplications = data.applications.filter(
          (app) => app.jobId && app.userId && app.jobId._id && app.userId._id
        );
        console.log("📋 Valid applications:", validApplications.length);
        setApplicants(validApplications.reverse());
      } else {
        console.error("❌ Fetch failed:", data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
      toast.error(error.message || "Failed to fetch applications");
    }
  };

  // ENHANCED: Function with comprehensive debugging
  const changeJobApplicationStatus = async (id, status) => {
    setLoading(true); // Show loading state
    console.log(`🔄 Starting status change for ${id} to ${status}`);
    console.log(`🔗 Backend URL: ${backendUrl}`);
    console.log(`🔑 Company Token: ${companyToken ? 'Present' : 'Missing'}`);
    
    try {
      const requestData = { id, status };
      const requestConfig = {
        headers: { 
          token: companyToken,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      };
      
      console.log(`📤 Sending request:`, {
        url: `${backendUrl}/api/company/change-status`,
        data: requestData,
        headers: requestConfig.headers
      });
      
      const response = await axios.post(
        `${backendUrl}/api/company/change-status`,
        requestData,
        requestConfig
      );
      
      console.log("📥 Full response:", response);
      console.log("📥 Response data:", response.data);
      console.log("📥 Response status:", response.status);
      
      const data = response.data;
      
      if (data.success) {
        console.log("✅ Status update successful");
        toast.success(`Application ${status} successfully!`);
        setDropdownOpen(null);
        
        // Update local state immediately
        setApplicants(prevApplicants => 
          prevApplicants.map(app => 
            app._id === id ? { ...app, status: status } : app
          )
        );
        
        // Refresh data from server
        console.log("🔄 Refreshing applications data...");
        await fetchCompanyJobApplications();
        
      } else {
        console.error("❌ Backend returned success=false:", data);
        toast.error(data.message || "Failed to update status");
      }
      
    } catch (error) {
      console.error("❌ Request failed:", error);
      
      if (error.code === 'ECONNABORTED') {
        console.error("❌ Request timeout");
        toast.error("Request timeout - please try again");
      } else if (error.response) {
        console.error("❌ Response error:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        });
        toast.error(error.response?.data?.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        console.error("❌ Network error - no response received:", error.request);
        toast.error("Network error - please check your connection");
      } else {
        console.error("❌ Unknown error:", error.message);
        toast.error(error.message || "Unknown error occurred");
      }
    } finally {
      console.log("🏁 Finishing status change process");
      setLoading(false);
    }
  };

  // Toggle dropdown for specific applicant
  const toggleDropdown = (applicantId) => {
    setDropdownOpen(dropdownOpen === applicantId ? null : applicantId);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = () => {
    setDropdownOpen(null);
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications();
    }
    
    // Add click listener to close dropdowns
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [companyToken]);

  return applicants ? (
    applicants.length === 0 ? (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <p className="text-gray-500">No applications found.</p>
        </div>
      </div>
    ) : (
      <div className="container mx-auto p-4">
        <div>
          <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">User name</th>
                <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
                <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
                <th className="py-2 px-4 text-left">Resume</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant, index) => {
                // Additional safety checks
                const user = applicant.userId;
                const job = applicant.jobId;

                // Skip rendering if essential data is missing
                if (!user || !job || !user._id || !job._id) {
                  return null;
                }

                // FIXED: Handle "Pending" (capital P) from backend
                const currentStatus = (applicant.status || "Pending").toLowerCase();
                const isPending = currentStatus === "pending";

                return (
                  <tr key={applicant._id || index} className="text-gray-700">
                    <td className="py-2 px-4 border-b text-center">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 border-b text-center flex items-center">
                      {user.image && (
                        <img
                          className="w-10 h-10 rounded-full mr-3 max-sm:hidden"
                          src={user.image}
                          alt={user.name || "User"}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                      <span>{user.name || "Unknown User"}</span>
                    </td>
                    <td className="py-2 px-4 border-b max-sm:hidden">
                      {job.title || "No Title"}
                    </td>
                    <td className="py-2 px-4 border-b max-sm:hidden">
                      {job.location || "No Location"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {user.resume ? (
                        <a
                          href={user.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center hover:bg-blue-100"
                        >
                          Resume
                          {assets?.resume_download_icon && (
                            <img
                              src={assets.resume_download_icon}
                              alt="Download"
                            />
                          )}
                        </a>
                      ) : (
                        <span className="text-gray-400">No Resume</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b relative">
                      {isPending ? (
                        <div className="relative inline-block text-left">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(applicant._id);
                            }}
                            disabled={loading} // FIXED: Disable during loading
                            className={`px-3 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              loading 
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            {loading ? "Processing..." : "Actions ▼"}
                          </button>
                          
                          {dropdownOpen === applicant._id && !loading && (
                            <div 
                              className="absolute right-0 md:left-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => changeJobApplicationStatus(applicant._id, "Accepted")}
                                className="block w-full text-left px-4 py-2 text-green-600 hover:bg-green-50 border-b"
                                disabled={loading}
                              >
                                ✓ Accept
                              </button>
                              <button
                                onClick={() => changeJobApplicationStatus(applicant._id, "Rejected")}
                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                disabled={loading}
                              >
                                ✗ Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={`px-3 py-1 rounded text-sm font-medium ${
                          currentStatus === "accepted" 
                            ? "bg-green-100 text-green-800" 
                            : currentStatus === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {applicant.status || "Pending"}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  ) : (
    <Loading />
  );
};

export default ViewApplication;