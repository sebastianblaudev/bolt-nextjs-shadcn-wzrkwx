"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangePickerProps {
  from: Date;
  to: Date;
  onSelect: (range: { from: Date; to: Date }) => void;
}

export function DateRangePicker({ from, to, onSelect }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from,
    to,
  });

  const handlePresetSelect = (value: string) => {
    const today = new Date();
    let newRange: { from: Date; to: Date } = { from: today, to: today };

    switch (value) {
      case "today":
        newRange = { from: today, to: today };
        break;
      case "yesterday":
        const yesterday = addDays(today, -1);
        newRange = { from: yesterday, to: yesterday };
        break;
      case "last7":
        newRange = { from: addDays(today, -7), to: today };
        break;
      case "last30":
        newRange = { from: addDays(today, -30), to: today };
        break;
      case "thisMonth":
        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        newRange = { from: firstOfMonth, to: today };
        break;
      case "lastMonth":
        const firstOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        newRange = { from: firstOfLastMonth, to: lastOfLastMonth };
        break;
    }

    setDate(newRange);
    onSelect(newRange);
  };

  const handleDateSelect = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (newDate?.from && newDate.to) {
      onSelect({ from: newDate.from, to: newDate.to });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select onValueChange={handlePresetSelect}>
        <SelectTrigger className="h-9 w-[180px]">
          <SelectValue placeholder="Seleccionar período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Hoy</SelectItem>
          <SelectItem value="yesterday">Ayer</SelectItem>
          <SelectItem value="last7">Últimos 7 días</SelectItem>
          <SelectItem value="last30">Últimos 30 días</SelectItem>
          <SelectItem value="thisMonth">Este mes</SelectItem>
          <SelectItem value="lastMonth">Mes anterior</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal w-[280px]",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/y", { locale: es })} -{" "}
                  {format(date.to, "dd/MM/y", { locale: es })}
                </>
              ) : (
                format(date.from, "dd/MM/y", { locale: es })
              )
            ) : (
              <span>Seleccionar fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}