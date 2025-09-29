
import React, { useState, useEffect } from 'react';
import Converter from './components/Converter';
import PricePrediction from './components/PricePrediction';
import Navbar from './components/Navbar';
import type { CryptoCoin } from './types';
import { fetchCoins } from './services/cryptoService';

export type Menu = 'tools' | 'ai';
export type ToolSection = 'converter';
export type AiSection = 'prediction';

const App: React.FC = () => {
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin | null>(null);

  // State for navigation
  const [activeMenu, setActiveMenu] = useState<Menu>('tools');
  const [activeSections, setActiveSections] = useState<{
    tools: ToolSection;
    ai: AiSection;
  }>({
    tools: 'converter',
    ai: 'prediction',
  });

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

  const handleSectionSelect = (menu: Menu, section: ToolSection | AiSection) => {
    setActiveMenu(menu);
    setActiveSections(prev => ({
      ...prev,
      [menu]: section,
    }));
  };
  
  const renderActiveSection = () => {
    const activeSection = activeSections[activeMenu];
    if (activeMenu === 'tools' && activeSection === 'converter') {
      return (
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
      );
    }
    if (activeMenu === 'ai') {
      if (activeSection === 'prediction') {
        return <PricePrediction />;
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
            Cripto Convertidor
          </h1>
          <p className="text-gray-600 mt-2">
            Conversión de criptomonedas y análisis con IA en tiempo real.
          </p>
        </header>

        <Navbar 
          activeMenu={activeMenu}
          activeSections={activeSections}
          onMenuSelect={setActiveMenu}
          onSectionSelect={handleSectionSelect}
        />

        <main>
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};

export default App;