import styles from "./modal.module.css";
import { useState, useEffect } from "react";

export default function Modal({setIsOpen, userName}) {
    const [noteName, setNoteName] = useState("");
    const [note, setNote] = useState("");

    const createNote = async () => {
        try {
            const newToken = await IAMService.getToken();
            console.debug('[fetchEndpoint] Token valid for ' + IAMService.getTokenExp() + ' seconds');
            const response = await fetch('/api/createNote', {
                method: 'POST',
                headers: {
                accept: 'application/json',
                Authorization: `Bearer ${newToken}`, // Add the token to the Authorization header
                },
                body: JSON.stringify({
                "userName:" : userName,
                "noteName" : noteName,
                "note": note
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


    const test = () => {
        console.log(noteName);
        console.log(note);
    }
    
    return (
        <div className={styles.modal}>
            <div className={styles.container}>
                <div className={styles.topMenu}>
                    <button onClick={() => setIsOpen(false)}>X</button>
                </div>
                <h1 className={styles.header}>Note</h1>
                <p className={styles.titleHeader}>Title:</p>
                <input className={styles.titleInput} name="titleInput" onChange= {e => setNoteName(e.target.value)}/>
                <p className={styles.noteHeader}>Notes:</p>
                <input className={styles.noteInput} name="noteInput" onChange={e => setNote(e.target.value)}/>
               

                <div className={styles.bottomMenu}>
                    <button onClick={() => test()}>Save</button>
                    <button onClick={() => setIsOpen(false)}>Cancel</button>
                </div>
            </div>
            
        </div>
    );
}