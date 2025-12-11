import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'
import './styles/style.css';
import { AuthProvider } from './context/authContext.jsx';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
     <BrowserRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
    </BrowserRouter>
);