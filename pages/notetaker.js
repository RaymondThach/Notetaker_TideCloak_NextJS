import React, { useEffect, useState } from "react";
import IAMService from "/lib/IAMService";
import styles from "./notetaker.module.css";
import Modal from "./Modal";

export default function NoteTaker() {
  const [userName, setUserName] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);  
  const [notes, setAllNotes] = useState([]);
  const [noteId, setNoteId] = useState(null);

  const syncDb = async () => {
    try {
      const newToken = await IAMService.getToken();
      const name = IAMService.getName();
      console.debug('[fetchEndpoint] Token valid for ' + IAMService.getTokenExp() + ' seconds');
      const response = await fetch('/api/syncDb', {
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
      else {
        setUserName(name);
      }

      const data = await response.json();
      setApiResponse(data); // Set the response to state
    } catch (error) {
      console.error('Error during API call:', error);
      setApiResponse({ error: error.message });
    }
  };

  const getAllNotes = async (userName) => {
    try {
      const newToken = await IAMService.getToken();
      console.debug('[fetchEndpoint] Token valid for ' + IAMService.getTokenExp() + ' seconds');
      const response = await fetch('/api/getAllNotes', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${newToken}`, // Add the token to the Authorization header
        },
        body: JSON.stringify({
          "userName": userName
        })
      });

      if (!response.ok) {
        throw `API call failed: ${response.statusText}`;
      }
      else {
        const data = await response.json();
        setAllNotes(data.rowsAffected);
      }
      
      //setApiResponse(data); // Set the response to state
    } catch (error) {
      console.error('Error during API call:', error);
      //setApiResponse({ error: error.message });
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const newToken = await IAMService.getToken();
      console.debug('[fetchEndpoint] Token valid for ' + IAMService.getTokenExp() + ' seconds');
      const response = await fetch('/api/deleteNote', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${newToken}`, // Add the token to the Authorization header
        },
        body: JSON.stringify({
          "noteId": noteId
        })
      });

      if (!response.status === 204) {
        throw `API call failed: ${response.statusText}`;
      }
      else {
        getAllNotes(userName);
      }
      
      //setApiResponse(data); // Set the response to state
    } catch (error) {
      console.error('Error during API call:', error);
      //setApiResponse({ error: error.message });
    }
  };

  // Reconnect to TideCloak and sync the authenticated user with the database on initial render
  useEffect(() => {
    // Re-init Keycloak in the browser (to read token, handle logout, etc.)
    IAMService.initIAM(() => {
      syncDb();
      
    });
  }, []);

  useEffect(() => {
    getAllNotes(userName);
  }, [userName]);

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
            {
              notes.length === 0
              ? <p className={styles.noNotes}>No sticky notes yet</p>
              :
              <div className={styles.notes}>
                {
                  notes.map((note, i) => (
                      <div className={styles.note} key={i.id}>
                        <p>{note.noteName}</p>
                        <button className= {styles.editButton} onClick = {() => {setNoteId(note.id); setIsOpen(true);}}>Edit</button>
                        <button className= {styles.delButton} onClick = {() => deleteNote(note.id)}>Delete</button>
                      </div>
                    )
                  )
                }
              </div>
            }
          </div>
          { isOpen
            ? <Modal setIsOpen={setIsOpen} setAllNotes={setAllNotes} getAllNotes={() => getAllNotes(userName)} noteId={noteId}/>
            : null
          }
        </div>
      </div>    
    </div>
  );
}
