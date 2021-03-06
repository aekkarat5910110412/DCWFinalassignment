import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Login from './Login'
import Album from './Album'
import Register from './Register'
import App from './App'

ReactDOM.render(
  <BrowserRouter>
   <Routes>
     <Route path="/" element={<Login />} />
     <Route path="/login" element={<Login />} />
     <Route path="/album" element={<Album />} />
     <Route path="/register" element={<Register />} />
     <Route path="/app" element={<App />} />
   </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
