// This is example for a secure (authenticated user only) page.
// In this example, an authenticated user will be presented some sensitive data 
// and will be allowed to query the server for sensitive information.

import React, { useEffect, useState } from "react";
import IAMService from "/lib/IAMService";
import styles from "./notetaker.module.css";

export default function NoteTaker() {
  
  useEffect(() => {
    // Re-init Keycloak in the browser (to read token, handle logout, etc.)
    IAMService.initIAM();
  }, []);

  const handleLogout = () => {
    IAMService.doLogout();
  } 

  return (
    <div className = {styles.app}>
      <div className = {styles.container}> 
        <div className = {styles.topMenu}>
          <button className = {styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
        <div className = {styles.header}>
          Notetaker
        </div>
        <div className = {styles.sideMenu}>
          Menu
        </div>
        <div className = {styles.content}>
          <div>
            Notes
          </div>
        </div>
      </div>
    </div>
  );
}
