export type CommandType = 'range' | 'where' | '!where' | 'exists_key' | '!exists_key' | 'from_to' | 'should';

export interface RangeRow {
  id: string;
  keyName: string;
  op1: '>=' | '>';
  value1: string;
  op2: '<=' | '<';
  value2: string;
}

export interface RangeCommand {
  id: string;
  type: 'range';
  rows: RangeRow[];
}

export interface WhereValue {
  id: string;
  val: string;
}

export interface WhereRow {
  id: string;
  keyName: string;
  values: WhereValue[];
}

export interface WhereCommand {
  id: string;
  type: 'where' | '!where';
  rows: WhereRow[];
}

export interface ExistsKeyRow {
  id: string;
  selected: string;
}

export interface ExistsKeyCommand {
  id: string;
  type: 'exists_key' | '!exists_key';
  rows: ExistsKeyRow[];
}

export interface FromToRow {
  id: string;
  keyName: string;
  from: string;
  to: string;
}

export interface FromToCommand {
  id: string;
  type: 'from_to';
  rows: FromToRow[];
}

export interface ShouldCommand {
  id: string;
  type: 'should';
  commands: FilterCommand[];
}

export type FilterCommand = RangeCommand | WhereCommand | ExistsKeyCommand | FromToCommand | ShouldCommand;
