import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'

import Home from './Pages/Home'
import ApplyJob from './Pages/ApplyJob'
import Applications from './Pages/Applications'
import RecruiterLogin from './Components/RecruiterLogin'
import AppContext from './Context/AppContext'
import Dashboard from './Pages/Dashboard'
import AddJob from './Pages/AddJob'
import ManageJobs from './Pages/ManageJobs'
import ViewApplication from './Pages/ViewApplication'
import 'quill/dist/quill.snow.css'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'




const App = () => {
  const { showRecruiterLogin , companyToken } = useContext(AppContext)

  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      <ToastContainer/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Applications />} />

        {/* 🛠️ FIXED: Nested routes must be relative */}
        <Route path="/dashboard" element={<Dashboard />}>
          {companyToken ? <>
            <Route path="add-job" element={<AddJob />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route path="view-applications" element={<ViewApplication />} />
          
          </> : null}
          
        </Route>
      </Routes>
    </div>
  )
}

export default App
