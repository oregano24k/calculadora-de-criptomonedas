
export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
}

export interface PriceHistoryPoint {
  timestamp: number;
  price: number;
}

export interface TrendPrediction {
  analysis: string;
  predictedPrices: number[];
}
