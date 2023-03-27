import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="test" element={<Default/>}/>
        <Route path="/" element={<NewPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

function Default() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

function NewPage() {
  return (
    <div className='App-header'>
      <Link className='App-link' to="test">test</Link>
    </div>
  );
}

export default App;
