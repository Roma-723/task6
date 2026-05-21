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
    <div className="border-2 border-dashed border-blue-500 rounded-lg p-4 bg-blue-50">
      <FilterBuilder
        commands={command.commands}
        onCommandsChange={handleCommandsChange}
        isNested
      />
    </div>
  );
}
