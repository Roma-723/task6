import type {
  FilterCommand,
  RangeCommand,
  WhereCommand,
  ExistsKeyCommand,
  FromToCommand,
  ShouldCommand,
} from '../types/filter.types';

interface BuildJSONResult {
  range?: Record<string, Record<string, string>>[];
  where?: Record<string, string[]>[];
  '!where'?: Record<string, string[]>[];
  exists_key?: string[];
  '!exists_key'?: string[];
  from_to?: Record<string, string[]>[];
  should?: Record<string, any>[];
}

function mapOperator(op: string): string {
  switch (op) {
    case '>=':
      return 'gte';
    case '>':
      return 'gt';
    case '<=':
      return 'lte';
    case '<':
      return 'lt';
    default:
      return op;
  }
}

export function buildJSON(commands: FilterCommand[]): BuildJSONResult {
  const result: BuildJSONResult = {};

  // Group commands by type
  const grouped = commands.reduce((acc, cmd) => {
    if (!acc[cmd.type]) {
      acc[cmd.type] = [];
    }
    acc[cmd.type].push(cmd);
    return acc;
  }, {} as Record<string, FilterCommand[]>);

  // Process range commands
  if (grouped.range) {
    const rangeData = grouped.range.flatMap(cmd => {
      const rangeCmd = cmd as RangeCommand;
      return rangeCmd.rows
        .filter(row => row.keyName && (row.value1 || row.value2))
        .map(row => ({
          [row.keyName]: {
            [mapOperator(row.op1)]: row.value1,
            [mapOperator(row.op2)]: row.value2,
          },
        }));
    });
    if (rangeData.length > 0) {
      result.range = rangeData as unknown as Record<string, Record<string, string>>[];
    }
  }

  // Process where commands
  if (grouped.where) {
    result.where = grouped.where.flatMap(cmd => {
      const whereCmd = cmd as WhereCommand;
      return whereCmd.rows
        .filter(row => row.keyName)
        .map(row => ({
          [row.keyName]: row.values.map(v => v.val).filter(v => v),
        }))
        .filter(item => Object.values(item)[0].length > 0);
    });
    if (result.where.length === 0) delete result.where;
  }

  // Process !where commands
  if (grouped['!where']) {
    result['!where'] = grouped['!where'].flatMap(cmd => {
      const whereCmd = cmd as WhereCommand;
      return whereCmd.rows
        .filter(row => row.keyName)
        .map(row => ({
          [row.keyName]: row.values.map(v => v.val).filter(v => v),
        }))
        .filter(item => Object.values(item)[0].length > 0);
    });
    if (result['!where'].length === 0) delete result['!where'];
  }

  // Process exists_key commands
  if (grouped.exists_key) {
    const existsKeys = grouped.exists_key.flatMap(cmd => {
      const existsCmd = cmd as ExistsKeyCommand;
      return existsCmd.rows
        .filter(row => row.selected)
        .map(row => row.selected);
    });
    if (existsKeys.length > 0) {
      result.exists_key = existsKeys;
    }
  }

  // Process !exists_key commands
  if (grouped['!exists_key']) {
    const notExistsKeys = grouped['!exists_key'].flatMap(cmd => {
      const existsCmd = cmd as ExistsKeyCommand;
      return existsCmd.rows
        .filter(row => row.selected)
        .map(row => row.selected);
    });
    if (notExistsKeys.length > 0) {
      result['!exists_key'] = notExistsKeys;
    }
  }

  // Process from_to commands
  if (grouped.from_to) {
    result.from_to = grouped.from_to.flatMap(cmd => {
      const fromToCmd = cmd as FromToCommand;
      return fromToCmd.rows
        .filter(row => row.keyName && (row.from || row.to))
        .map(row => ({
          [row.keyName]: [row.from, row.to],
        }));
    });
    if (result.from_to.length === 0) delete result.from_to;
  }

  // Process should commands (recursive)
  if (grouped.should) {
    result.should = grouped.should.flatMap(cmd => {
      const shouldCmd = cmd as ShouldCommand;
      const innerJSON = buildJSON(shouldCmd.commands);
      return Object.keys(innerJSON).map(key => ({
        [key]: (innerJSON as any)[key],
      }));
    });
    if (result.should.length === 0) delete result.should;
  }

  return result;
}
