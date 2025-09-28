import React from 'react';
import Converter from './components/Converter';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            Cripto Convertidor Pro
          </h1>
          <p className="text-gray-400 mt-2">
            Conversión de criptomonedas en tiempo real.
          </p>
        </header>

        <main>
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
            <Converter />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;