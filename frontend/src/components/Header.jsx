import React from "react";
import "./Header.css";

const Header = ({ user }) => {
  return (
    <header className="header">
      <div className="header-left">
        <h1>Department of Information Technology</h1>
        <p>College Name Here</p>
      </div>

      <div className="header-right">
        <img
          src={user?.img || "/default-profile.png"}
          alt="profile"
          className="header-profile-img"
        />
        <div>
          <div className="header-user-name">{user?.name}</div>
          <div className="header-user-email">{user?.email}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
