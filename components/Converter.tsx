import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { CryptoCoin } from '../types';
import { fetchCoins } from '../services/cryptoService';

const KeypadButton: React.FC<{ onClick: () => void; className?: string; children: React.ReactNode }> = ({ onClick, className = '', children }) => (
  <button
    onClick={onClick}
    className={`bg-gray-700 hover:bg-gray-600 rounded-lg p-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xl font-semibold ${className}`}
  >
    {children}
  </button>
);


const Converter: React.FC = () => {
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin | null>(null);
  const [amount, setAmount] = useState<string>('1');
  const [isConvertingFromCrypto, setIsConvertingFromCrypto] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const loadCoins = async () => {
      const fetchedCoins = await fetchCoins();
      setCoins(fetchedCoins);
      if (fetchedCoins.length > 0) {
        setSelectedCoin(fetchedCoins[0]);
      }
    };
    loadCoins();
  }, []);
  
  const filteredCoins = useMemo(() => {
    return coins.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [coins, searchTerm]);

  const handleSelectCoin = (coin: CryptoCoin) => {
    setSelectedCoin(coin);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const toAmount = useMemo(() => {
    if (!selectedCoin || isNaN(parseFloat(amount))) return '0';
    if (isConvertingFromCrypto) {
      return (parseFloat(amount) * selectedCoin.current_price).toFixed(2);
    } else {
      return (parseFloat(amount) / selectedCoin.current_price).toFixed(6);
    }
  }, [amount, selectedCoin, isConvertingFromCrypto]);


  const swapCurrencies = useCallback(() => {
    setAmount(toAmount);
    setIsConvertingFromCrypto(prev => !prev);
  }, [toAmount]);

  const handleKeyPress = (key: string) => {
    if (key === 'C') {
      setAmount('0');
      return;
    }
    if (key === '←') {
      setAmount(amount.length > 1 ? amount.slice(0, -1) : '0');
      return;
    }
    if (key === '.') {
      if (!amount.includes('.')) {
        setAmount(amount + '.');
      }
      return;
    }
    // Handle numbers
    if (amount.length >= 15) return;
    if (amount === '0' && key !== '.') {
      setAmount(key);
    } else {
      setAmount(amount + key);
    }
  };

  const fromCurrency = isConvertingFromCrypto ? selectedCoin?.symbol.toUpperCase() : 'USD';
  const toCurrency = isConvertingFromCrypto ? 'USD' : selectedCoin?.symbol.toUpperCase();

  if (coins.length === 0) {
    return (
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Display */}
      <div className="bg-gray-900 rounded-lg p-4 text-right space-y-2 border border-gray-700">
        <div className="flex justify-between items-center">
          <div className="relative">
             <button
              onClick={() => isConvertingFromCrypto && setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:bg-gray-800 disabled:cursor-default"
              disabled={!isConvertingFromCrypto}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
            >
              {isConvertingFromCrypto && selectedCoin && <img src={selectedCoin.image} alt={selectedCoin.name} className="w-6 h-6 rounded-full" />}
              <span className="font-semibold">{fromCurrency}</span>
              {isConvertingFromCrypto && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg" role="listbox">
                <input
                  type="text"
                  placeholder="Buscar moneda..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 bg-gray-900 text-white border-b border-gray-700 focus:outline-none"
                  aria-label="Buscar criptomoneda"
                />
                <ul className="max-h-60 overflow-y-auto">
                  {filteredCoins.map(coin => (
                    <li
                      key={coin.id}
                      onClick={() => handleSelectCoin(coin)}
                      className="flex items-center p-2 hover:bg-gray-700 cursor-pointer"
                      role="option"
                      aria-selected={selectedCoin?.id === coin.id}
                    >
                      <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2 rounded-full" />
                      <span>{coin.name}</span>
                      <span className="ml-auto text-gray-400">{coin.symbol.toUpperCase()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <p className="text-white text-4xl font-mono break-all" aria-live="polite">{amount}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-400 p-2">{toCurrency}</p>
          <p className="text-gray-400 text-2xl font-mono">{toAmount}</p>
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-2">
        <KeypadButton onClick={() => handleKeyPress('7')}>7</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('8')}>8</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('9')}>9</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('C')} className="bg-purple-600/50 hover:bg-purple-600/70">C</KeypadButton>
        
        <KeypadButton onClick={() => handleKeyPress('4')}>4</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('5')}>5</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('6')}>6</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('←')} className="bg-gray-600 hover:bg-gray-500">←</KeypadButton>
        
        <KeypadButton onClick={() => handleKeyPress('1')}>1</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('2')}>2</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('3')}>3</KeypadButton>
        <button onClick={swapCurrencies} className="row-span-2 bg-gray-600 hover:bg-gray-500 rounded-lg p-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 12l-4-4m4 4l4-4m6 8v-12m0 12l-4-4m4 4l4-4" />
            </svg>
        </button>

        <KeypadButton onClick={() => handleKeyPress('0')} className="col-span-2">0</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('.')}>.</KeypadButton>
      </div>
    </div>
  );
};

export default Converter;