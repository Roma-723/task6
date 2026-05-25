import type { RangeCommand as RangeCommandType, RangeRow } from '../../../types/filter.types';
import { nanoid } from 'nanoid';

interface RangeCommandProps {
  command: RangeCommandType;
  onUpdate: (command: RangeCommandType) => void;
}

export function RangeCommand({ command, onUpdate }: RangeCommandProps) {
  const updateRow = (rowId: string, updates: Partial<RangeRow>) => {
    const updatedRows = command.rows.map(row =>
      row.id === rowId ? { ...row, ...updates } : row
    );
    onUpdate({ ...command, rows: updatedRows });
  };

  const addRow = () => {
    const newRow: RangeRow = {
      id: nanoid(),
      keyName: '',
      op1: '>=',
      value1: '',
      op2: '<=',
      value2: '',
    };
    onUpdate({ ...command, rows: [...command.rows, newRow] });
  };

  const removeRow = (rowId: string) => {
    const updatedRows = command.rows.filter(row => row.id !== rowId);
    onUpdate({ ...command, rows: updatedRows });
  };

  return (
    <div className="space-y-2">
      {command.rows.map((row, idx) => (
        <div key={row.id} className="flex items-center gap-2">
          <div className="w-15">
            {idx === 0 && <span className="text-sm font-medium">range</span>}
          </div>

          <input
            type="text"
            value={row.keyName}
            onChange={(e) => updateRow(row.id, { keyName: e.target.value })}
            placeholder="keyName"
            className="w-50 px-3 py-2 h-9 border border-gray-300 rounded-md"
          />

          <select
            value={row.op1}
            onChange={(e) => updateRow(row.id, { op1: e.target.value as '>=' | '>' })}
            className="w-50 px-3 py-2 h-9 border border-gray-300 rounded-md"
          >
            <option value=">=">&gt;=</option>
            <option value=">">&gt;</option>
          </select>

          <input
            type="text"
            value={row.value1}
            onChange={(e) => updateRow(row.id, { value1: e.target.value })}
            placeholder="value"
            className="w-50 px-3 py-2 h-9 border border-gray-300 rounded-md"
          />
           <p>dfds</p>
          <select
            value={row.op2}
            onChange={(e) => updateRow(row.id, { op2: e.target.value as '<=' | '<' })}
            className="w-30 px-3 py-2 h-9 border border-gray-300 rounded-md"
          >
            <option value="<=">&lt;=</option>
            <option value="<">&lt;</option>
          </select>

          <input
            type="text"
            value={row.value2}
            onChange={(e) => updateRow(row.id, { value2: e.target.value })}
            placeholder="value"
            className="w-50 px-3 py-2 h-9 border border-gray-300 rounded-md"
          />

          <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100">
            📋
          </button>

          {idx === command.rows.length - 1 ? (
            <button
              onClick={addRow}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100"
            >
              +
            </button>
          ) : (
            <button
              onClick={() => removeRow(row.id)}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100"
            >
              −
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
