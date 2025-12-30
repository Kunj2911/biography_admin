import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const auth = localStorage.getItem("user");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Optional: track which submenu is open
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div>
      {auth ? (
        <ul className="nav-ul">
          {/* Category Menu */}
          <li>
            <span onClick={() => toggleMenu("category")}>Category</span>
            {openMenu === "category" && (
              <ul className="submenu">
                <li><Link to="/">Category List</Link></li>
                <li><Link to="/add category">Category Add</Link></li>
              </ul>
            )}
          </li>

          {/* Person Menu */}
          <li>
            <span onClick={() => toggleMenu("person")}>Person</span>
            {openMenu === "person" && (
              <ul className="submenu">
                <li><Link to="/personlist">Person List</Link></li>
                <li><Link to="/add person">Person Add</Link></li>
              </ul>
            )}
          </li>

          {/* Banner Menu */}
          <li>
            <span onClick={() => toggleMenu("banner")}>Banner</span>
            {openMenu === "banner" && (
              <ul className="submenu">
                <li><Link to="/bannerlist">Banner List</Link></li>
                <li><Link to="/banner">Banner Add</Link></li>
              </ul>
            )}
          </li>

          {/* Setting */}
          <li><Link to="/setting">Setting</Link></li>

          <li>
            <span onClick={() => toggleMenu("appupdate")}>App Update</span>
            {openMenu === "appupdate" && (
              <ul className="submenu">
                <li><Link to="/app-update-list">App Update List</Link></li>
                <li><Link to="/app-update-add">Add App Update</Link></li>
              </ul>
            )}
          </li>


          {/* Logout */}
          <li>
            <button onClick={logout}>
              Logout ({JSON.parse(auth).name})
            </button>
          </li>
        </ul>
      ) : (
        <ul className="nav-ul nav-right">
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Sign Up</Link></li>
        </ul>
      )}
    </div>
  );
};

export default Nav;
