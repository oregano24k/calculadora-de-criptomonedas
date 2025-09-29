import React, { useState, useEffect } from 'react';
import Converter from './components/Converter';
import PricePrediction from './components/PricePrediction';
// FIX: Import the CryptoInfo component to make it available for use.
import CryptoInfo from './components/CryptoInfo';
import type { CryptoCoin } from './types';
import { fetchCoins } from './services/cryptoService';


const App: React.FC = () => {
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
            Cripto Convertidor
          </h1>
          <p className="text-gray-400 mt-2">
            Conversión de criptomonedas y análisis con IA en tiempo real.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
             <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 text-gray-800">
              {coins.length > 0 && selectedCoin ? (
                <Converter 
                  coins={coins}
                  selectedCoin={selectedCoin}
                  onCoinSelect={setSelectedCoin}
                />
              ) : (
                <div className="flex justify-center items-center h-[450px]">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* FIX: Add the CryptoInfo component to the UI and provide spacing. */}
          <div className="lg:col-span-2 space-y-8">
            <PricePrediction />
            <CryptoInfo selectedCoin={selectedCoin} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
