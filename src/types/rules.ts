export type LogicOperator = 'any' | 'all';

export type RuleOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains' 
  | 'greater_than' 
  | 'less_than' 
  | 'greater_than_or_equal' 
  | 'less_than_or_equal'
  | 'is_in_list'
  | 'is_not_in_list';

export type RuleType = 
  | 'product_category' 
  | 'product_sku' 
  | 'eligible_revenue' 
  | 'tier' 
  | 'customer_segment'
  | 'order_total'
  | 'quantity';

export interface RuleValue {
  id: string;
  value: string;
  connector?: 'or' | 'and';
}

export interface SubRule {
  id: string;
  ruleType: RuleType | '';
  operator: RuleOperator | '';
  values: RuleValue[];
  useDefaultDates: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface Rule {
  id: string;
  ruleType: RuleType | '';
  code?: string;
  operator: RuleOperator | '';
  values: RuleValue[];
  useDefaultDates: boolean;
  startDate?: Date;
  endDate?: Date;
  subRules: SubRule[];
  isExpanded?: boolean;
}

export interface RuleGroup {
  id: string;
  logic: LogicOperator;
  rules: Rule[];
}

export interface RulesConfig {
  globalLogic: LogicOperator;
  groups: RuleGroup[];
}
