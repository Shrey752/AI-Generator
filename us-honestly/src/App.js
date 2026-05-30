import React, { useState, useRef } from "react";
import LandingScreen from "./components/LandingScreen";
import CategoryScreen from "./components/CategoryScreen";
import CardScreen from "./components/CardScreen";
import "./App.css";

const SCREENS = { landing: "landing", category: "category", card: "card" };

export default function App() {
  const [screen, setScreen] = useState(SCREENS.landing);
  const [category, setCategory] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const timeoutRef = useRef(null);

  function navigate(nextScreen, nextCategory = null) {
    if (transitioning) return;
    setTransitioning(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (nextCategory) setCategory(nextCategory);
      setScreen(nextScreen);
      setTransitioning(false);
    }, 220);
  }

  function handleStart() { navigate(SCREENS.category); }
  function handleSelectCategory(cat) { navigate(SCREENS.card, cat); }
  function handleChangeCategory() { navigate(SCREENS.category); }
  function handleBackToLanding() { navigate(SCREENS.landing); }
  function handleBackToCategory() { navigate(SCREENS.category); }

  return (
    <div className={`app-shell ${transitioning ? "app-shell--fade" : ""}`}>
      {screen === SCREENS.landing && (
        <LandingScreen onStart={handleStart} />
      )}
      {screen === SCREENS.category && (
        <CategoryScreen onSelect={handleSelectCategory} onBack={handleBackToLanding} />
      )}
      {screen === SCREENS.card && category && (
        <CardScreen
          category={category}
          onChangeCategory={handleChangeCategory}
          onBack={handleBackToCategory}
        />
      )}
    </div>
  );
}
