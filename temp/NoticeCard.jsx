import React from "react";
import "./NoticeCard.css";

const NoticeCard = ({ notice }) => {
  return (
    <div className="notice-card">
      <h3>{notice.title}</h3>
      <p className="notice-date">{notice.date}</p>
      <p>{notice.description}</p>

      {notice.file_url && (
        <a href={notice.file_url} target="_blank" rel="noreferrer">
          View Attachment
        </a>
      )}
    </div>
  );
};

export default NoticeCard;
