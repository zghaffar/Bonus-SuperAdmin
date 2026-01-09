import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RuleRow } from "./RuleRow";
import { CreateRuleModal } from "./CreateRuleModal";
import { RuleGroup as RuleGroupType, Rule, LogicOperator } from "@/types/rules";

interface RuleGroupProps {
  group: RuleGroupType;
  groupIndex: number;
  onUpdate: (group: RuleGroupType) => void;
  onRemove: () => void;
}

export function RuleGroup({ group, groupIndex, onUpdate, onRemove }: RuleGroupProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());

  const handleLogicChange = (logic: LogicOperator) => {
    onUpdate({ ...group, logic });
  };

  const handleAddRule = (rule: Rule) => {
    if (editingRule) {
      onUpdate({
        ...group,
        rules: group.rules.map(r => r.id === editingRule.id ? rule : r),
      });
    } else {
      onUpdate({ ...group, rules: [...group.rules, rule] });
    }
    setEditingRule(null);
  };

  const handleRemoveRule = (ruleId: string) => {
    onUpdate({
      ...group,
      rules: group.rules.filter(r => r.id !== ruleId),
    });
  };

  const handleViewRule = (rule: Rule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const toggleRuleExpanded = (ruleId: string) => {
    setExpandedRules(prev => {
      const next = new Set(prev);
      if (next.has(ruleId)) {
        next.delete(ruleId);
      } else {
        next.add(ruleId);
      }
      return next;
    });
  };

  return (
    <div className="rule-card animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-foreground">Rule group {groupIndex + 1}:</span>
          <Select value={group.logic} onValueChange={handleLogicChange}>
            <SelectTrigger className="w-16 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">any</SelectItem>
              <SelectItem value="all">all</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-foreground">of the below rules are true:</span>
        </div>
        <Button variant="remove" size="sm" onClick={onRemove}>
          <Trash2 className="h-4 w-4 mr-1" />
          Remove group
        </Button>
      </div>

      {/* Rules Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="rule-table-header">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Rule type</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Code</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Operator</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Value</th>
              <th className="text-left px-4 py-3 text-sm font-medium w-24"></th>
            </tr>
          </thead>
          <tbody>
            {group.rules.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm">
                  No rules. Click 'add rule' to begin.
                </td>
              </tr>
            ) : (
              group.rules.map((rule) => (
                <RuleRow
                  key={rule.id}
                  rule={rule}
                  onView={() => handleViewRule(rule)}
                  onRemove={() => handleRemoveRule(rule.id)}
                  isExpanded={expandedRules.has(rule.id)}
                  onToggleExpand={() => toggleRuleExpanded(rule.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Rule Button */}
      <div className="p-4">
        <Button
          variant="add-rule"
          size="sm"
          onClick={() => {
            setEditingRule(null);
            setIsModalOpen(true);
          }}
        >
          Add rule to group
        </Button>
      </div>

      <CreateRuleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRule(null);
        }}
        onSave={handleAddRule}
        editingRule={editingRule}
      />
    </div>
  );
}
