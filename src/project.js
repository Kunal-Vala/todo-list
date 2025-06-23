// import { Task } from "./task";
// import { isToday, isBefore, isWithinInterval, addDays, startOfToday } from 'date-fns';



// class Project {
//     constructor(title, description) {
//         this.title = title;;
//         this.description = description;
//         this.tasks = [];
//     }
//     addTask(task) {
//         if (task instanceof Task) {
//             this.tasks.push(task);
//         } else {
//             throw new Error('Only Task instances can be added');
//         }
//     }
//     removeTask(index) {
//         if (index >= 0 && index <= this.tasks.length) {
//             this.tasks.splice(index, 1);
//         }
//     }
//     showTasks() {
//         console.log(`Title: ${this.title}\n\nDescription: ${this.description}`);
//         this.tasks.forEach((task, i) => {
//             console.log(`#Task${i + 1}`);
//             task.showResult();
//         });
//     }
//     showProject() {
//         console.table({ title: this.title, description: this.description });
//     }
//     deleteTask(title) {
//         const index = this.tasks.findIndex(task => task.title === title);
//         if (index !== -1) {
//             this.tasks.splice(index, 1);
//             return true;
//         } else {
//             // Optionally, you can log or handle the not found case here
//             return false;
//         }
//     }
//     editTask(task) {
//         task.editTask("DesI", "Createayout", "2025-06-23", "Urgent");
//     }

//     sortByDueDate() {
//         this.tasks.sort((a, b) => {
//             return new Date(a.dueDate) - new Date(b.dueDate);
//         });
//     }


//     findTask(title) {
//         return this.tasks.find(task => task.title === title) || null;
//     }

//     searchTask(title) {
//         const task = this.findTask(title);
//         if (task) {
//             task.showResult();
//             return true;
//         } else {
//             // Optionally, you can log or handle the not found case here
//             return false;
//         }
//     }

//     sortByPriority() {
//         const priorityOrder = { urgent: 1, high: 2, medium: 3, low: 4 };
//         this.tasks.sort((a, b) => {
//             return (priorityOrder[a.priority.toLowerCase()] || 99) - (priorityOrder[b.priority.toLowerCase()] || 99);
//         });
//     }


//     showCompletedTasks() {
//         this.tasks.forEach((task, i) => {
//             if (task.completed === true) {
//                 task.showResult();
//             }

//         });
//     }

//     showPendingTasks() {
//         this.tasks.forEach((task, i) => {
//             if (task.completed === false) {
//                 task.showResult();
//             }

//         });
//     }

//     filterByTitle(title) {
//         const searchTerm = title;
//         const dynamicRegex = new RegExp(searchTerm, 'i');
//         console.log(`Search"${title}"`);
//         const filtered = this.tasks.filter(task => dynamicRegex.test(task.title));
//         console.table(filtered)
//     }

//     filterByPriority(priority) {
//         let searchTerm;
//         let dynamicRegex;
//         let filtered;
//         switch (priority.toLowerCase()) {

//             case "urgent":
//                 searchTerm = priority.toLowerCase();
//                 dynamicRegex = new RegExp(searchTerm, 'i');
//                 console.log(`Search "${priority}"`);
//                 filtered = this.tasks.filter(task => dynamicRegex.test(task.priority));
//                 if (filtered.length > 0) {
//                     console.table(filtered)

//                 } else {
//                     console.log("No tasks found with the given priority.")

//                 }
//                 break;

//             case "high":
//                 searchTerm = priority.toLowerCase();
//                 dynamicRegex = new RegExp(searchTerm, 'i');
//                 console.log(`Search"${priority}"`);
//                 filtered = this.tasks.filter(task => dynamicRegex.test(task.priority));
//                 if (filtered.length > 0) {
//                     console.table(filtered)

//                 } else {
//                     console.log("No tasks found with the given priority.")

//                 }
//                 break;
//             case "medium":
//                 searchTerm = priority.toLowerCase();
//                 dynamicRegex = new RegExp(searchTerm, 'i');
//                 console.log(`Search"${priority}"`);
//                 filtered = this.tasks.filter(task => dynamicRegex.test(task.priority));
//                 if (filtered.length > 0) {
//                     console.table(filtered)

//                 } else {
//                     console.log("No tasks found with the given priority.")

//                 }
//                 break;

//             case "low":
//                 searchTerm = priority.toLowerCase();
//                 dynamicRegex = new RegExp(searchTerm, 'i');
//                 console.log(`Search"${priority}"`);
//                 filtered = this.tasks.filter(task => dynamicRegex.test(task.priority));
//                 if (filtered.length > 0) {
//                     console.table(filtered)

//                 } else {
//                     console.log("No tasks found with the given priority.")

//                 }
//                 break;

//             default:
//                 console.log("No tasks found with the given priority.")
//                 break;
//         }
//     }



//     groupByDueDate() {
//         const today = startOfToday();
//         const endOfWeek = addDays(today, 7);

//         const grouped = {
//             today: [],
//             thisWeek: [],
//             overdue: [],
//             later: [],
//         };

//         this.tasks.forEach(task => {
//             const due = new Date(task.dueDate);
//             if (isNaN(due.getTime())) return; // Skip invalid dates

//             if (isToday(due)) {
//                 grouped.today.push(task);
//             } else if (isBefore(due, today)) {
//                 grouped.overdue.push(task);
//             } else if (isWithinInterval(due, { start: today, end: endOfWeek })) {
//                 grouped.thisWeek.push(task);
//             } else {
//                 grouped.later.push(task);
//             }
//         });

//         if (grouped.today.length) {
//             console.log("🟢 Due Today:");
//             console.table(grouped.today);
//         }

//         if (grouped.thisWeek.length) {
//             console.log("🔵 Due This Week:");
//             console.table(grouped.thisWeek);
//         }

//         if (grouped.overdue.length) {
//             console.log("🔴 Overdue:");
//             console.table(grouped.overdue);
//         }

//         if (grouped.later.length) {
//             console.log("🟡 Due Later:");
//             console.table(grouped.later);
//         }

//         return grouped;
//     }

//     clearAllTasks(){
//         this.tasks = [];
//     }
    

//     deleteProject(title) {
//         if (this.title === title) {
//             this.title = null;
//             this.description = null;
//             this.tasks = [];
//             return true;
//         }
//         return false;
//     }
// }



// export { Project };



import { Task } from './task.js';
import { isToday, isBefore, isWithinInterval, addDays, startOfToday } from 'date-fns';

class Project {
  constructor(title, description) {
    this.title = title;
    this.description = description;
    this.tasks = [];
  }

  addTask(task) {
    if (task instanceof Task) {
      this.tasks.push(task);
    } else {
      throw new Error('Only Task instances can be added');
    }
  }

  removeTask(index) {
    if (index >= 0 && index < this.tasks.length) {
      this.tasks.splice(index, 1);
    }
  }

  showTasks() {
    console.log(`\nTitle: ${this.title}\nDescription: ${this.description}`);
    this.tasks.forEach((task, i) => {
      console.log(`#Task ${i + 1}`);
      task.showResult();
    });
  }

  showProject() {
    console.table({ title: this.title, description: this.description });
  }

  deleteTaskById(id) {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      return true;
    }
    return false;
  }

  editTaskById(id, updates) {
    const task = this.findTaskById(id);
    if (task) {
      task.editTask(updates);
      return true;
    }
    return false;
  }

  findTaskById(id) {
    return this.tasks.find(task => task.id === id) || null;
  }

  searchTask(title) {
    const regex = new RegExp(title, 'i');
    const result = this.tasks.filter(task => regex.test(task.title));
    console.table(result);
    return result.length > 0;
  }

  sortByDueDate() {
    this.tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  sortByPriority() {
    const priorityOrder = { urgent: 1, high: 2, medium: 3, low: 4 };
    this.tasks.sort((a, b) =>
      (priorityOrder[a.priority.toLowerCase()] || 99) -
      (priorityOrder[b.priority.toLowerCase()] || 99)
    );
  }

  showCompletedTasks() {
    const filtered = this.tasks.filter(task => task.completed);
    console.table(filtered);
  }

  showPendingTasks() {
    const filtered = this.tasks.filter(task => !task.completed);
    console.table(filtered);
  }

  filterByTitle(title) {
    const regex = new RegExp(title, 'i');
    const filtered = this.tasks.filter(task => regex.test(task.title));
    console.table(filtered);
  }

  filterByPriority(priority) {
    const regex = new RegExp(priority, 'i');
    const filtered = this.tasks.filter(task => regex.test(task.priority));
    console.table(filtered.length ? filtered : ['No match found']);
  }

  groupByDueDate() {
    const today = startOfToday();
    const endOfWeek = addDays(today, 7);

    const grouped = {
      today: [],
      thisWeek: [],
      overdue: [],
      later: [],
    };

    this.tasks.forEach(task => {
      const due = new Date(task.dueDate);
      if (isNaN(due)) return;

      if (isToday(due)) grouped.today.push(task);
      else if (isBefore(due, today)) grouped.overdue.push(task);
      else if (isWithinInterval(due, { start: today, end: endOfWeek })) grouped.thisWeek.push(task);
      else grouped.later.push(task);
    });

    if (grouped.today.length) console.log("🟢 Due Today:"), console.table(grouped.today);
    if (grouped.thisWeek.length) console.log("🔵 Due This Week:"), console.table(grouped.thisWeek);
    if (grouped.overdue.length) console.log("🔴 Overdue:"), console.table(grouped.overdue);
    if (grouped.later.length) console.log("🟡 Due Later:"), console.table(grouped.later);
  }

  clearAllTasks() {
    this.tasks = [];
  }

  deleteProject(title) {
    if (this.title === title) {
      this.title = null;
      this.description = null;
      this.tasks = [];
      return true;
    }
    return false;
  }
}

export { Project };
