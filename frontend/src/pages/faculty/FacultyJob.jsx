import React from 'react'
import { Link } from 'react-router-dom'

export default function FacultyJob() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Faculty Job</h2>
      <p className="mt-2">This is the faculty job page.</p>
      <Link to="profile" className="mt-4 inline-block underline">Go to profile</Link>
    </div>
  )
}
