"use client";

import { DateRangePicker } from "./DateRangePicker";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ReportFiltersProps {
  dateRange: { from: Date; to: Date };
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
  onExport: () => void;
}

export function ReportFilters({
  dateRange,
  onDateRangeChange,
  onExport
}: ReportFiltersProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <DateRangePicker
        from={dateRange.from}
        to={dateRange.to}
        onSelect={onDateRangeChange}
      />
      <Button onClick={onExport} variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Exportar
      </Button>
    </div>
  );
}