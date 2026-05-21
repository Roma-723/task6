import type { FilterCommand, CommandType, RangeCommand, WhereCommand, ExistsKeyCommand, FromToCommand, ShouldCommand } from '../../types/filter.types';
import { RangeCommand as RangeCommandComponent } from './commands/RangeCommand';
import { WhereCommand as WhereCommandComponent } from './commands/WhereCommand';
import { ExistsKeyCommand as ExistsKeyCommandComponent } from './commands/ExistsKeyCommand';
import { FromToCommand as FromToCommandComponent } from './commands/FromToCommand';
import { ShouldCommand as ShouldCommandComponent } from './commands/ShouldCommand';
import { nanoid } from 'nanoid';

interface FilterBuilderProps {
  commands: FilterCommand[];
  onCommandsChange: (commands: FilterCommand[]) => void;
  isNested?: boolean;
}

export function FilterBuilder({ commands, onCommandsChange, isNested = false }: FilterBuilderProps) {
  const createEmptyCommand = (type: CommandType): FilterCommand => {
    const id = nanoid();
    switch (type) {
      case 'range':
        return {
          id,
          type: 'range',
          rows: [{ id: nanoid(), keyName: '', op1: '>=', value1: '', op2: '<=', value2: '' }],
        } as RangeCommand;
      case 'where':
      case '!where':
        return {
          id,
          type,
          rows: [{ id: nanoid(), keyName: '', values: [{ id: nanoid(), val: '' }] }],
        } as WhereCommand;
      case 'exists_key':
      case '!exists_key':
        return {
          id,
          type,
          rows: [{ id: nanoid(), selected: '' }],
        } as ExistsKeyCommand;
      case 'from_to':
        return {
          id,
          type: 'from_to',
          rows: [{ id: nanoid(), keyName: '', from: '', to: '' }],
        } as FromToCommand;
      case 'should':
        return {
          id,
          type: 'should',
          commands: [],
        } as ShouldCommand;
    }
  };

  const addCommand = () => {
    const newCommand = createEmptyCommand('range');
    onCommandsChange([...commands, newCommand]);
  };

  const updateCommand = (id: string, updatedCommand: FilterCommand) => {
    const updated = commands.map(cmd => (cmd.id === id ? updatedCommand : cmd));
    onCommandsChange(updated);
  };

  const changeCommandType = (id: string, newType: CommandType) => {
    const newCommand = createEmptyCommand(newType);
    const updated = commands.map(cmd => (cmd.id === id ? newCommand : cmd));
    onCommandsChange(updated);
  };

  const removeCommand = (id: string) => {
    const updated = commands.filter(cmd => cmd.id !== id);
    onCommandsChange(updated);
  };

  return (
    <div className="space-y-3">
      {commands.map(command => (
        <div
          key={command.id}
          className="border border-gray-300 rounded p-3 bg-white"
        >
          <div className="flex items-start gap-3 mb-3">
            <select
              value={command.type}
              onChange={(e) => changeCommandType(command.id, e.target.value as CommandType)}
              className="px-2 py-1 border border-gray-300 rounded bg-white font-medium"
            >
              <option value="range">range</option>
              <option value="where">where</option>
              <option value="!where">!where</option>
              <option value="exists_key">exists_key</option>
              <option value="!exists_key">!exists_key</option>
              <option value="from_to">from_to</option>
              <option value="should">should</option>
            </select>

            <button
              onClick={() => removeCommand(command.id)}
              className="ml-auto px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 font-medium"
            >
              −
            </button>
          </div>

          <div className="ml-2">
            {command.type === 'range' && (
              <RangeCommandComponent
                command={command as RangeCommand}
                onUpdate={(cmd) => updateCommand(command.id, cmd)}
              />
            )}
            {(command.type === 'where' || command.type === '!where') && (
              <WhereCommandComponent
                command={command as WhereCommand}
                onUpdate={(cmd) => updateCommand(command.id, cmd)}
              />
            )}
            {(command.type === 'exists_key' || command.type === '!exists_key') && (
              <ExistsKeyCommandComponent
                command={command as ExistsKeyCommand}
                onUpdate={(cmd) => updateCommand(command.id, cmd)}
              />
            )}
            {command.type === 'from_to' && (
              <FromToCommandComponent
                command={command as FromToCommand}
                onUpdate={(cmd) => updateCommand(command.id, cmd)}
              />
            )}
            {command.type === 'should' && (
              <ShouldCommandComponent
                command={command as ShouldCommand}
                onUpdate={(cmd) => updateCommand(command.id, cmd)}
              />
            )}
          </div>
        </div>
      ))}

      <button
        onClick={addCommand}
        className="w-full px-3 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50 font-medium"
      >
        {isNested ? 'Добавить should' : 'Добавить команду'}
      </button>
    </div>
  );
}
