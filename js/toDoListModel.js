import Task from './classTask.js';
import { FIRST_TASK_ID, HIGHEST_TASK_ID, MAX_ID_DIGITS } from './config.js';

let socket = io();

export const state  = {
    lastID: '',
    srNo: 0,
    sortBy: '',
    assignedTasks: [],
    archivedTasks: []
}

export const getNewTaskID = () => {
    let numString = state.lastID.slice(1);
    let alphaString = state.lastID.slice(0, 1);

    let number = Number.parseInt(numString) + 1;

    if (number > HIGHEST_TASK_ID) {
        numString = FIRST_TASK_ID;
        let idx = alphabets.findIndex(alpha => alpha === alphaString);
        alphaString = alphabets[idx + 1];
    } else {
        numString = number.toString().padStart(MAX_ID_DIGITS, '0');
    }

    return alphaString + numString;        
}

const getInitialAssignedTasks = function(tasks) {
    return tasks.map(task => new Task(task.taskID, task.taskDescription, task.startDate, task.endDate, task.status));
}

export const sendGetInitialDataRequest = function() {
    socket.emit('getInitialData', {});
    socket.emit('getToDoListArchive', {});
}

export const updateAssignedTasks = function() {        
    socket.emit('updateToDoList', {
        lastID: state.lastID,
        assignedTasks: state.assignedTasks
    });
}

export const updateArchivedTasks = function() {
    socket.emit('updateToDoListArchive', state.archivedTasks);
}

socket.on('initialData', (initialData) => {  
  const loadData= JSON.parse(initialData);     
  state.lastID = loadData.lastID;
  state.assignedTasks = getInitialAssignedTasks(loadData.assignedTasks);    
});

socket.on('toDoListArchive', (archiveData) => {
    const loadData= JSON.parse(archiveData);
    state.archivedTasks = getInitialAssignedTasks(loadData);
});

socket.on('errorUpdate', (err) => { 
    console.log(err);
})