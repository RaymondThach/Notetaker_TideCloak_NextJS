// Home page

import React, { useEffect } from "react";
import IAMService from "/lib/IAMService";

export default function HomePage() {
  // Check in background if user already authenticated
  useEffect(() => {
    IAMService.initIAM((authenticated) => {
      if (authenticated) {
        // If already authenticated, skip screen
        window.location.href = "/auth/redirect";
      }
      else {
        // Otherwise redirect to Tidecloak Login form
        IAMService.doLogin();
      }
    });
  }, []);
}
