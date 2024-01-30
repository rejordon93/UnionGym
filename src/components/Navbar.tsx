import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, Message } from "semantic-ui-react";
import axios from "axios";

const Navbar: React.FC = () => {
  const [logoutSuccess, setLogoutSuccess] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      const response = await axios.post("/logout");
      console.log("Logout response:", response);
      if (response.status === 200) {
        setLogoutSuccess(true);
        setTimeout(() => {
          setLogoutSuccess(false);
        }, 3000);
        setIsLoggedIn(false);
      }
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        alert("Invalid credentials");
      }
      setIsLoggedIn(false);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("/login");
      if (response.status === 200) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error(error);
      setIsLoggedIn(false);
    }
  };

  return (
    <>
      {logoutSuccess && (
        <Message
          positive
          style={{ position: "fixed", top: "5%", right: "5%", zIndex: 9999 }}
        >
          Logout successful
        </Message>
      )}
      <Menu secondary>
        <Menu.Item>
          <NavLink to="/">GYM</NavLink>
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <NavLink to="/workouts">Workouts</NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to="/register">Register</NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to="/login">Login</NavLink>
          </Menu.Item>
          <Menu.Item onClick={handleLogout}>
            <NavLink to="/">Logout</NavLink>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </>
  );
};

export default Navbar;
