import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App'; // Import the main component from App.tsx
import './chatbot.css';       // Import your global styles here

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
);