import React from 'react';
import type { PriceHistoryPoint } from '../types';

interface PredictionChartProps {
  history: PriceHistoryPoint[];
  predictedPrices: number[];
}

const PredictionChart: React.FC<PredictionChartProps> = ({ history, predictedPrices }) => {
  if (!history.length) return null;

  const width = 500;
  const height = 250;
  const padding = 40;

  const allPrices = [
    ...history.map(p => p.price),
    ...predictedPrices,
  ];

  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);

  const lastHistoryTimestamp = history[history.length - 1].timestamp;
  const futureTimestamps = Array.from({ length: 7 }, (_, i) => lastHistoryTimestamp + (i + 1) * 24 * 60 * 60 * 1000);
  
  const minTimestamp = history[0].timestamp;
  const maxTimestamp = futureTimestamps[futureTimestamps.length - 1];

  // Scales
  const xScale = (timestamp: number) => {
    if (maxTimestamp === minTimestamp) return padding;
    return padding + ((timestamp - minTimestamp) / (maxTimestamp - minTimestamp)) * (width - padding * 2);
  };
  const yScale = (price: number) => {
    if (maxPrice === minPrice) return height - padding;
    return height - padding - ((price - minPrice) / (maxPrice - minPrice)) * (height - padding * 2);
  };

  // Path strings
  const historyPath = history
    .map((p, i) => {
      const x = xScale(p.timestamp);
      const y = yScale(p.price);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');
  
  const lastHistoryPoint = { x: xScale(history[history.length - 1].timestamp), y: yScale(history[history.length - 1].price) };

  const predictionPath = [
    `M ${lastHistoryPoint.x},${lastHistoryPoint.y}`,
    ...predictedPrices.map((p, i) => {
        const x = xScale(futureTimestamps[i]);
        const y = yScale(p);
        return `L ${x},${y}`;
    })
  ].join(' ');

  // Y-axis labels
  const yAxisLabels = [];
  const numLabels = 5;
  for (let i = 0; i < numLabels; i++) {
      const price = minPrice + (i / (numLabels - 1)) * (maxPrice - minPrice);
      yAxisLabels.push({
          price: price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
          y: yScale(price),
      });
  }


  return (
    <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Gráfico de Predicción a 7 Días</h3>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-gray-50 rounded-md" aria-label={`Gráfico de precios para ${history[0]?.id}`}>
            {/* Y-axis labels and grid lines */}
            {yAxisLabels.map(({ price, y }) => (
                <g key={price}>
                    <text x={padding - 8} y={y} dy="0.3em" textAnchor="end" fill="#6b7280" fontSize="10">
                        {price}
                    </text>
                    <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
                </g>
            ))}

            {/* X-axis labels (simplified) */}
            <text x={padding} y={height - padding + 15} fill="#6b7280" fontSize="10">Hace 30 días</text>
            <text x={width - padding} y={height - padding + 15} textAnchor="end" fill="#6b7280" fontSize="10">En 7 días</text>

            {/* History path */}
            <path d={historyPath} fill="none" stroke="#6366f1" strokeWidth="2" />

            {/* Prediction path */}
            <path d={predictionPath} fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" />

            {/* Legend */}
            <g transform={`translate(${padding + 10}, ${padding - 20})`}>
                <rect x="0" y="0" width="10" height="10" fill="#6366f1" />
                <text x="15" y="8" fill="#374151" fontSize="10">Historial</text>
                <rect x="70" y="0" width="10" height="10" fill="#a855f7" />
                <text x="85" y="8" fill="#374151" fontSize="10">Predicción</text>
            </g>
        </svg>
    </div>
  );
};

export default PredictionChart;