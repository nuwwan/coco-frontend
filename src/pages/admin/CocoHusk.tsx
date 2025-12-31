/**
 * CocoHusk Page Component
 * Manages coco husk input and output lots with tabbed interface
 */

import { useState } from 'react';
import InputHuskTab from '../../components/Admin/CocoHusk/InputHuskTab';
import OutputHuskTab from '../../components/Admin/CocoHusk/OutputHuskTab';

// Tab type definition
type TabType = 'input' | 'output';

const CocoHusk = () => {
  const [activeTab, setActiveTab] = useState<TabType>('input');

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          🥥 Coco Husk Management
        </h1>
        <p className="text-slate-400">
          Manage input and output husk lots
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('input')}
            className={`
              px-6 py-3 rounded-md font-medium transition-all duration-200
              ${activeTab === 'input'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }
            `}
          >
            📥 Input Husk Lots
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`
              px-6 py-3 rounded-md font-medium transition-all duration-200
              ${activeTab === 'output'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }
            `}
          >
            📤 Output Husk Lots
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === 'input' ? <InputHuskTab /> : <OutputHuskTab />}
      </div>
    </div>
  );
};

export default CocoHusk;
