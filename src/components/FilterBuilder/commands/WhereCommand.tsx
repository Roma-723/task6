import type { WhereCommand as WhereCommandType, WhereRow } from '../../../types/filter.types';
import { nanoid } from 'nanoid';

interface WhereCommandProps {
  command: WhereCommandType;
  onUpdate: (command: WhereCommandType) => void;
}

export function WhereCommand({ command, onUpdate }: WhereCommandProps) {
  const updateRow = (rowId: string, updates: Partial<WhereRow>) => {
    const updatedRows = command.rows.map(row =>
      row.id === rowId ? { ...row, ...updates } : row
    );
    onUpdate({ ...command, rows: updatedRows });
  };

  const updateValue = (rowId: string, valueId: string, val: string) => {
    const updatedRows = command.rows.map(row =>
      row.id === rowId
        ? {
            ...row,
            values: row.values.map(v => (v.id === valueId ? { ...v, val } : v)),
          }
        : row
    );
    onUpdate({ ...command, rows: updatedRows });
  };

  const removeValue = (rowId: string, valueId: string) => {
    const updatedRows = command.rows.map(row =>
      row.id === rowId
        ? { ...row, values: row.values.filter(v => v.id !== valueId) }
        : row
    );
    onUpdate({ ...command, rows: updatedRows });
  };

  const addValueToRow = (rowId: string) => {
    const updatedRows = command.rows.map(row =>
      row.id === rowId
        ? { ...row, values: [...row.values, { id: nanoid(), val: '' }] }
        : row
    );
    onUpdate({ ...command, rows: updatedRows });
  };

  const addRow = () => {
    const newRow: WhereRow = {
      id: nanoid(),
      keyName: '',
      values: [{ id: nanoid(), val: '' }],
    };
    onUpdate({ ...command, rows: [...command.rows, newRow] });
  };

  const removeRow = (rowId: string) => {
    const updatedRows = command.rows.filter(row => row.id !== rowId);
    onUpdate({ ...command, rows: updatedRows });
  };

  const isLastRow = (rowId: string) => command.rows[command.rows.length - 1].id === rowId;

  return (
    <div className="space-y-2">
      {command.rows.map((row, rowIdx) => (
        <div key={row.id} className="space-y-1">
          <div className="flex items-center gap-2">
            {rowIdx === 0 && <div className="w-12 text-sm font-medium">{command.type}</div>}
            {rowIdx !== 0 && <div className="w-12" />}

            <input
              type="text"
              value={row.keyName}
              onChange={(e) => updateRow(row.id, { keyName: e.target.value })}
              placeholder="keyName"
              className="w-24 px-3 py-2 h-9 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={row.keyName}
              onChange={(e) => updateRow(row.id, { keyName: e.target.value })}
              placeholder="keyName"
              className="w-24 px-3 py-2 h-9 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={row.keyName}
              onChange={(e) => updateRow(row.id, { keyName: e.target.value })}
              placeholder="keyName"
              className="w-24 px-3 py-2 h-9 border border-gray-300 rounded-md"
            />

            <div className="flex-1" />
          </div>

          {row.values.map((value, valIdx) => {
            const isLastValue = valIdx === row.values.length - 1;
            return (
              <div key={value.id} className="flex items-center gap-2 ml-14">
                <input
                  type="text"
                  value={value.val}
                  onChange={(e) => updateValue(row.id, value.id, e.target.value)}
                  placeholder="value"
                  className="w-32 px-3 py-2 h-9 border border-gray-300 rounded-md"
                />

                {!isLastValue && (
                  <button
                    onClick={() => removeValue(row.id, value.id)}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
                  >
                    − in
                  </button>
                )}

                {isLastValue && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => addValueToRow(row.id)}
                      className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
                    >
                      + in
                    </button>
                    {isLastRow(row.id) && (
                      <>
                        <button
                          onClick={addRow}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100"
                        >
                          +
                        </button>
                      </>
                    )}
                    {!isLastRow(row.id) && (
                      <button
                        onClick={() => removeRow(row.id)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100"
                      >
                        −
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
