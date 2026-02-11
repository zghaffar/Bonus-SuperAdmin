import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RuleGroup } from "./RuleGroup";
import { RulesConfig, RuleGroup as RuleGroupType, LogicOperator } from "@/types/rules";

export function RulesBuilder() {
  const [config, setConfig] = useState<RulesConfig>({
    globalLogic: 'any',
    groups: [
      {
        id: crypto.randomUUID(),
        logic: 'any',
        rules: [],
      },
    ],
  });

  const handleGlobalLogicChange = (logic: LogicOperator) => {
    setConfig({ ...config, globalLogic: logic });
  };

  const addGroup = () => {
    const newGroup: RuleGroupType = {
      id: crypto.randomUUID(),
      logic: 'any',
      rules: [],
    };
    setConfig({ ...config, groups: [...config.groups, newGroup] });
  };

  const updateGroup = (groupId: string, updatedGroup: RuleGroupType) => {
    setConfig({
      ...config,
      groups: config.groups.map(g => g.id === groupId ? updatedGroup : g),
    });
  };

  const removeGroup = (groupId: string) => {
    setConfig({
      ...config,
      groups: config.groups.filter(g => g.id !== groupId),
    });
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-medium text-foreground/80 italic mb-6">SuperAdmin - Rules</h1>

        {/* Global Logic */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <span className="text-foreground">Offer applies when</span>
          <Select value={config.globalLogic} onValueChange={handleGlobalLogicChange}>
            <SelectTrigger className="w-16 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">any</SelectItem>
              <SelectItem value="all">all</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-foreground">of the below is true:</span>
        </div>

        {/* Rule Groups */}
        <div className="space-y-6">
          {config.groups.map((group, index) => (
            <RuleGroup
              key={group.id}
              group={group}
              groupIndex={index}
              onUpdate={(updated) => updateGroup(group.id, updated)}
              onRemove={() => removeGroup(group.id)}
            />
          ))}

          {/* Add Group Button */}
          <Button
            variant="add-group"
            onClick={addGroup}
            className="w-full py-6 text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add rule group
          </Button>
        </div>

      </div>
    </div>
  );
}
