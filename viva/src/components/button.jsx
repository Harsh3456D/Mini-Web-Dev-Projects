import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} style={theme === 'light' ? { backgroundColor: '#333', color: '#fff' } : { backgroundColor: '#fff', color: '#333' }}>
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  );
};

export default ThemeButton;