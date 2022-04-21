import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import EventsList from "./components/EventsList";

const App: React.FC = () => {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/events" className="navbar-brand">
          Psum Logs
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/events"} className="nav-link">
              Events
            </Link>
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<EventsList/>} />
          <Route path="/events" element={<EventsList/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
