
import React from 'react';
import type { Menu, ToolSection, AiSection } from '../App';

interface NavbarProps {
  activeMenu: Menu;
  activeSections: {
    tools: ToolSection;
    ai: AiSection;
  };
  onMenuSelect: (menu: Menu) => void;
  onSectionSelect: (menu: Menu, section: ToolSection | AiSection) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeMenu, activeSections, onMenuSelect, onSectionSelect }) => {
  
  const menuButtonStyle = (menu: Menu) => 
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      activeMenu === menu 
        ? 'bg-indigo-600 text-white' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
    }`;
  
  const sectionButtonStyle = (isActive: boolean) => 
    `px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
      isActive
        ? 'bg-gray-200 text-gray-900'
        : 'text-gray-500 hover:bg-gray-100'
    }`;

  return (
    <nav className="bg-white rounded-xl p-2 mb-8 border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-4">
        {/* Main Menu Items */}
        <button onClick={() => onMenuSelect('tools')} className={menuButtonStyle('tools')}>
          Herramientas
        </button>
        <button onClick={() => onMenuSelect('ai')} className={menuButtonStyle('ai')}>
          Análisis IA
        </button>
      </div>

      {/* Sub-menu / Sections */}
      <div className="mt-2 pt-2 border-t border-gray-200 min-h-[34px]">
        {activeMenu === 'tools' && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSectionSelect('tools', 'converter')}
              className={sectionButtonStyle(activeSections.tools === 'converter')}
            >
              Convertidor
            </button>
          </div>
        )}
        {activeMenu === 'ai' && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSectionSelect('ai', 'prediction')}
              className={sectionButtonStyle(activeSections.ai === 'prediction')}
            >
              Predicción de Tendencia
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;