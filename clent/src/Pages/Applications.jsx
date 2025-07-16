import React, { useState } from 'react'
import NavBar from '../Components/NavBar'
import { assets, jobsApplied } from '../assets/assets/assets'
import moment from 'moment'
import Footer from '../Components/Footer'

const Applications = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)

  return (
    <>
      <NavBar />
      <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>Your Resume</h2>

        <div className='flex flex-col sm:flex-row gap-4 items-start mb-6 mt-3'>
          {isEdit ? (
            <>
              <label
                htmlFor="resumeupload"
                className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50 border border-gray-300 px-4 py-3 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition"
              >
                <p className="text-sm text-gray-700">Select Resume</p>
                <input
                  id='resumeupload'
                  onChange={e => setResume(e.target.files[0])}
                  accept='application/pdf'
                  type='file'
                  className='hidden'
                />
                <img src={assets.profile_upload_icon} alt="" className="w-5 h-5" />
              </label>

              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
                Save
              </button>
            </>
          ) : (
            <div className='flex flex-col sm:flex-row gap-4 items-center'>
              <a
                className='bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition'
                href=""
              >
                Resume
              </a>

              <button
                onClick={() => setIsEdit(true)}
                className='text-gray-600 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition'
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <h2 className='text-xl font-semibold text-gray-800 mb-4'>Jobs Applied</h2>

        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Job Title</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobsApplied.map((job, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={job.logo} alt="" className="h-8 w-8 rounded object-contain border" />
                    <span>{job.company}</span>
                  </td>
                  <td className="px-6 py-4">{job.title}</td>
                  <td className="px-6 py-4">{job.location}</td>
                  <td className="px-6 py-4">{moment(job.date).format('ll')}</td>
                  <td className="px-6 py-4">
                    <span className={`${job.status === 'Accepted' ? 'bg-green-100':job.status === 'Rejected' ? 'bg-red-100': 'bg-blue-100' } px-4 py-1.5 rounded`}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
      <Footer/>
    </>
  )
}

export default Applications
