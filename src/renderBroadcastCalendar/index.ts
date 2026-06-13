import { endOfBroadcastMonth } from "../endOfBroadcastMonth";
import { getBroadcastWeek } from "../getBroadcastWeek";
import { startOfBroadcastMonth } from "../startOfBroadcastMonth";
import type { BroadcastOptions } from "../types";
import { DEFAULT_YEAR_START_MONTH } from "../types";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function renderBroadcastCalendar(
  year: number,
  options?: BroadcastOptions,
) {
  const yearStartMonth = options?.yearStartMonth ?? DEFAULT_YEAR_START_MONTH;

  let calendar = `\n${year} Broadcast Calendar\n`;

  for (let i = 0; i < 12; i++) {
    const absMonth = yearStartMonth + i;
    const calendarMonth = absMonth % 12;
    const calendarYear = year + Math.floor(absMonth / 12);

    const date = new Date(calendarYear, calendarMonth, 15);
    const monthStart = startOfBroadcastMonth(date);
    const monthEnd = endOfBroadcastMonth(date);

    let weeksInMonth = 0;
    const tempDate = new Date(monthStart);
    while (tempDate <= monthEnd) {
      if (tempDate.getDay() === 1) weeksInMonth++;
      tempDate.setDate(tempDate.getDate() + 1);
    }

    calendar += `\n${MONTH_NAMES[calendarMonth]} ${calendarYear} (${weeksInMonth} weeks)\n`;
    calendar += `${"-".repeat(26)}\n`;
    calendar += `WK |  Mo Tu We Th Fr Sa Su\n`;

    const currentDate = new Date(monthStart);
    let weekNum = getBroadcastWeek(monthStart, options);

    while (currentDate <= monthEnd) {
      calendar += `${weekNum.toString().padStart(2, "0")} |  `;
      for (let day = 0; day < 7; day++) {
        calendar += `${currentDate.getDate().toString().padStart(2, "0")}`;
        if (day < 6) calendar += " ";
        currentDate.setDate(currentDate.getDate() + 1);
      }
      calendar += "\n";
      weekNum = getBroadcastWeek(currentDate, options);
    }
  }

  return calendar;
}
