import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App2';
import { BrowserRouter } from "react-router-dom";

import reportWebVitals from './reportWebVitals';

//Fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { io } from "socket.io-client";

const socket = io("ws://localhost:3001", {
  reconnectionDelayMax: 10000,
  auth: {
    token: "123",
  },
  query: {
    "my-key": "my-value",
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

