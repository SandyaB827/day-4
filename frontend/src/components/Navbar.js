import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Task Dashboard</a>
        <div className="ml-auto">
          {user && (
            <button className="btn btn-outline-light" onClick={logout}>
              Logout ({user.username})
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;