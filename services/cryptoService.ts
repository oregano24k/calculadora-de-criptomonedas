import type { CryptoCoin } from '../types';

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