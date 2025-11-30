import React from 'react'
import { Link } from 'react-router-dom'

export default function StudentSubjects() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Student Subjects</h2>
      <p className="mt-2">This is the student Subjects page.</p>
      <Link to="profile" className="mt-4 inline-block underline">Go to profile</Link>
    </div>
  )
}
