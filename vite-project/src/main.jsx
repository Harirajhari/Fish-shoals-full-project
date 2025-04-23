import React from 'react'; // ✅ add this line
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // your Tailwind CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
