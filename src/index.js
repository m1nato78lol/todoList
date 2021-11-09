import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { PouchDB } from 'react-pouchdb';
import App from './App';
import './styles/default.scss';

ReactDOM.render(
  <React.StrictMode>
    <PouchDB name="todos">
      <Suspense fallback="loading...">
        <App />
      </Suspense>
    </PouchDB>
  </React.StrictMode>,
  document.getElementById('root'),
);
