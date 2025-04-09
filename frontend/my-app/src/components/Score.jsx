import React from "react";

const Score = ({ score }) => {
  return (
    <div style={{ padding: "1rem", color: "#333", fontSize: "1.25rem" }}>
      <h1 style={{ fontWeight: "bold" }}>Score</h1>
      {score !== null ? (
        <p style={{ fontSize: "2rem", color: "#7AA166" }}>
          {Number(score).toFixed(2)} {/* Format the score */}
        </p>
      ) : (
        <p style={{ fontStyle: "italic", color: "#aaa" }}>
          Submit a drawing to get a score
        </p>
      )}
    </div>
  );
};

export default Score;
