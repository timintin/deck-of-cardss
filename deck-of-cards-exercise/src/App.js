import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    async function fetchDeck() {
      const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/');
      setDeck(response.data);
    }
    fetchDeck();
  }, []);

  const drawCard = async () => {
    if (!deck) return;

    const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);
    if (response.data.remaining === 0) {
      alert('Error: no cards remaining!');
      return;
    }
    setCards((prevCards) => [...prevCards, ...response.data.cards]);
  };

  const shuffleDeck = async () => {
    if (!deck) return;

    await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`);
    setCards([]);
  };

  const toggleDrawing = () => {
    if (drawing) {
      clearInterval(timerRef.current);
    } else {
      timerRef.current = setInterval(drawCard, 1000);
    }
    setDrawing(!drawing);
  };

  return (
    <div>
      <h1>React Effects and Refs Exercise</h1>
      {deck ? (
        <>
          <button onClick={drawCard} disabled={drawing}>Draw a card</button>
          <button onClick={shuffleDeck} disabled={drawing}>Shuffle the deck</button>
          <button onClick={toggleDrawing}>{drawing ? 'Stop drawing' : 'Start drawing'}</button>
          <div>
            {cards.map((card) => (
              <img key={card.code} src={card.image} alt={card.value + ' of ' + card.suit} />
            ))}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
