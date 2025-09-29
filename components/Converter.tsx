import React, { useState, useMemo, useCallback } from 'react';
import type { CryptoCoin } from '../types';

const KeypadButton: React.FC<{ onClick: () => void; className?: string; children: React.ReactNode }> = ({ onClick, className = '', children }) => (
  <button
    onClick={onClick}
    className={`bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 rounded-lg p-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xl font-semibold ${className}`}
  >
    {children}
  </button>
);

interface ConverterProps {
  coins: CryptoCoin[];
  selectedCoin: CryptoCoin | null;
  onCoinSelect: (coin: CryptoCoin) => void;
}

const Converter: React.FC<ConverterProps> = ({ coins, selectedCoin, onCoinSelect }) => {
  const [amount, setAmount] = useState<string>('1');
  const [isConvertingFromCrypto, setIsConvertingFromCrypto] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const filteredCoins = useMemo(() => {
    return coins.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [coins, searchTerm]);

  const handleSelectCoin = (coin: CryptoCoin) => {
    onCoinSelect(coin);
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

  return (
    <div className="space-y-4">
      {/* Display */}
      <div className="bg-gray-50 rounded-lg p-4 text-right space-y-2 border border-gray-200">
        <div className="flex justify-between items-center">
          <div className="relative">
             <button
              onClick={() => isConvertingFromCrypto && setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors disabled:bg-gray-100 disabled:cursor-default"
              disabled={!isConvertingFromCrypto}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
            >
              {isConvertingFromCrypto && selectedCoin && <img src={selectedCoin.image} alt={selectedCoin.name} className="w-6 h-6 rounded-full" />}
              <span className="font-semibold">{fromCurrency}</span>
              {isConvertingFromCrypto && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg" role="listbox">
                <input
                  type="text"
                  placeholder="Buscar moneda..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 bg-gray-50 text-gray-900 border-b border-gray-200 focus:outline-none"
                  aria-label="Buscar criptomoneda"
                />
                <ul className="max-h-60 overflow-y-auto">
                  {filteredCoins.map(coin => (
                    <li
                      key={coin.id}
                      onClick={() => handleSelectCoin(coin)}
                      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                      role="option"
                      aria-selected={selectedCoin?.id === coin.id}
                    >
                      <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2 rounded-full" />
                      <span>{coin.name}</span>
                      <span className="ml-auto text-gray-500">{coin.symbol.toUpperCase()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <p className="text-gray-900 text-4xl font-mono break-all" aria-live="polite">{amount}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-500 p-2">{toCurrency}</p>
          <p className="text-gray-500 text-2xl font-mono">{toAmount}</p>
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-2">
        <KeypadButton onClick={() => handleKeyPress('7')}>7</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('8')}>8</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('9')}>9</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('C')} className="bg-red-500 hover:bg-red-600 text-white border-red-600">C</KeypadButton>
        
        <KeypadButton onClick={() => handleKeyPress('4')}>4</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('5')}>5</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('6')}>6</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('←')} className="bg-gray-200 hover:bg-gray-300 border-gray-300">←</KeypadButton>
        
        <KeypadButton onClick={() => handleKeyPress('1')}>1</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('2')}>2</KeypadButton>
        <KeypadButton onClick={() => handleKeyPress('3')}>3</KeypadButton>
        <button onClick={swapCurrencies} className="row-span-2 bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 rounded-lg p-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center">
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