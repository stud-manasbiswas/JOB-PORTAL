import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios"; // ✅ Missing import added
import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
// 1. Create Context
export const AppContext = createContext()

// 2. Create Provider Component
export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useUser();
  const { getToken } = useAuth();

  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

  // ✅ Function to fetch job (currently uses local dummy data)
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`);
      if (data.success) {
        setJobs(data.jobs);
        console.log(data.jobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Function to fetch company data securely with token
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        headers: { token: companyToken },
      });

      if (data.success) {
        setCompanyData(data.company);
        console.log("✅ Company data loaded:", data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to fetch user data
const fetchUserData = async () => {
  try {
    const token = await getToken();
    console.log("📦 Clerk Token:", token);

    if (!token) {
      toast.error("No Clerk token found");
      return;
    }

    const response = await axios.get(`${backendUrl}/api/users/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("🔁 Response from /api/users/user:", response);

    if (response && response.data && response.data.success) {
      setUserData(response.data.user);
    } else {
      toast.error(response?.data?.message || "User fetch failed");
    }

  } catch (error) {
    console.error("❌ Axios error:", error);
    toast.error(error?.response?.data?.message || error.message);
  }
};

//get user application data 
const fetchUserApplications = async()=>{
  try {
    const token = await getToken()
    const {data} = await axios.get(`${backendUrl}/api/users/applications`,

      {headers:{Authorization: `Bearer ${token}`}}
    )
    if(data.success){
      setUserApplications(data.applications)
    }
    else{
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
    
  }
}







  // ✅ Get token from localStorage on mount

  useEffect(() => {
    fetchJobs();
    const storedCompanyToken = localStorage.getItem("companyToken");
    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
    }
  }, []); // 👈 only run once!

  // ✅ Safe to keep this separate, as you had it
  useEffect(() => {
    fetchJobs();
  }, []);



  // ✅ Refetch company data if token changes
  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  // useEffect
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [user]);


  

  const value = {
    setSearchFilter,
    searchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken, // 👈 Fix typo: was ssetCompanyToken in RecruiterLogin
    companyData,
    setCompanyData,
    userData, // ✅ add this
    setUserData, // ✅ add this
    userApplications,
    setUserApplications,
    backendUrl,
    fetchUserData,
    fetchUserApplications
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// 3. Export Context
export default AppContext;
