// This is example for a secure (authenticated user only) page.
// In this example, an authenticated user will be presented some sensitive data 
// and will be allowed to query the server for sensitive information.

import React, { useEffect, useState } from "react";
import IAMService from "/lib/IAMService";
import styles from "./notetaker.module.css";
import Modal from "./Modal";

// async function getUserId() {
//   const test = await fetch("http://localhost:8000/notes/userId/raytest");
//   const result = await test.json();
//   console.log(result);
// }

export default function NoteTaker() {
  const [userName, setUserName] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);  


  const createUser = async () => {
    // An example for securely fetching information from resource server
    try {
      const newToken = await IAMService.getToken();
      const name = IAMService.getName();
      console.debug('[fetchEndpoint] Token valid for ' + IAMService.getTokenExp() + ' seconds');
      const response = await fetch('/api/createUser', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${newToken}`, // Add the token to the Authorization header
        },
        body: JSON.stringify({
          "userName": name
        })
      });

      if (!response.ok) {
        throw `API call failed: ${response.statusText}`;
      }

      const data = await response.json();
      setApiResponse(data); // Set the response to state
      setUserName(name);
    } catch (error) {
      console.error('Error during API call:', error);
      setApiResponse({ error: error.message });
    }
  };

  const getUserId = async () => {
    // An example for securely fetching information from resource server
    try {
      const newToken = await IAMService.getToken();
      const name = IAMService.getName();
      console.log(name);
      console.debug('[fetchEndpoint] Token valid for ' + IAMService.getTokenExp() + ' seconds');
      const response = await fetch('/api/getUserId', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${newToken}`, // Add the token to the Authorization header
        },
        body: JSON.stringify({
          "userName": name
        })
      });

      if (!response.ok) {
        throw `API call failed: ${response.statusText}`;
      }

      const data = await response.json();
      setApiResponse(data); // Set the response to state
    } catch (error) {
      console.error('Error during API call:', error);
      setApiResponse({ error: error.message });
    }
  };

  // Create the authenticated user in the database if they don't exist there yet
  // async function createUser() {
  //   const name = IAMService.getName();
  //   await fetch('http://localhost:8000/notes/createUser', {
  //     method: 'post',
  //     headers: {
  //       accept: 'application/json',
  //       Authorization: `Bearer ${newToken}`, // Add the token to the Authorization header
  //     },
  //     body: JSON.stringify({
  //       "userName": name
  //     })
  //   });
  //   setUserName(name);
  // }

  // Reconnect to TideCloak and sync the authenticated user with the database on initial render
  useEffect(() => {
    // Re-init Keycloak in the browser (to read token, handle logout, etc.)
    IAMService.initIAM(() => {
      //createUser();
      //getUserId();
    });
  }, []);

  // useEffect(() => {
  //   console.log(userName);
  // }, [userName]);

  const handleLogout = () => {
    IAMService.doLogout();
  } 

  const handleModal = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className = {styles.app}>
      <div className = {styles.container}> 
        <div className = {styles.header}>
          Notetaker
        </div>
        <div className = {styles.topMenu}>
          <button className = {styles.createButton} onClick={handleModal}>Create Note</button>
          <button className = {styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
        <div className = {styles.sideMenu}>
          Menu
        </div>
        <div className = {styles.content}>
          <div>
            Notes
          </div>
          { isOpen
            ? <Modal setIsOpen={setIsOpen} userName = {userName}/>
            : null
          }
        </div>
      </div>    
    </div>
  );
}
