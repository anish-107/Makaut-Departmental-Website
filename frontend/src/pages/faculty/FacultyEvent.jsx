import React from 'react'
import { Link } from 'react-router-dom'

export default function FacultyEvent() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Faculty Event</h2>
      <p className="mt-2">This is the faculty event page.</p>
      <Link to="profile" className="mt-4 inline-block underline">Go to profile</Link>
    </div>
  )
}
