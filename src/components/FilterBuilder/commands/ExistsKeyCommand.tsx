import type { ExistsKeyCommand as ExistsKeyCommandType, ExistsKeyRow } from '../../../types/filter.types';
import { nanoid } from 'nanoid';

interface ExistsKeyCommandProps {
  command: ExistsKeyCommandType;
  onUpdate: (command: ExistsKeyCommandType) => void;
}

const SELECT_OPTIONS = ['select1', 'select2', 'select3', 'select4', 'select5', 'select6', 'select7', 'select8'];

export function ExistsKeyCommand({ command, onUpdate }: ExistsKeyCommandProps) {
  const updateRow = (rowId: string, selected: string) => {
    const updatedRows = command.rows.map(row =>
      row.id === rowId ? { ...row, selected } : row
    );
    onUpdate({ ...command, rows: updatedRows });
  };

  const addRow = () => {
    const newRow: ExistsKeyRow = {
      id: nanoid(),
      selected: '',
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
          {idx === 0 && <div className="w-12 text-sm font-medium">{command.type}</div>}
          {idx !== 0 && <div className="w-12" />}

          <select
            value={row.selected}
            onChange={(e) => updateRow(row.id, e.target.value)}
            className="w-32 px-2 py-1 border border-gray-300 rounded"
          >
            <option value="">Select...</option>
            {SELECT_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          {idx === command.rows.length - 1 ? (
            <button
              onClick={addRow}
              className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
            >
              +
            </button>
          ) : (
            <button
              onClick={() => removeRow(row.id)}
              className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
            >
              −
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
