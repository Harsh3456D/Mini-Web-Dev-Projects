import React from 'react';
import ThemeButton from './components/button';
import { useTheme } from './context/ThemeContext';

function App() {
  const { theme, toggleTheme } = useTheme();

  const appStyle = {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    transition: 'all 0.3s ease',
    backgroundColor: theme === 'light' ? '#f0f0f0' : '#121212',
    color: theme === 'light' ? '#333' : '#fff',
    minHeight: '100vh',
  };

  return (
    <div style={appStyle}>
      <h1>Page</h1>
      <p>Theme: {theme}</p>
      <button onClick={toggleTheme} style={{ marginTop: '10px' }}>
        Toggle
      </button>
      <ThemeButton />
    </div>
  );
}

export default App;