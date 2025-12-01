import React from 'react'
import { Link } from 'react-router-dom'

export default function StudentNotice() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Student Notices</h2>
      <p className="mt-2">This is the student notices page.</p>
      <Link to="profile" className="mt-4 inline-block underline">Go to profile</Link>
    </div>
  )
}
