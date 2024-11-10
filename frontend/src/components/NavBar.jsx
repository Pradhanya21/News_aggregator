/*=============================================================================
 | Purpose:  THIS FUNCTION DEFINES A NAVIGATION BAR COMPONENT FOR THE APP.
 |           THE NAVIGATION BAR DISPLAYS A LOGO LINKING TO THE MAIN PAGE AND 
 |           EITHER A LOGIN BUTTON OR A LOGOUT BUTTON BASED ON THE USER'S 
 |           AUTHENTICATION STATUS. THE NAVIGATION BAR ALSO CONTAINS THE 
 |           FUNCTIONALITY TO OPEN A LOGIN MODAL WHEN THE LOGIN BUTTON IS 
 |           CLICKED AND TO LOG THE USER OUT WHEN THE LOGOUT BUTTON IS CLICKED.
 |           DOCUMENTATION: https://www.npmjs.com/package/react-router-dom
 |           ICONS FROM MATERIAL UI: https://mui.com/material-ui/material-icons/
 |
 | Input / Parameters:  THE FUNCTION DOES NOT TAKE EXTERNAL PROPS AS INPUT. 
 |                      HOWEVER, IT UTILIZES CONTEXT FROM UserContext TO CHECK 
 |                      THE USER'S AUTHENTICATION STATUS AND MANAGE USER DATA.
 |   
 | Output / Returns:  THE FUNCTION RETURNS A NAVIGATION BAR COMPONENT THAT CAN BE
 |                    RENDERED ON THE WEBPAGE. IT DISPLAYS THE APPLICATION LOGO,
 |                    A LOGIN BUTTON OR LOGOUT BUTTON, AND CONDITIONALLY RENDERS
 |                    A LOGIN MODAL WHEN THE LOGIN BUTTON IS CLICKED.
 |
 *===========================================================================*/

import React, { useState, useContext } from "react";
import styles from "./NavBar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import UserContext from "../context/user";

// importing icons from MUI Icons
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import Login from "./Login";

/*====================
CREATE NAVBAR & SET ITS NAVIGATION LOGIC
====================*/

const NavBar = () => {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);

  const handleOpenLoginModal = () => {
    setOpenLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
  };

  const handleLogout = () => {
    // Clear user context or any stored tokens or session data
    userCtx.setAccessToken(null);
    userCtx.setRole(null);
    userCtx.setLoggedUserId(null);
    navigate("/Main");
  };

  return (
    <header className={styles.navbar}>
      <nav>
        <ul>
          <li>
            <NavLink
              style={{ textDecoration: "none", borderBottom: "none" }}
              className={(navData) => (navData.isActive ? styles.active : "")}
              to="/main"
            >
              <img
                src="/src/assets/factFlow_logo.png"
                width="192"
                height="35"
                className="d-inline-block align-top"
                alt=""
              ></img>
            </NavLink>
          </li>
          <li
            style={{
              marginLeft: "auto",
              marginRight: "2rem",
            }}
          >
            {!userCtx.accessToken ? (
              <button
                className={styles.loginButton}
                onClick={handleOpenLoginModal}
              >
                Login <LockOpenOutlinedIcon />
              </button>
            ) : (
              <button className={styles.logoutButton} onClick={handleLogout}>
                Logout <ExitToAppOutlinedIcon />
              </button>
            )}
          </li>
        </ul>
      </nav>
      {/*========== Render the Login component conditionally ==========*/}
      {openLoginModal && <Login handleClose={handleCloseLoginModal} />}
    </header>
  );
};

export default NavBar;
