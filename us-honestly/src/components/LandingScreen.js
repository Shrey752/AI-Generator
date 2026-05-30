import React from "react";
import "./LandingScreen.css";

export default function LandingScreen({ onStart }) {
  return (
    <div className="landing">
      <div className="landing__stars" aria-hidden="true" />
      <div className="landing__content">
        <div className="landing__badge">A game for two</div>
        <h1 className="landing__title">
          Us,<br />Honestly
        </h1>
        <p className="landing__subtitle">
          Pick a card. Ask the question.<br />No scores. Just conversation.
        </p>
        <button className="landing__cta" onClick={onStart}>
          Let's Play
        </button>
        <p className="landing__hint">5 categories · 70+ questions</p>
      </div>
    </div>
  );
}
