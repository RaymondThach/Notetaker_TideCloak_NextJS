// This is example for a secure (authenticated user only) page.
// In this example, an authenticated user will be presented some sensitive data 
// and will be allowed to query the server for sensitive information.

import React, { useEffect, useState } from "react";
import IAMService from "/lib/IAMService";
import styles from "./notetaker.module.css";

export default function NoteTaker() {

  return (
    <div className={styles.app}>
      <h1>Also Protected</h1>
    </div>
  );
}
