import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import '@fontsource-variable/plus-jakarta-sans';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import App from './App.jsx';

// pdf.js 4.x uses Promise.withResolvers, missing in some older browsers.
if (typeof Promise.withResolvers !== 'function') {
  Promise.withResolvers = function () {
    let resolve; let reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
  };
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
