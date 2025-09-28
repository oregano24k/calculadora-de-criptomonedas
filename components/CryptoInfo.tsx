import React, { useState, useCallback } from 'react';
import type { CryptoCoin } from '../types';
import { getCryptoInfo } from '../services/geminiService';

interface CryptoInfoProps {
  selectedCoin: CryptoCoin | null;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
    </div>
);


const CryptoInfo: React.FC<CryptoInfoProps> = ({ selectedCoin }) => {
  const [info, setInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchInfo = useCallback(async () => {
    if (!selectedCoin) return;
    setIsLoading(true);
    setError('');
    setInfo('');
    try {
      const result = await getCryptoInfo(selectedCoin.name);
      setInfo(result);
    } catch (err) {
      setError('No se pudo obtener la información. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCoin]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">Asistente Cripto con IA</h2>
      
      {!selectedCoin ? (
        <div className="flex-grow flex items-center justify-center bg-gray-900/50 rounded-lg">
          <p className="text-gray-500">Selecciona una moneda para aprender sobre ella.</p>
        </div>
      ) : (
        <div className="flex-grow flex flex-col">
          <div className="flex items-center mb-4">
            <img src={selectedCoin.image} alt={selectedCoin.name} className="w-10 h-10 mr-3 rounded-full"/>
            <div>
              <h3 className="text-xl font-semibold text-white">{selectedCoin.name}</h3>
              <p className="text-sm text-gray-400">{selectedCoin.symbol.toUpperCase()}</p>
            </div>
          </div>
          
          <button
            onClick={fetchInfo}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Pensando...' : `Aprender sobre ${selectedCoin.name}`}
          </button>

          <div className="mt-4 flex-grow bg-gray-900/50 p-4 rounded-lg min-h-[150px]">
            {isLoading && <LoadingSkeleton />}
            {error && <p className="text-red-400">{error}</p>}
            {info && <p className="text-gray-300 whitespace-pre-wrap">{info}</p>}
            {!isLoading && !info && !error && (
                <p className="text-gray-500">Haz clic en el botón de arriba para obtener información sobre {selectedCoin.name} impulsada por IA.</p>
            )}
          </div>
        </div>
      )}
       <p className="text-xs text-gray-600 mt-4 text-center">Impulsado por Google Gemini</p>
    </div>
  );
};

export default CryptoInfo;