import React from "react";
import UserList from "../components/UserList";
import UserEditor from "../components/UserEditor";

import '../styles/Home.css'

const Home = () => {
  return (
    <div className="container">
      <div className="sidebar">
        <UserList />
      </div>
      <div className="editor">
        <UserEditor />
      </div>
    </div>
  );
};

export default Home;
