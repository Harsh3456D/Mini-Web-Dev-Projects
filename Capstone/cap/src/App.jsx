import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard.jsx';
import { Moon, Sun, Activity } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <Router>
      <div className='min-h-screen relative'>
        <div className='fixed inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-950 -z-10' />
        <nav className='glass-panel sticky top-0 z-50 px-6 py-4 flex justify-between items-center'>
          <div className='flex items-center gap-4 text-xl font-medium tracking-tight'>
            <Activity className='w-6 h-6' />
            <span>
              Market<span className='font-light text-zinc-500'>Tracker</span>
            </span>
            <div className='ml-8 flex gap-6 text-sm font-medium'>
              <Link to='/stocks' className='hover:text-zinc-500 transition-colors'>
                Stocks
              </Link>
              <Link to='/crypto' className='hover:text-zinc-500 transition-colors'>
                Crypto
              </Link>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className='p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors'
          >
            {darkMode ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
          </button>
        </nav>
        <main className='p-8'>
          <Routes>
            <Route path='/' element={<Dashboard type='stocks' />} />
            <Route path='/stocks' element={<Dashboard type='stocks' />} />
            <Route path='/crypto' element={<Dashboard type='crypto' />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;
