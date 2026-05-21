import type { ShouldCommand as ShouldCommandType, FilterCommand } from '../../../types/filter.types';
import { FilterBuilder } from '../FilterBuilder';

interface ShouldCommandProps {
  command: ShouldCommandType;
  onUpdate: (command: ShouldCommandType) => void;
}

export function ShouldCommand({ command, onUpdate }: ShouldCommandProps) {
  const handleCommandsChange = (commands: FilterCommand[]) => {
    onUpdate({ ...command, commands });
  };

  return (
    <div className="border-2 border-dashed border-blue-400 rounded p-4 bg-blue-50">
      <div className="text-sm font-medium mb-3 text-blue-700">Should Block</div>
      <FilterBuilder
        commands={command.commands}
        onCommandsChange={handleCommandsChange}
        isNested
      />
    </div>
  );
}
