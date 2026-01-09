import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RuleValue } from "@/types/rules";

interface RuleValueInputProps {
  values: RuleValue[];
  onValuesChange: (values: RuleValue[]) => void;
}

export function RuleValueInput({ values, onValuesChange }: RuleValueInputProps) {
  const addValue = () => {
    const newValue: RuleValue = {
      id: crypto.randomUUID(),
      value: '',
      connector: 'or',
    };
    onValuesChange([...values, newValue]);
  };

  const updateValue = (id: string, newValue: string) => {
    onValuesChange(values.map(v => v.id === id ? { ...v, value: newValue } : v));
  };

  const updateConnector = (id: string, connector: 'or' | 'and') => {
    onValuesChange(values.map(v => v.id === id ? { ...v, connector } : v));
  };

  const removeValue = (id: string) => {
    onValuesChange(values.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-2">
      {values.map((val, index) => (
        <div key={val.id} className="flex items-center gap-2">
          <Input
            value={val.value}
            onChange={(e) => updateValue(val.id, e.target.value)}
            placeholder="Enter value"
            className="flex-1"
          />
          {index < values.length - 1 && (
            <Select
              value={val.connector}
              onValueChange={(v) => updateConnector(val.id, v as 'or' | 'and')}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="or">or</SelectItem>
                <SelectItem value="and">and</SelectItem>
              </SelectContent>
            </Select>
          )}
          {values.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeValue(val.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              ×
            </Button>
          )}
          {index === values.length - 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addValue}
              className="text-primary border-primary hover:bg-accent"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add value
            </Button>
          )}
        </div>
      ))}
      {values.length === 0 && (
        <div className="flex items-center gap-2">
          <Input placeholder="Enter value" className="flex-1" disabled />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addValue}
            className="text-primary border-primary hover:bg-accent"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add value
          </Button>
        </div>
      )}
    </div>
  );
}
