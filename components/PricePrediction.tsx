
import React, { useState, useCallback } from 'react';
import { getMarketTrend } from '../services/geminiService';
import { fetchCoinHistory } from '../services/cryptoService';
import type { PriceHistoryPoint, TrendPrediction } from '../types';
import PredictionChart from './PredictionChart';

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
);

const ChartLoadingSkeleton: React.FC = () => (
    <div className="mt-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="w-full h-[200px] bg-gray-100 rounded-md"></div>
    </div>
);


const PricePrediction: React.FC = () => {
  const [prediction, setPrediction] = useState<TrendPrediction | null>(null);
  const [history, setHistory] = useState<PriceHistoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [analyzedCoin, setAnalyzedCoin] = useState<string | null>(null);

  const analyzeCoin = useCallback(async (coinId: string, coinName: string) => {
    setIsLoading(true);
    setError('');
    setPrediction(null);
    setHistory([]);
    setAnalyzedCoin(coinName);
    try {
      const fetchedHistory: PriceHistoryPoint[] = await fetchCoinHistory(coinId);
      if (fetchedHistory.length === 0) {
        throw new Error('No se pudo obtener el historial de precios.');
      }
      setHistory(fetchedHistory);

      const result = await getMarketTrend(coinName, fetchedHistory);
      if (!result.predictedPrices || result.predictedPrices.length === 0) {
        setError('La IA no pudo generar una predicción de precios. Inténtalo de nuevo.');
        setPrediction({ analysis: result.analysis, predictedPrices: [] });
      } else {
        setPrediction(result);
      }

    } catch (err) {
      setError('No se pudo obtener la predicción. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 text-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Predicción de Tendencia con IA</h2>
      <div className="flex space-x-4 mb-4">
        <button
            onClick={() => analyzeCoin('bitcoin', 'Bitcoin')}
            disabled={isLoading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
            Analizar Bitcoin
        </button>
        <button
            onClick={() => analyzeCoin('ethereum', 'Ethereum')}
            disabled={isLoading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
            Analizar Ethereum
        </button>
      </div>

      <div className="mt-4 bg-gray-50 p-4 rounded-lg min-h-[150px]">
        {isLoading && !prediction && <LoadingSkeleton />}
        {error && <p className="text-red-500">{error}</p>}
        {prediction?.analysis && <p className="text-gray-700 whitespace-pre-wrap">{prediction.analysis}</p>}
        {!isLoading && !prediction && !error && (
            <p className="text-gray-500">Selecciona una moneda para analizar su tendencia de precios.</p>
        )}
      </div>
      
      {isLoading && <ChartLoadingSkeleton />}
      {!isLoading && history.length > 0 && prediction?.predictedPrices.length > 0 && (
        <PredictionChart history={history} predictedPrices={prediction.predictedPrices} />
      )}

      <p className="text-xs text-gray-500 mt-4 text-center">Impulsado por Google Gemini. No es consejo financiero.</p>
    </div>
  );
};

export default PricePrediction;