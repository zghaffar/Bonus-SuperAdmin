import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Rule, RuleType, RuleOperator } from "@/types/rules";
import { cn } from "@/lib/utils";

interface RuleRowProps {
  rule: Rule;
  onView: () => void;
  onRemove: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const ruleTypeLabels: Record<RuleType, string> = {
  product_category: 'Product category',
  product_sku: 'Product SKU',
  eligible_revenue: 'Eligible revenue',
  tier: 'Tier',
  customer_segment: 'Customer segment',
  order_total: 'Order total',
  quantity: 'Quantity',
};

const operatorLabels: Record<RuleOperator, string> = {
  equals: 'Equals',
  not_equals: 'Not equals',
  contains: 'Contains',
  not_contains: 'Not contains',
  greater_than: 'Greater than',
  less_than: 'Less than',
  greater_than_or_equal: 'Greater than or equal to',
  less_than_or_equal: 'Less than or equal to',
  is_in_list: 'Is in list',
  is_not_in_list: 'Is not in list',
};

export function RuleRow({ rule, onView, onRemove, isExpanded, onToggleExpand }: RuleRowProps) {
  const hasSubRules = rule.subRules && rule.subRules.length > 0;
  const valueDisplay = rule.values.map(v => v.value).join(' or ');

  return (
    <>
      <tr className="border-b border-border hover:bg-muted/30 transition-colors">
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Button variant="view" size="sm" onClick={onView} className="text-xs px-3">
              View
            </Button>
            {hasSubRules && (
              <button
                onClick={onToggleExpand}
                className="p-1 hover:bg-muted rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )}
            <span className="text-sm">{rule.ruleType ? ruleTypeLabels[rule.ruleType] : '--'}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-muted-foreground">--</td>
        <td className="px-4 py-3 text-sm">
          {rule.operator ? operatorLabels[rule.operator] : '--'}
        </td>
        <td className="px-4 py-3 text-sm">{valueDisplay || '--'}</td>
        <td className="px-4 py-3">
          <Button variant="remove" size="sm" onClick={onRemove} className="text-xs">
            Remove
          </Button>
        </td>
      </tr>

      {/* Sub-rules */}
      {isExpanded && hasSubRules && rule.subRules.map((subRule) => (
        <tr
          key={subRule.id}
          className="border-b border-border bg-muted/20"
        >
          <td className="px-4 py-3 pl-12">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                or
              </span>
              <span className="text-sm">{subRule.ruleType ? ruleTypeLabels[subRule.ruleType] : '--'}</span>
            </div>
          </td>
          <td className="px-4 py-3 text-sm text-muted-foreground">--</td>
          <td className="px-4 py-3 text-sm">
            {subRule.operator ? operatorLabels[subRule.operator] : '--'}
          </td>
          <td className="px-4 py-3 text-sm">
            {subRule.values.map(v => v.value).join(' or ') || '--'}
          </td>
          <td className="px-4 py-3"></td>
        </tr>
      ))}
    </>
  );
}
