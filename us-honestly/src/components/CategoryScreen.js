import React from "react";
import { categories } from "../data/questions";
import "./CategoryScreen.css";

export default function CategoryScreen({ onSelect, onBack }) {
  return (
    <div className="category">
      <div className="category__header">
        <button className="back-btn" onClick={onBack} aria-label="Back">
          ← Back
        </button>
        <h2 className="category__heading">Choose a vibe</h2>
        <p className="category__sub">Pick a category to draw from</p>
      </div>

      <div className="category__grid">
        {categories.map((cat, i) => (
          <button
            key={cat.id}
            className="cat-card"
            style={{
              "--cat-color": cat.color,
              "--cat-accent": cat.accent,
              "--cat-glow": cat.glow,
              animationDelay: `${i * 0.08}s`,
            }}
            onClick={() => onSelect(cat)}
          >
            <span className="cat-card__emoji">{cat.emoji}</span>
            <span className="cat-card__label">{cat.label}</span>
            <span className="cat-card__desc">{cat.description}</span>
            <span className="cat-card__arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
