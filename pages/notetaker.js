// This is example for a secure (authenticated user only) page.
// In this example, an authenticated user will be presented some sensitive data 
// and will be allowed to query the server for sensitive information.

import React, { useEffect, useState } from "react";
import IAMService from "/lib/IAMService";
import styles from "./notetaker.module.css";

// async function getUserId() {
//   const test = await fetch("http://localhost:8000/notes/userId/raytest");
//   const result = await test.json();
//   console.log(result);
// }

export default function NoteTaker() {
  const [userName, setUserName] = useState();

  async function createUser() {
    const name = IAMService.getName();
    await fetch('http://localhost:8000/notes/createUser', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        "userName": name
      })
    });
    setUserName(name);
  }

  useEffect(() => {
    // Re-init Keycloak in the browser (to read token, handle logout, etc.)
    IAMService.initIAM(() => {
      createUser();
    });
  }, []);

  useEffect(() => {
    console.log(userName);
  }, [userName]);

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
