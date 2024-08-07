import React, { useState, useEffect } from "react";
import "./BlackOverlay.css";

const BlackOverlay = ({ isLoading }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setFade(true);
      setTimeout(() => setFade(false), 1000); // Duration of the transition
    }
  }, [isLoading]);

  return (
    <div className={`black-overlay ${fade ? "fade-out" : ""}`}>
      {isLoading ? null : <div className="content">Your content here</div>}
    </div>
  );
};

export default BlackOverlay;
