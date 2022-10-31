import {BLANK_ERROR_MESSAGE, DATE_ERROR_MESSAGE, DELETE_TASK_MESSAGE, DELETE_TASK_MESSAGE_ARCHIVE} from './config.js'

class CreateTaskView {
    _toDoBody = document.body;    
    _overlayDiv = document.querySelector('.overlay');    

    // Create task form
    _modalWindow = document.querySelector('.modal__new-task');
    _modalNewTaskTitle = document.querySelector('.modal__new-task-title');
    _createTaskForm = document.querySelector('.modal__new-task-form');
    _closeCreateTaskModal = document.querySelector('.btn--close-modal');
    _modalNewTaskId = document.querySelector('.modal__new-task-id');
    _modalNewTaskDesc = document.querySelector('.modal__new-task-desc');
    _modalNewTaskStartDate = document.querySelector('.modal__new-task-start-date');
    _modalNewTaskEndDate = document.querySelector('.modal__new-task-end-date');
    _modalNewTaskStatus = document.querySelector('.modal__new-task-status');

    // Delete task form
    _modalDeleteTask = document.querySelector('.modal__delete-task');
    _closeDeleteTaskModal = document.querySelector('.btn--close-delete-modal');
    _deleteTaskForm = document.querySelector('.modal__delete-task-form');
    _modalDeleteMessage = document.querySelector('.modal__delete-message');


    _taskData = {};

    constructor() {
        this._addHandlerCloseModal();
    }

    toggleModal() {        
        this._modalWindow.classList.toggle('hidden');
        this._overlayDiv.classList.toggle('hidden');
    }

    toggleDeleteModal() {
        this._modalDeleteTask.classList.toggle('hidden');
        this._overlayDiv.classList.toggle('hidden');
    }

    displayCreateTaskWindow(newTaskID) {  
        this._clearCreateTaskModal();
        this._createTaskForm.classList.add('add');
        this._modalNewTaskTitle.textContent= 'Create New Task';
        this._modalNewTaskId.textContent = newTaskID;
        this._modalNewTaskStatus.value = "started";
        this.toggleModal();       
    }

    displayEditTaskWindow(selectedTask) {
        this._clearCreateTaskModal();
        this._createTaskForm.classList.add('edit');
        this._modalNewTaskTitle.textContent= 'Edit Task';
        this._modalNewTaskId.textContent = selectedTask.taskID;
        this._modalNewTaskDesc.value = selectedTask.taskDescription;
        this._modalNewTaskStartDate.value = selectedTask.startDate;
        this._modalNewTaskEndDate.value = selectedTask.endDate;
        this._modalNewTaskStatus.value = selectedTask.status;
        this.toggleModal();
    }

    displayDeleteTaskWindow(selectedTask, isArchive = false) {        
        if(!selectedTask) return;        
        this._taskData = selectedTask;        
        this._modalDeleteMessage.textContent = `${isArchive ? DELETE_TASK_MESSAGE_ARCHIVE : DELETE_TASK_MESSAGE}" ${selectedTask?.taskDescription}"`;
        this.toggleDeleteModal();
    }

    _addHandlerCloseModal() {        
        this._closeCreateTaskModal.addEventListener('click', this.toggleModal.bind(this));
        this._closeDeleteTaskModal.addEventListener('click', this.toggleDeleteModal.bind(this));
    }

    addHandlerConfirmCreate(handler) {
        this._createTaskForm.addEventListener('submit', function(evt) {            
            evt.preventDefault();
            if(this.classList.contains('add'))
                handler('add');
            else if(this.classList.contains('edit'))
                handler('edit');
        });
    }

    addHandlerConfirmDelete(handler) {
        this._deleteTaskForm.addEventListener('submit', function(evt) {
            evt.preventDefault();
            handler();
        });
    }

    validateTaskData() {
        let isValidData = true;
        this._removeCreateTaskModalErrors();

        if(this._modalNewTaskDesc.value === '') {
            isValidData = false;
            this._modalNewTaskDesc.classList.add('taskDescError');
            this._modalNewTaskDesc.title = BLANK_ERROR_MESSAGE;
        }

        if(this._modalNewTaskStartDate.value === '') {
            isValidData = false;
            this._modalNewTaskStartDate.classList.add('taskDescError');
            this._modalNewTaskStartDate.title = BLANK_ERROR_MESSAGE;
        }

        if(this._modalNewTaskEndDate.value === '' || this._modalNewTaskEndDate.value < this._modalNewTaskStartDate.value) {
            isValidData = false;                    
            this._modalNewTaskEndDate.title = this._modalNewTaskEndDate.value === '' ? BLANK_ERROR_MESSAGE : DATE_ERROR_MESSAGE;
            this._modalNewTaskEndDate.classList.add('taskDescError');
        }

        if(this._modalNewTaskStatus.value === "blank") {
            isValidData = false;
            this._modalNewTaskStatus.title = BLANK_ERROR_MESSAGE;
            this._modalNewTaskStatus.classList.add('taskDescError');
        }

        if(isValidData) {
            this._taskData = {
                taskID: this._modalNewTaskId.textContent,
                taskDescription: this._modalNewTaskDesc.value,
                startDate: this._modalNewTaskStartDate.value,
                endDate: this._modalNewTaskEndDate.value,
                status: this._modalNewTaskStatus.value  
            }
            this._clearCreateTaskModal();
        }

        return isValidData;
    }

    getTaskData() {
        return this._taskData;
    }

    setTaskData(task) {
        this._taskData = task;
    }

    _clearCreateTaskModal() {
        this._createTaskForm.classList.remove('add');
        this._createTaskForm.classList.remove('edit');
        
        this._modalNewTaskDesc.value = '';
        this._modalNewTaskStartDate.value = '';
        this._modalNewTaskEndDate.value = '';
        this._modalNewTaskStatus.value = '';

        this._removeCreateTaskModalErrors();
    }

    _removeCreateTaskModalErrors() {        
        this._modalNewTaskDesc.title = '';
        this._modalNewTaskStartDate.title = '';
        this._modalNewTaskEndDate.title = '';
        this._modalNewTaskStatus.title = '';

        this._modalNewTaskDesc.classList.remove('taskDescError');
        this._modalNewTaskStartDate.classList.remove('taskDescError');
        this._modalNewTaskEndDate.classList.remove('taskDescError');
        this._modalNewTaskStatus.classList.remove('taskDescError');
    }
}

export default new CreateTaskView();