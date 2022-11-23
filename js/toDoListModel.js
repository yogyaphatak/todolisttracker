import Task from './classTask.js';
import { FIRST_TASK_ID, HIGHEST_TASK_ID, MAX_ID_DIGITS } from './config.js';

let socket = io();

export const state  = {
    lastID: '',
    srNo: 0,
    sortBy: '',
    sequence: 'N',
    displayArchive: false,
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

export const sortAssignedTasks = function(sortBy, tasksToSort) {
    let sortedTasks = [];
    let copyOfTasks = tasksToSort.map(el => el);

    if(state.sortBy !== sortBy) {
        state.sortBy = '';
        state.sequence = 'N';
    }

    if(state.sequence === 'N')
        state.sequence = 'A';
    else if(state.sequence === 'A')
        state.sequence = 'D';
    else if(state.sequence === 'D')
        state.sequence = 'N';
    
    if(state.sequence === 'N') {
        state.sortBy = '';
        if(state.displayArchive)
            return state.archivedTasks;
        else
            return state.assignedTasks;
    }        

    if(sortBy === 'taskDescription') {
        state.sortBy = 'taskDescription';
        sortedTasks = copyOfTasks.sort((a, b) => {
            let x = a.taskDescription.toLowerCase();
            let y = b.taskDescription.toLowerCase();
            if(x < y) {
                if(state.sequence === 'A')
                    return -1;
                else if(state.sequence === 'D')
                    return 1;
            }
            if(x > y) {
                if(state.sequence === 'A')
                    return 1;
                else if(state.sequence === 'D')
                    return -1;
            }

            return 0;
        });
    }

    if(sortBy === 'startDate') {
        state.sortBy = 'startDate';
        sortedTasks = copyOfTasks.sort((a, b) => {
            if(a.startDate < b.startDate) {
                if(state.sequence === 'A') 
                    return -1;
                else if(state.sequence === 'D') 
                    return 1;
            }

            if(a.startDate > b.startDate) {
                if(state.sequence === 'A')
                    return 1;
                else if(state.sequence === 'D')
                    return -1;
            }
        });
    }

    if(sortBy === 'endDate') {
        state.sortBy = 'endDate';
        sortedTasks = copyOfTasks.sort((a, b) => {
            if(a.endDate < b.endDate) {
                if(state.sequence === 'A') 
                    return -1;
                else if(state.sequence === 'D') 
                    return 1;
            }

            if(a.endDate > b.endDate) {
                if(state.sequence === 'A')
                    return 1;
                else if(state.sequence === 'D')
                    return -1;
            }
        });
    }

    if(sortBy === 'status') {
        state.sortBy = 'status';
        sortedTasks = copyOfTasks.sort((a, b) => {
            let s1 = a.status.toLowerCase();
            let s2 = b.status.toLowerCase();
            if(s1 < s2) {
                if(state.sequence === 'A')
                    return -1;
                else if(state.sequence === 'D')
                    return 1;
            }
            if(s1 > s2) {
                if(state.sequence === 'A')
                    return 1;
                else if(state.sequence === 'D')
                    return -1;
            }

            return 0;
        });
    }

    return sortedTasks;
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