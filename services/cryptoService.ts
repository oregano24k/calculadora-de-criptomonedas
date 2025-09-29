import type { CryptoCoin, PriceHistoryPoint } from '../types';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';

export const fetchCoins = async (): Promise<CryptoCoin[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('No se pudieron obtener los datos de las criptomonedas');
    }
    const data: CryptoCoin[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener las monedas:", error);
    return [];
  }
};

export const fetchCoinHistory = async (coinId: string): Promise<PriceHistoryPoint[]> => {
  const API_URL_HISTORY = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30&interval=daily`;
  try {
    const response = await fetch(API_URL_HISTORY);
    if (!response.ok) {
      throw new Error(`No se pudieron obtener los datos históricos para ${coinId}`);
    }
    const data = await response.json();
    // The API returns { prices: [[timestamp, price], ...], ... }
    return data.prices.map((p: [number, number]) => ({
      timestamp: p[0],
      price: p[1],
    }));
  } catch (error) {
    console.error("Error al obtener el historial de la moneda:", error);
    return [];
  }
};
