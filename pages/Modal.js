import styles from "./modal.module.css";

export default function Modal() {
    return (
        <div className={styles.modal}>
            <div className={styles.container}>
                <div className={styles.topMenu}>
                    <button>X</button>
                </div>
                <h1 className={styles.header}>Note</h1>
                <p className={styles.titleHeader}>Title:</p>
                <label className={styles.titleInput}>
                    <input className={styles.titleInput} name="titleInput" />
                </label>
                
                <p className={styles.noteHeader}>Notes:</p>
                <label className={styles.noteInput}>
                    <input  name="noteInput" />
                </label>
                <div className={styles.bottomMenu}>
                    <button>Save</button>
                    <button>Cancel</button>
                </div>
            </div>
            
        </div>
    );
}