import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const children  = (
  <React.StrictMode>
    <Router basename='/subastas'>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Router>
  </React.StrictMode>
);

const container = document.getElementById('root')
createRoot(container).render(children) 
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
