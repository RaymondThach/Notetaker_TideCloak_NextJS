import styles from "./modal.module.css";

export default function Modal() {
    return (
        <div className={styles.modal}>
            <div className={styles.container}>
                <div className={styles.topMenu}>
                    <button>X</button>
                </div>
                <h className={styles.header}>Note</h>
                <p className={styles.titleHeader}>Title:</p>
                <input className={styles.titleInput} name="titleInput" />
                <p className={styles.noteHeader}>Notes:</p>
                <input className={styles.noteInput} name="noteInput" />
                <div className={styles.bottomMenu}>
                    <button>Save</button>
                    <button>Cancel</button>
                </div>
            </div>
            
        </div>
    );
}