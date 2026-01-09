import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RuleValueInput } from "./RuleValueInput";
import { Rule, RuleType, RuleOperator, RuleValue, SubRule } from "@/types/rules";
import { cn } from "@/lib/utils";

interface CreateRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: Rule) => void;
  editingRule?: Rule | null;
}

const ruleTypes: { value: RuleType; label: string }[] = [
  { value: 'product_category', label: 'Product category' },
  { value: 'product_sku', label: 'Product SKU' },
  { value: 'eligible_revenue', label: 'Eligible revenue' },
  { value: 'tier', label: 'Tier' },
  { value: 'customer_segment', label: 'Customer segment' },
  { value: 'order_total', label: 'Order total' },
  { value: 'quantity', label: 'Quantity' },
];

const operators: { value: RuleOperator; label: string }[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Not contains' },
  { value: 'greater_than', label: 'Greater than' },
  { value: 'less_than', label: 'Less than' },
  { value: 'greater_than_or_equal', label: 'Greater than or equal to' },
  { value: 'less_than_or_equal', label: 'Less than or equal to' },
  { value: 'is_in_list', label: 'Is in list' },
  { value: 'is_not_in_list', label: 'Is not in list' },
];

export function CreateRuleModal({ isOpen, onClose, onSave, editingRule }: CreateRuleModalProps) {
  const [ruleType, setRuleType] = useState<RuleType | ''>(editingRule?.ruleType || '');
  const [operator, setOperator] = useState<RuleOperator | ''>(editingRule?.operator || '');
  const [values, setValues] = useState<RuleValue[]>(editingRule?.values || [{ id: crypto.randomUUID(), value: '' }]);
  const [useDefaultDates, setUseDefaultDates] = useState(editingRule?.useDefaultDates ?? true);
  const [startDate, setStartDate] = useState<Date | undefined>(editingRule?.startDate);
  const [endDate, setEndDate] = useState<Date | undefined>(editingRule?.endDate);
  const [subRules, setSubRules] = useState<SubRule[]>(editingRule?.subRules || []);

  const addSubRule = () => {
    const newSubRule: SubRule = {
      id: crypto.randomUUID(),
      ruleType: '',
      operator: '',
      values: [{ id: crypto.randomUUID(), value: '' }],
      useDefaultDates: true,
    };
    setSubRules([...subRules, newSubRule]);
  };

  const updateSubRule = (id: string, updates: Partial<SubRule>) => {
    setSubRules(subRules.map(sr => sr.id === id ? { ...sr, ...updates } : sr));
  };

  const removeSubRule = (id: string) => {
    setSubRules(subRules.filter(sr => sr.id !== id));
  };

  const handleSave = () => {
    if (!ruleType || !operator) return;

    const rule: Rule = {
      id: editingRule?.id || crypto.randomUUID(),
      ruleType,
      operator,
      values: values.filter(v => v.value.trim() !== ''),
      useDefaultDates,
      startDate,
      endDate,
      subRules,
    };

    onSave(rule);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setRuleType('');
    setOperator('');
    setValues([{ id: crypto.randomUUID(), value: '' }]);
    setUseDefaultDates(true);
    setStartDate(undefined);
    setEndDate(undefined);
    setSubRules([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-foreground/80 italic">
            Create Rule
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Rule Type */}
          <div className="space-y-2">
            <Label className="text-sm">
              <span className="text-destructive">*</span> Rule type
            </Label>
            <Select value={ruleType} onValueChange={(v) => setRuleType(v as RuleType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select rule type" />
              </SelectTrigger>
              <SelectContent>
                {ruleTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Operator */}
          <div className="space-y-2">
            <Label className="text-sm">
              <span className="text-destructive">*</span> Operator
            </Label>
            <Select value={operator} onValueChange={(v) => setOperator(v as RuleOperator)}>
              <SelectTrigger>
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                {operators.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Values */}
          <div className="space-y-2">
            <Label className="text-sm">
              <span className="text-destructive">*</span> Value
            </Label>
            <RuleValueInput values={values} onValuesChange={setValues} />
          </div>

          {/* Default Dates Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="defaultDates"
              checked={useDefaultDates}
              onCheckedChange={(checked) => setUseDefaultDates(checked as boolean)}
            />
            <Label htmlFor="defaultDates" className="text-sm cursor-pointer">
              Default rule dates from bonus
            </Label>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">
                <span className="text-destructive">*</span> Start date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">End date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Sub Rules */}
          {subRules.map((subRule, index) => (
            <div key={subRule.id} className="border-t pt-4 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Select defaultValue="or">
                  <SelectTrigger className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="or">or</SelectItem>
                    <SelectItem value="and">and</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex-1 h-px bg-border" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSubRule(subRule.id)}
                  className="text-destructive"
                >
                  Remove
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">
                  <span className="text-destructive">*</span> Rule type
                </Label>
                <Select
                  value={subRule.ruleType}
                  onValueChange={(v) => updateSubRule(subRule.id, { ruleType: v as RuleType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rule type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ruleTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">
                  <span className="text-destructive">*</span> Operator
                </Label>
                <Select
                  value={subRule.operator}
                  onValueChange={(v) => updateSubRule(subRule.id, { operator: v as RuleOperator })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">
                  <span className="text-destructive">*</span> Value
                </Label>
                <RuleValueInput
                  values={subRule.values}
                  onValuesChange={(values) => updateSubRule(subRule.id, { values })}
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={subRule.useDefaultDates}
                  onCheckedChange={(checked) => updateSubRule(subRule.id, { useDefaultDates: checked as boolean })}
                />
                <Label className="text-sm cursor-pointer">
                  Default rule dates from bonus
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">
                    <span className="text-destructive">*</span> Start date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !subRule.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {subRule.startDate ? format(subRule.startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={subRule.startDate}
                        onSelect={(date) => updateSubRule(subRule.id, { startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">End date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !subRule.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {subRule.endDate ? format(subRule.endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={subRule.endDate}
                        onSelect={(date) => updateSubRule(subRule.id, { endDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          ))}

          {/* Add Sub Rule Button */}
          <button
            type="button"
            onClick={addSubRule}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            + add sub rule
          </button>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} disabled={!ruleType || !operator}>
              Save
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
