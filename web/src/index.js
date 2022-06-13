import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App2';
import { BrowserRouter } from "react-router-dom";

import reportWebVitals from './reportWebVitals';

// import {DiceApp, makeSocketEvents} from "./roomLogic/diceEvents";
//Fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { io } from "socket.io-client";

// //global vars are bad. where do these go?
// DiceApp.lobby = window.location.pathname.substring(1);//todo: this feels ...hackable.
// let formData;
// DiceApp.socket = io("ws://localhost:3001", {
//   reconnectionDelayMax: 10000,
//   auth: {
//     token: "123",
//   },
//   query: {
//     "room": DiceApp.lobby,
//   },
// });
// makeSocketEvents();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

