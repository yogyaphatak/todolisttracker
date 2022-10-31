export default class Task {    
    
    constructor(taskID, taskDescription, startDate, endDate, status) {
        this.taskID = taskID;
        this.taskDescription = taskDescription;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;        
    }
}