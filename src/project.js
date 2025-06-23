import { Task } from "./task";


class Project {
    constructor(title, description) {
        this.title = title;;
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
    removeTask(index){
        if(index >= 0 && index <= this.tasks.length){
            this.tasks.splice(index,1);
        }
    }
    showTasks(){
        console.log(`Title: ${this.title}\n\nDescription: ${this.description}`);
        this.tasks.forEach((task,i)=>{
            console.log(`#Task${i + 1}`);
            task.showResult();
        });
    }
    showProject() {
    console.table({ title: this.title, description: this.description });
  }

}



export { Project };