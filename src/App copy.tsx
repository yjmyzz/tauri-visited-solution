import React, { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri'
import logo from './logo.svg';
import './App.css';

// const invoke = window.__TAURI__.invoke

function simuHistory() {
  let localstorageSimuHistory = localStorage.getItem('simuHistory');
  let simuHistory = localstorageSimuHistory ? JSON.parse(localstorageSimuHistory) : [];
  let found = false;
  let windowHref = window.location.href;
  for (let i = 0; i < simuHistory.length; i++) {
    if (simuHistory[i] === windowHref) {
      found = true;
      break;
    }
  }
  if (found === false) {
    simuHistory[simuHistory.length] = windowHref;
    localStorage.setItem('simuHistory', JSON.stringify(simuHistory));
  }
  let elements = document.getElementsByTagName('a');
  for (let i = 0; i < elements.length; i++) {
    for (let h = 0; h < simuHistory.length; h++) {
      if (elements[i].href === simuHistory[h]) {
        elements[i].className += ' visited';
      }
    }
  }
}

function App() {
  useEffect(() => {
    return () => {
      console.log("willUnmount");
    }
  });

  useEffect(() => {
    return () => {
      console.log("DidMount");
      // simuHistory();
      invoke('my_custom_command')
    }
  }, []);

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
        {/* <a className='test' href="#1" >link-1</a>
        <a className='test' href="#2" >link-2</a>
        <a className='test' href="#3" >link-3</a> */}
      </header>
    </div>
  );
}

export default App;
