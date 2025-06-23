import { isToday, isBefore, isWithinInterval, addDays, startOfToday } from 'date-fns';

const tasks = [
  { title: 'Submit report', dueDate: new Date('2025-06-23') },
  { title: 'Team meeting', dueDate: new Date('2025-06-24') },
  { title: 'Pay bills', dueDate: new Date('2025-06-30') },
  { title: 'Renew license', dueDate: new Date('2025-06-20') },
];

const today = startOfToday();
const endOfWeek = addDays(today, 7);

const grouped = {
  today: [],
  thisWeek: [],
  overdue: [],
};

tasks.forEach(task => {
  const due = task.dueDate;
  if (isToday(due)) {
    grouped.today.push(task);
  } else if (isBefore(due, today)) {
    grouped.overdue.push(task);
  } else if (isWithinInterval(due, { start: today, end: endOfWeek })) {
    grouped.thisWeek.push(task);
  }
});

console.log(grouped);