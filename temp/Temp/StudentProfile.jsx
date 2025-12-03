import React from "react";
import Header from "../../Components/Header";

const StudentProfile = () => {
  const student = {
    name: "I am Sam",
    email: "iamsam88@example.com",
    img: "/iamsam.jpeg",
    phone: "9876543210",
    department: "IT",
    address: "Some Address",
  };

  return (
    <div style={{ padding: "30px" }}>
      <Header user={student} />

      <div style={{
        width: "420px",
        margin: "40px auto",
        background: "white",
        padding: "30px 40px",
        borderRadius: "12px",
        boxShadow: "0 5px 12px rgba(0,0,0,0.15)"
      }}>
        <img
          src={student.img}
          alt="profile"
          style={{ width: "120px", height: "120px", borderRadius: "50%", display: "block", margin: "0 auto 20px" }}
        />

        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Phone:</strong> {student.phone}</p>
        <p><strong>Department:</strong> {student.department}</p>
        <p><strong>Address:</strong> {student.address}</p>
      </div>
    </div>
  );
};

export default StudentProfile;
