import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { JobCategories, JobLocations } from '../assets/assets/assets'

const AddJob = () => {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('Bangalore')
  const [category, setCategory] = useState('Programming')
  const [level, setLevel] = useState('Senior Level')
  const [salary, setSalary] = useState(0)
  const [description, setDescription] = useState('')

  const editorRef = useRef(null)
  const quilRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && !quilRef.current) {
      quilRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      })

      quilRef.current.on('text-change', () => {
        setDescription(editorRef.current.children[0].innerHTML)
      })
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ title, description, location, category, level, salary })
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-5xl space-y-6">
      <div>
        <p className="mb-1 font-semibold">Job Title</p>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type="text"
          placeholder="Type here"
          required
          className="border w-full p-2 rounded"
        />
      </div>

      <div>
        <p className="mb-1 font-semibold">Job Description</p>
        <div ref={editorRef} className="bg-white border rounded h-[180px]" />
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <p className="mb-1 font-semibold">Job Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded w-full"
          >
            {JobCategories.map((category,index)=>(
                <option value={category} key={index}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <p className="mb-1 font-semibold">Job Location</p>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-2 rounded w-full"
          >
              {JobLocations.map((location,index)=>(
                <option value={location} key={index}>{location}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <p className="mb-1 font-semibold">Job Level</p>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="border p-2 rounded w-full"
          >
              <option>Entry Level</option>
            <option>Mid Level</option>
            <option>Senior Level</option>
          </select>
        </div>
      </div>

      <div className="w-[200px]">
        <p className="mb-1 font-semibold"> Job Salary</p>
        <input min={0}
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="border w-full p-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-black text-white px-6 py-2 rounded hover:opacity-90"
      >
        ADD
      </button>
    </form>
  )
}

export default AddJob
