import React from 'react';
import { manageJobsData } from '../assets/assets/assets';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const ManageJobs = () => {
    const navigate = useNavigate()



  return (
    <div className="container p-4 max-w-5xl mx-auto">
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="bg-gray-100 text-xs font-semibold uppercase">
            <tr>
              <th className="px-4 py-3 max-sm:hidden">#</th>
              <th className="px-4 py-3">Job Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 max-sm:hidden">Location</th>
              <th className="px-4 py-3 text-center">Applicants</th>
              <th className="px-4 py-3 text-center">Visible</th>
            </tr>
          </thead>
          <tbody>
            {manageJobsData.map((job, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50 transition duration-100"
              >
                <td className="px-4 py-3 max-sm:hidden">{index + 1}</td>
                <td className="px-4 py-3">{job.title}</td>
                <td className="px-4 py-3">{moment(job.date).format('DD MMM, YYYY')}</td>
                <td className="px-4 py-3 max-sm:hidden">{job.location}</td>
                <td className="px-4 py-3 text-center">{job.applicants}</td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='mt-4 flex justify-end'>
        <button  onClick={()=>navigate('/dashboard/add-job')} className='bg-black text-white py-2 px-4 rounded' >
            Add New Job
        </button>
      </div>
    </div>
  );
};

export default ManageJobs;
