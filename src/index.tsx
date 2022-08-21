import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import { invoke } from '@tauri-apps/api/tauri'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// document.addEventListener('DOMContentLoaded', () => {
//   // This will wait for the window to load, but you could
//   // run this function on whatever trigger you want
//   invoke('close_splashscreen')
// })

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
