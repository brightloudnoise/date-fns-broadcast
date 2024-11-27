import { endOfBroadcastMonth } from "../endOfBroadcastMonth";
import { getBroadcastWeek } from "../getBroadcastWeek";
import { getBroadcastYear } from "../getBroadcastYear";
import { startOfBroadcastMonth } from "../startOfBroadcastMonth";

export function renderBroadcastCalendar(year: number) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let calendar = `\n${year} Broadcast Calendar\n`;

  for (let month = 0; month < 12; month++) {
    const date = new Date(year, month, 15);
    const monthStart = startOfBroadcastMonth(date);
    const monthEnd = endOfBroadcastMonth(date);
    const broadcastYear = getBroadcastYear(date);

    // Count weeks by counting Mondays between start and end of broadcast month
    let weeksInMonth = 0;
    const tempDate = new Date(monthStart);
    while (tempDate <= monthEnd) {
      if (tempDate.getDay() === 1) {
        // Monday
        weeksInMonth++;
      }
      tempDate.setDate(tempDate.getDate() + 1);
    }

    calendar += `\n${months[month]} ${broadcastYear} (${weeksInMonth} weeks)\n`;
    calendar += `${"-".repeat(26)}\n`;
    calendar += `WK |  Mo Tu We Th Fr Sa Su\n`;

    // Reset to start of month and print calendar
    const currentDate = new Date(monthStart);
    let weekNum = getBroadcastWeek(monthStart);

    // Only print weeks until we reach the end of broadcast month
    while (currentDate <= monthEnd) {
      calendar += `${weekNum.toString().padStart(2, "0")} |  `;

      // Print each day of the week
      for (let day = 0; day < 7; day++) {
        calendar += `${currentDate.getDate().toString().padStart(2, "0")}`;
        if (day < 6) calendar += " ";
        currentDate.setDate(currentDate.getDate() + 1);
      }
      calendar += "\n";
      weekNum = getBroadcastWeek(currentDate); // Update weekNum based on new currentDate
    }
  }

  return calendar;
}
