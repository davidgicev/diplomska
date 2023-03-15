import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Modal from "react-modal"

export const APP_URL = process.env.CYCLIC_URL
console.log("Url in react is ", APP_URL)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

Modal.setAppElement('#root');

root.render(
    <App />
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
