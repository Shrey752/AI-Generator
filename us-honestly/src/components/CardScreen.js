import React, { useState, useEffect } from "react";
import { questions } from "../data/questions";
import { useCardDeck } from "../hooks/useCardDeck";
import "./CardScreen.css";

export default function CardScreen({ category, onChangeCategory, onBack }) {
  const questionList = questions[category.id];
  const { current, next, remaining } = useCardDeck(questionList);
  const [flipped, setFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [current]);

  function handleFlip() {
    if (!flipped && !animating) {
      setFlipped(true);
    }
  }

  function handleNext() {
    if (animating) return;
    setAnimating(true);
    setFlipped(false);
    setTimeout(() => {
      next();
      setAnimating(false);
    }, 300);
  }

  return (
    <div className="card-screen">
      <div className="card-screen__header">
        <button className="back-btn" onClick={onBack} aria-label="Back">
          ← Categories
        </button>
        <div className="card-screen__cat">
          <span>{category.emoji}</span>
          <span>{category.label}</span>
        </div>
        <span className="card-screen__count">{remaining} left</span>
      </div>

      <div className="card-scene" onClick={handleFlip} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" || e.key === " " ? handleFlip() : null}
        aria-label={flipped ? current : "Tap to reveal question"}
      >
        <div
          className="card-inner"
          style={{
            "--cat-color": category.color,
            "--cat-accent": category.accent,
            "--cat-glow": category.glow,
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div className="card-face card-face--back">
            <div className="card-back__pattern" aria-hidden="true" />
            <div className="card-back__center">
              <span className="card-back__emoji">{category.emoji}</span>
              <span className="card-back__label">{category.label}</span>
              <span className="card-back__tap">Tap to reveal</span>
            </div>
          </div>
          <div className="card-face card-face--front">
            <div className="card-front__badge">{category.emoji} {category.label}</div>
            <p className="card-front__question">{current}</p>
            <div className="card-front__footer">Us, Honestly</div>
          </div>
        </div>
      </div>

      {!flipped && (
        <p className="card-screen__hint">Tap the card to reveal the question</p>
      )}

      {flipped && (
        <div className="card-screen__actions">
          <button
            className="action-btn action-btn--next"
            style={{ "--cat-color": category.color, "--cat-glow": category.glow }}
            onClick={handleNext}
          >
            Next Card
          </button>
          <button className="action-btn action-btn--change" onClick={onChangeCategory}>
            Change Category
          </button>
        </div>
      )}
    </div>
  );
}
