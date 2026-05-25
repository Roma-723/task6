import type { FromToCommand as FromToCommandType, FromToRow } from '../../../types/filter.types';
import { nanoid } from 'nanoid';
import { useState } from 'react';

interface FromToCommandProps {
  command: FromToCommandType;
  onUpdate: (command: FromToCommandType) => void;
}

// Mock data - in a real app, this would come from an API or props
const AVAILABLE_KEYS = ['key1', 'key2', 'key3', 'key4', 'key5'];

export function FromToCommand({ command, onUpdate }: FromToCommandProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const updateRow = (rowId: string, updates: Partial<FromToRow>) => {
    const updatedRows = command.rows.map(row =>
      row.id === rowId ? { ...row, ...updates } : row
    );
    onUpdate({ ...command, rows: updatedRows });
  };

  const addRow = () => {
    const newRow: FromToRow = {
      id: nanoid(),
      keyName: '',
      from: '',
      to: '',
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
          {idx === 0 && <div className="w-12 text-sm font-medium">from_to</div>}
          {idx !== 0 && <div className="w-12" />}

          <div className="relative">
            <input
              type="text"
              value={row.keyName}
              onChange={(e) => updateRow(row.id, { keyName: e.target.value })}
              onFocus={() => setOpenDropdown(row.id)}
              onBlur={() => setTimeout(() => setOpenDropdown(null), 100)}
              placeholder="keyName"
              className="w-28 px-3 py-2 h-9 border border-gray-300 rounded-md"
            />
            {openDropdown === row.id && (
              <div className="absolute top-full left-0 w-28 border border-gray-300 bg-white rounded-md mt-1 z-10">
                {AVAILABLE_KEYS.filter(k => k.includes(row.keyName)).length > 0 ? (
                  AVAILABLE_KEYS.filter(k => k.includes(row.keyName)).map(key => (
                    <div
                      key={key}
                      onClick={() => {
                        updateRow(row.id, { keyName: key });
                        setOpenDropdown(null);
                      }}
                      className="px-2 py-1 hover:bg-blue-50 cursor-pointer text-sm"
                    >
                      {key}
                    </div>
                  ))
                ) : (
                  <div className="px-2 py-1 text-gray-500 text-sm">No data</div>
                )}
              </div>
            )}
          </div>

          <input
            type="text"
            value={row.from}
            onChange={(e) => updateRow(row.id, { from: e.target.value })}
            placeholder="from"
            className="w-20 px-3 py-2 h-9 border border-gray-300 rounded-md"
          />

          <input
            type="text"
            value={row.to}
            onChange={(e) => updateRow(row.id, { to: e.target.value })}
            placeholder="to"
            className="w-20 px-3 py-2 h-9 border border-gray-300 rounded-md"
          />

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
