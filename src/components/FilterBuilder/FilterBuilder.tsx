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

const UNIQUE_TYPES: CommandType[] = ['range', 'where', '!where', 'exists_key', '!exists_key', 'from_to'];
const COMMAND_OPTIONS: CommandType[] = [...UNIQUE_TYPES, 'should'];

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

  const updateCommand = (id: string, updatedCommand: FilterCommand) => {
    const updated = commands.map(cmd => (cmd.id === id ? updatedCommand : cmd));
    onCommandsChange(updated);
  };

  const handleTypeChange = (commandId: string, newType: CommandType) => {
    onCommandsChange(
      commands.map(cmd => {
        if (cmd.id !== commandId) return cmd;
        return createEmptyCommand(newType);
      })
    );
  };

  const removeCommand = (id: string) => {
    const updated = commands.filter(cmd => cmd.id !== id);
    onCommandsChange(updated);
  };

  const getFirstAvailableType = (): CommandType => {
    const usedTypes = commands.map(c => c.type);
    const available = UNIQUE_TYPES.find(opt => !usedTypes.includes(opt));
    if (available) return available;
    return "should";
  };

  const addCommand = () => {
    const newCommand = createEmptyCommand(getFirstAvailableType());
    onCommandsChange([...commands, newCommand]);
  };

  return (
    <div className={`${!isNested ? 'max-w-3xl mx-auto' : ''} space-y-3`}>
      {commands.map(command => {
        return (
        <div
          key={command.id}
          className="border border-gray-200 rounded-lg p-4 bg-white"
        >
          <div className="flex items-start gap-3 mb-3">
            <select
              value={command.type}
              onChange={(e) => handleTypeChange(command.id, e.target.value as CommandType)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white font-medium min-w-[140px]"
            >
              {COMMAND_OPTIONS.filter(opt => {
                if (opt === command.type) return true;
                const usedByOthers = commands
                  .filter(c => c.id !== command.id && c.type !== "should")
                  .map(c => c.type);
                return !usedByOthers.includes(opt);
              }).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <button
              onClick={() => removeCommand(command.id)}
              className="ml-auto w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 font-medium"
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
        );
      })}

      <button
        onClick={addCommand}
        className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg bg-white hover:border-blue-500 font-medium text-gray-500"
      >
        {isNested ? 'Добавить should' : 'Добавить команду'}
      </button>
    </div>
  );
}
