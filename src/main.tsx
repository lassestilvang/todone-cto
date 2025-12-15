import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/index.css';
import { checkDatabaseVersion } from './lib/dbMigration';

// Check database version and log for debugging
checkDatabaseVersion().then((version) => {
  console.log(`IndexedDB version: ${version} (expected: 2)`);
  if (version === 1) {
    console.warn('Database is at version 1 and will be automatically migrated to version 2. If you experience issues, clear IndexedDB from DevTools > Application > IndexedDB > todone > Delete database');
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
