import React from 'react'
import { Link } from 'react-router-dom'

export default function FacultyNotice() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Faculty Notice</h2>
      <p className="mt-2">This is the faculty notice page.</p>
      <Link to="profile" className="mt-4 inline-block underline">Go to profile</Link>
    </div>
  )
}
