'use strict'
import { alphabets, numbers } from './config.js';
import Task from './classTask.js';
import {state, getNewTaskID, sendGetInitialDataRequest, updateAssignedTasks, updateArchivedTasks, sortAssignedTasks} from './toDoListModel.js'; 
import toDoListView from './toDoListView.js';
import createTaskView from './createTaskView.js';
import archiveView from './archiveView.js';

let currentIndex = 0;

const loadInitialTaskData = function (isArchive = false, sortedTasks = undefined) {
  let _assignedTasks = [];

  if(state.sortBy === '')
    _assignedTasks = isArchive ? state.archivedTasks : state.assignedTasks;
  else  
    _assignedTasks = sortedTasks;

  state.srNo = 0;  
  // if(isArchive) {
  //   _assignedTasks = state.archivedTasks;
  // }
  
  if(_assignedTasks.length == 0) {    
    toDoListView.createTaskRow(state.srNo, undefined, true, getNewTaskID(), isArchive);
    return;
  }    
  
  _assignedTasks.forEach((assignedTask, idx) => {
    state.srNo++;
    let isLastIdx = (state.assignedTasks.length - 1 === idx)
    toDoListView.createTaskRow(state.srNo, assignedTask, isLastIdx, getNewTaskID(), isArchive);
  });  
}

const refreshTaskData = function() {
  toDoListView.removeTaskRows();
  
  if(archiveView.isArchiveScreen()) {
    loadInitialTaskData(true);
    updateArchivedTasks();
  } else {
    loadInitialTaskData();
    updateAssignedTasks(); 
  }
    
}

const controlCreateTask = function() {
  createTaskView.displayCreateTaskWindow(getNewTaskID());
}

const controlConfirmCreate = function(action) {
  const isValidData = createTaskView.validateTaskData();  
  if(!isValidData) return;

  const task = createTaskView.getTaskData();  
  if(action === 'add') {
    state.assignedTasks.push(task);
    state.lastID = task.taskID;    
  }
  else if(action === 'edit') {
    const selectedIndex = state.assignedTasks.findIndex(el => el.taskID === task.taskID);
    if(selectedIndex < 0) return;
    state.assignedTasks[selectedIndex] = task;
  }

  state.srNo = 0;
  refreshTaskData();

  createTaskView.toggleModal();
}

const controlConfirmDelete = function(display = true) {
  const task = createTaskView.getTaskData();  
  let selectedIndex = 0;
  const fromArchiveScreen = archiveView.isArchiveScreen();

  if(fromArchiveScreen) {
    selectedIndex = state.archivedTasks.findIndex(el => el.taskID === task.taskID);
  } else {
    selectedIndex = state.assignedTasks.findIndex(el => el.taskID === task.taskID);  
  }  

  if(selectedIndex < 0) return;  
  fromArchiveScreen ? state.archivedTasks.splice(selectedIndex,1) : state.assignedTasks.splice(selectedIndex,1);  
  state.srNo = 0;
  refreshTaskData();

  if(display) createTaskView.toggleDeleteModal();
}

const controlShowArchive = function() {
  toDoListView.removeTaskRows();
  archiveView.toggleArchiveView();
  loadInitialTaskData(true);
}

const controlShowActiveList = function() {
  toDoListView.removeTaskRows();
  archiveView.toggleArchiveView();
  loadInitialTaskData();
}

const controlSortRows = function(sortBy) {
  let sortedTasks = [];

  toDoListView.removeTaskRows();
  if(archiveView.isArchiveScreen()) {
    state.displayArchive = true;
    sortedTasks = sortAssignedTasks(sortBy, state.archivedTasks);    
  }
  else {
    state.displayArchive = false;
    sortedTasks = sortAssignedTasks(sortBy, state.assignedTasks);
  }
  
  loadInitialTaskData(state.displayArchive, sortedTasks);
}

const routeTaskAction = function(selectedId, action) {  
  if(archiveView.isArchiveScreen() && action === 'delete') {
    const selectedTask = state.archivedTasks.find(task => task.taskID === selectedId);
    createTaskView.displayDeleteTaskWindow(selectedTask, true);
    return;
  }

  const selectedTask = state.assignedTasks.find(task => task.taskID === selectedId);
  if(!selectedTask) return;

  if(action === 'edit')
    createTaskView.displayEditTaskWindow(selectedTask);

  if(action === 'delete') {    
    createTaskView.displayDeleteTaskWindow(selectedTask);
  }    
  
  if(action === 'archive') {
    createTaskView.setTaskData(selectedTask);
    state.archivedTasks.push(selectedTask);
    controlConfirmDelete(false);
    updateArchivedTasks();
  }

}

const init = function() {  
  loadInitialTaskData();  
  toDoListView.addHandlerRender(routeTaskAction);
  toDoListView.addHandlerCreateTask(controlCreateTask);
  toDoListView.addHandlerShowArchive(controlShowArchive);
  toDoListView.addHandlerSortRows(controlSortRows);

  archiveView.addHandlerShowActiveList(controlShowActiveList);

  createTaskView.addHandlerConfirmCreate(controlConfirmCreate);
  createTaskView.addHandlerConfirmDelete(controlConfirmDelete);
}

/////////////////////////////////////////////////////////////////
// Main Processing
/////////////////////////////////////////////////////////////////

sendGetInitialDataRequest();
setTimeout(init, 200);




