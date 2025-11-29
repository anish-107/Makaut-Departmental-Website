import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/faculty" className="sidebar-item">Faculty List</Link>
      <Link to="/result" className="sidebar-item">Result</Link>
      <Link to="/schedule" className="sidebar-item">Class Schedule</Link>
      <Link to="/notices" className="sidebar-item">Notice</Link>
      <Link to="/jobs" className="sidebar-item">Job Updates</Link>
    </div>
  );
};

export default Sidebar;
