import { useState, useCallback } from "react";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useCardDeck(questionList) {
  const [deck, setDeck] = useState(() => shuffle(questionList));
  const [index, setIndex] = useState(0);

  const current = deck[index];

  const next = useCallback(() => {
    setIndex((prev) => {
      if (prev + 1 >= deck.length) {
        setDeck(shuffle(questionList));
        return 0;
      }
      return prev + 1;
    });
  }, [deck.length, questionList]);

  const reset = useCallback(() => {
    setDeck(shuffle(questionList));
    setIndex(0);
  }, [questionList]);

  return { current, next, reset, remaining: deck.length - index };
}
