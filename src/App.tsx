import { useState, useEffect } from 'react';
import { FilterBuilder } from './components/FilterBuilder';
import type { FilterCommand } from './types/filter.types';
import { buildJSON } from './utils/buildJSON';

const App = () => {
  const [commands, setCommands] = useState<FilterCommand[]>([]);
  const [jsonOutput, setJsonOutput] = useState({});

  useEffect(() => {
    const output = buildJSON(commands);
    setJsonOutput(output);
    console.log('Filter JSON Output:', output);
  }, [commands]);

  return (
    <div className=" bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Filter Builder</h1>
        <div className="w-300 bg-white rounded border border-gray-300 p-6 mb-8">
          <FilterBuilder
            commands={commands}
            onCommandsChange={setCommands}
          />
        </div>

        <pre className="bg-gray-100 border border-gray-300 rounded p-4 text-sm overflow-auto">
          {JSON.stringify(jsonOutput, null, 2)} 
        </pre>
      </div>
    </div>
  );
};

export default App;
