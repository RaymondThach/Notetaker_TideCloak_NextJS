import styles from "./modal.module.css";
import { useState, useEffect } from "react";
import IAMService from "/lib/IAMService";

export default function Modal({setIsOpen, setAllNotes, getAllNotes, noteId}) {
    const [noteName, setNoteName] = useState("");
    const [note, setNote] = useState("");

    const createNote = async () => {
        try {
            const userName = IAMService.getName();
            const newToken = await IAMService.getToken();
            console.debug('[fetchEndpoint] Token valid for ' + IAMService.getTokenExp() + ' seconds');
            const response = await fetch('/api/createNote', {
                method: 'POST',
                headers: {
                accept: 'application/json',
                Authorization: `Bearer ${newToken}`, // Add the token to the Authorization header
                },
                body: JSON.stringify({
                "userName" : userName,
                "noteName" : noteName,
                "note": note
                })
            });
        
            if (!response.status === 201) {
                throw `API call failed: ${response.statusText}`;
            }
            else {
                getAllNotes(userName);
            }
        
            //const data = await response.json();
            //setApiResponse(data); // Set the response to state
            } catch (error) {
            console.error('Error during API call:', error);
            //setApiResponse({ error: error.message });
        }
    };
    
    const getNote = async (noteId) => {
        try {
            const newToken = await IAMService.getToken();
            console.debug('[fetchEndpoint] Token valid for ' + IAMService.getTokenExp() + ' seconds');
            const response = await fetch('/api/getNote', {
            method: 'POST',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${newToken}`, // Add the token to the Authorization header
            },
            body: JSON.stringify({
                "noteId": noteId,
                })
            });

            if (!response.ok) {
                throw `API call failed: ${response.statusText}`;
            }
            else {
                const data = await response.json();
                setNoteName(data.rowsAffected[0].noteName);
                setNote(data.rowsAffected[0].note);
            }
            
            //setApiResponse(data); // Set the response to state
        } catch (error) {
            console.error('Error during API call:', error);
            //setApiResponse({ error: error.message });
        }
    };

    const updateNote = async (noteId) => {
        try {
            const userName = IAMService.getName();
            const newToken = await IAMService.getToken();
            console.debug('[fetchEndpoint] Token valid for ' + IAMService.getTokenExp() + ' seconds');
            const response = await fetch('/api/updateNote', {
            method: 'POST',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${newToken}`, // Add the token to the Authorization header
            },
            body: JSON.stringify({
                "noteId": noteId,
                "newName" : noteName,
                "newNote" : note
                })
            });

            if (!response.ok) {
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

    const saveHandler = async (noteId) => {
        if (noteId === null) {
            await createNote(); 
            setIsOpen(false);
        }
        else {
            await updateNote(noteId);
            setIsOpen(false);
        } 
    };
    
    useEffect(() => {
        if (noteId) {
            getNote(noteId);
        }
    }, [])

    return (
        <div className={styles.modal}>
            <div className={styles.container}>
                <div className={styles.topMenu}>
                    <button onClick={() => setIsOpen(false)}>X</button>
                </div>
                <h1 className={styles.header}>Note</h1>
                <p className={styles.titleHeader}>Title:</p>
                <input className={styles.titleInput} name="titleInput" value={noteName} onChange={e => setNoteName(e.target.value)}/>
                <p className={styles.noteHeader}>Notes:</p>
                <input className={styles.noteInput} name="noteInput" value={note} onChange={e => setNote(e.target.value)}/>
                <div className={styles.bottomMenu}>
                    <button onClick={async () => saveHandler(noteId)}>Save</button>
                    <button onClick={() => setIsOpen(false)}>Cancel</button>
                </div>
            </div>
            
        </div>
    );
}