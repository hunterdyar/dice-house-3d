import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';

import reportWebVitals from './reportWebVitals';

//Fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { io } from "socket.io-client";

//global vars are bad. where do these go?
let lobby = window.location.pathname.substring(1);//todo: this feels ...hackable.
let formData;
const socket = io("ws://localhost:3001", {
  reconnectionDelayMax: 10000,
  auth: {
    token: "123",
  },
  query: {
    "room": lobby,
  },
});

//Todo: where do these functions live?
socket.on('connectToRoom',function(data){
  console.log("Connection with Room: "+data);
  lobby = data;
  // history.pushState({room:lobby},lobby);
  // window.location = lobby;//this causes a hilarious loop. Wait, i mean bad loop. a bad loop.
  window.history.replaceState({room: lobby},lobby,lobby);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

