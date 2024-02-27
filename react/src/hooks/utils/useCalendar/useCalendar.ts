type Day = {
  day: number;
  month: number;
  year: number;
  disabled?: boolean;
};

const useCalendar: (date: Date) => Day[] = (date) => {
  let instance = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const daysInMonth = instance.getDate();

  instance.setDate(1);
  const firstDay = instance.getDay();
  const month = instance.getMonth();
  const year = instance.getFullYear();

  instance.setDate(0);
  const lastDayOfPrevMonth = instance.getDate();
  const prevMonth = instance.getMonth();
  const prevYear = instance.getFullYear();

  instance.setMonth(instance.getMonth() + 2);
  const nextMonth = instance.getMonth();
  const nextYear = instance.getFullYear();

  let calendar: Day[] = [];

  for (let i = firstDay; i > 0; i--) {
    calendar.push({
      day: lastDayOfPrevMonth - (i - 1),
      month: prevMonth,
      year: prevYear,
      disabled: true,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendar.push({ day: i, month, year });
  }

  let i = 1;
  while (calendar.length % 7 !== 0) {
    calendar.push({
      day: i,
      month: nextMonth,
      year: nextYear,
      disabled: true,
    });
    i++;
  }

  return calendar;
};

export default useCalendar;
