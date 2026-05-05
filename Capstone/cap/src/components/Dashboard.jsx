import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const STOCKS = [
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'GOOGL', name: 'Alphabet' },
  { symbol: 'AMZN', name: 'Amazon' },
  { symbol: 'TSLA', name: 'Tesla' },
  { symbol: 'NVDA', name: 'NVIDIA' },
  { symbol: 'META', name: 'Meta' },
  { symbol: 'JPM', name: 'JPMorgan' },
  { symbol: 'V', name: 'Visa' },
  { symbol: 'UNH', name: 'UnitedHealth' },
  { symbol: 'XOM', name: 'Exxon Mobil' },
  { symbol: 'WMT', name: 'Walmart' }
];

const CRYPTOS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
  { id: 'toncoin', symbol: 'TON', name: 'Toncoin' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' }
];

const FMP_API_KEY = 'demo';
const HISTORY_POINTS = 18;

const seedHistory = (start, points) => {
  const history = [start];
  for (let i = 1; i < points; i += 1) {
    const prev = history[i - 1];
    const next = Math.max(0.01, prev + (Math.random() - 0.5) * prev * 0.02);
    history.push(next);
  }
  return history;
};

const appendHistory = (history, next) => {
  const updated = [...history, next];
  return updated.length > HISTORY_POINTS ? updated.slice(updated.length - HISTORY_POINTS) : updated;
};

const simulateListing = item => {
  const last = item.history[item.history.length - 1] ?? item.price;
  const next = Math.max(0.01, last + (Math.random() - 0.5) * last * 0.01);
  const changePct = ((next - last) / last) * 100;
  return {
    ...item,
    price: next,
    changePct,
    history: appendHistory(item.history, next)
  };
};

const parseChangePct = value => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace('%', '').replace(/[()]/g, '');
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const createStockListing = stock => {
  const base = 60 + Math.random() * 340;
  const history = seedHistory(base, 10);
  return {
    id: stock.symbol,
    symbol: stock.symbol,
    name: stock.name,
    price: history[history.length - 1],
    changePct: 0,
    history
  };
};

const createCryptoListing = crypto => {
  const base = 0.5 + Math.random() * 3500;
  const history = seedHistory(base, 10);
  return {
    id: crypto.symbol,
    symbol: crypto.symbol,
    name: crypto.name,
    price: history[history.length - 1],
    changePct: 0,
    history,
    apiId: crypto.id
  };
};

const formatPrice = value => {
  if (value >= 1000) {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (value >= 1) return value.toFixed(2);
  return value.toFixed(4);
};

const formatChange = value => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

const Sparkline = ({ data, positive }) => {
  if (data.length < 2) return null;
  const width = 120;
  const height = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const path = data
    .map((value, index) => {
      const x = (index * step).toFixed(2);
      const y = (height - ((value - min) / range) * height).toFixed(2);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <svg
      className={`w-28 h-6 ${positive ? 'text-emerald-500' : 'text-rose-500'}`}
      viewBox={`0 0 ${width} ${height}`}
      fill='none'
      aria-hidden='true'
    >
      <path d={path} stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
    </svg>
  );
};

export default function Dashboard({ type }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [dataMode, setDataMode] = useState('simulated');

  useEffect(() => {
    const initial = type === 'stocks'
      ? STOCKS.map(createStockListing)
      : CRYPTOS.map(createCryptoListing);

    setData(initial);
    setDataMode('simulated');

    const fetchLiveData = async () => {
      try {
        if (type === 'stocks') {
          const symbols = STOCKS.map(stock => stock.symbol).join(',');
          const response = await fetch(
            `https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${FMP_API_KEY}`
          );
          if (!response.ok) throw new Error('Stock price fetch failed');
          const quotes = await response.json();
          if (!Array.isArray(quotes)) throw new Error('Unexpected stock payload');
          const bySymbol = new Map(quotes.map(item => [item.symbol, item]));

          setData(prev =>
            STOCKS.map(stock => {
              const existing = prev.find(item => item.symbol === stock.symbol) ?? createStockListing(stock);
              const quote = bySymbol.get(stock.symbol);
              if (!quote || typeof quote.price !== 'number') return simulateListing(existing);
              const changePct = parseChangePct(quote.changesPercentage);
              const price = Number(quote.price);
              return {
                ...existing,
                price,
                changePct: changePct ?? existing.changePct,
                history: appendHistory(existing.history, price)
              };
            })
          );
        } else {
          const ids = CRYPTOS.map(coin => coin.id).join(',');
          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
          );
          if (!response.ok) throw new Error('Crypto price fetch failed');
          const prices = await response.json();

          setData(prev =>
            CRYPTOS.map(coin => {
              const existing = prev.find(item => item.apiId === coin.id) ?? createCryptoListing(coin);
              const quote = prices[coin.id];
              if (!quote || typeof quote.usd !== 'number') return simulateListing(existing);
              const price = Number(quote.usd);
              const changePct = Number(quote.usd_24h_change ?? existing.changePct);
              return {
                ...existing,
                price,
                changePct,
                history: appendHistory(existing.history, price)
              };
            })
          );
        }
        setDataMode('live');
      } catch (error) {
        setData(prev => prev.map(simulateListing));
        setDataMode('simulated');
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 15000);
    return () => clearInterval(interval);
  }, [type]);

  const filtered = data.filter(item =>
    `${item.symbol} ${item.name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='max-w-6xl mx-auto space-y-6'>
      <div className='flex justify-between items-center glass-panel p-4 rounded-2xl'>
        <div>
          <h1 className='text-3xl font-light uppercase tracking-widest'>{type} Markets</h1>
          <div className='text-xs uppercase tracking-[0.2em] text-zinc-500'>
            {dataMode === 'live' ? 'Live prices' : 'Simulated fallback'}
          </div>
        </div>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500' />
          <input
            type='text'
            placeholder='Search symbol or name...'
            className='bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-zinc-500 w-64'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className='glass-panel rounded-2xl overflow-hidden'>
        <div className='grid grid-cols-[1.5fr_1fr_1fr_1fr] p-4 border-b border-zinc-200 dark:border-zinc-800 text-sm tracking-wider font-semibold uppercase text-zinc-500'>
          <div>Symbol</div>
          <div>Price</div>
          <div>Trend</div>
          <div className='text-right'>Change (%)</div>
        </div>
        <div className='max-h-[60vh] overflow-auto hover:-translate-y-0'>
          {filtered.map(item => (
            <div
              key={item.id}
              className='grid grid-cols-[1.5fr_1fr_1fr_1fr] p-4 border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors'
            >
              <div className='font-medium flex flex-col'>
                <span>{item.symbol}</span>
                <span className='text-xs text-zinc-500'>{item.name}</span>
              </div>
              <div className='font-mono'>${formatPrice(item.price)}</div>
              <div className='flex items-center'>
                <Sparkline data={item.history} positive={item.changePct >= 0} />
              </div>
              <div
                className={`text-right font-mono ${
                  item.changePct >= 0 ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500'
                }`}
              >
                {formatChange(item.changePct)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
