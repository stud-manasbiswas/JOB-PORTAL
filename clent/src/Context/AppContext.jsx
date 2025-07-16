import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets/assets";

// 1. Create Context
const AppContext = createContext();

// 2. Create Provider Component
export const AppContextProvider = ({ children }) => {
    const [searchFilter ,setSearchFilter] = useState({
        title:'',
        location:''
    })

    const [isSearched , setIsSearched] = useState(false)

    const [jobs,setJobs] = useState([]);
  const[showRecruiterLogin ,setShowRecruiterLogin] =useState(false)

    // function to fetch jobd 
    const fetchJobs = async ()=>{
        setJobs(jobsData)
    }
    useEffect(()=>{
        fetchJobs()
    },[])
   

  const value = {
    setSearchFilter,searchFilter,
    isSearched,setIsSearched,
    jobs,setJobs,
    showRecruiterLogin,setShowRecruiterLogin
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// 3. Export Context
export default AppContext;
