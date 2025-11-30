import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import NoticeCard from "../../Components/NoticeCard";
import "./NoticePage.css";

const NoticePage = () => {
  const [user, setUser] = useState(null);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    setUser({
      name: "John Doe",
      email: "john@example.com",
      img: "/default-profile.png",
    });

    setNotices([
      {
        id: 1,
        title: "Exam Schedule",
        date: "2025-11-30",
        description: "Mid-sem exam schedule for IT dept.",
        file_url: "",
      },
    ]);
  }, []);

  return (
    <div className="notice-page">
      {user && <Header user={user} />}

      <div className="notice-page-subheader">
        <span>Student Name - {user?.name}</span>
        <span>Email - {user?.email}</span>
      </div>

      <div className="notice-list">
        {notices.map((n) => (
          <NoticeCard key={n.id} notice={n} />
        ))}
      </div>
    </div>
  );
};

export default NoticePage;
