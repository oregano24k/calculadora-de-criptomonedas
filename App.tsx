import React from 'react';
import Converter from './components/Converter';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
            Cripto Convertidor
          </h1>
          <p className="text-gray-600 mt-2">
            Conversión de criptomonedas en tiempo real.
          </p>
        </header>

        <main>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <Converter />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;