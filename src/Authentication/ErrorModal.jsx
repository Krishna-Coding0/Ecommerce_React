import React from 'react';
import styles from './ErrorModal.module.css'; 

export default function ErrorModal({ message, onClose }) {
  return (
    <div id="errorModal" className={styles.modal} style={{ display: message ? 'block' : 'none' }}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>&times;</span>
        <p>Error {message}</p>
      </div>
    </div>
  );
}
