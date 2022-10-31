
class ToDoListView {
    _toDoTable = document.querySelector('.toDoTable');
    _toDoActionBar = document.querySelector('.action--bar');
    _toDoTableHeaderRow = document.querySelector('.tblHeaderRow');
    
    taskRowEl = document.querySelectorAll('.taskRow');

    _allAddButtons = document.querySelectorAll('.addActionImg');
    _allSaveButtons = document.querySelectorAll('.saveActionImg');
    _allDeleteButtons = document.querySelectorAll('.deleteActionImg');
    _allEditButtons = document.querySelectorAll('.editActionImg');

    constructor() {        
        this.taskRowEl.forEach(taskRow => {
            taskRow.remove();            
        });
    }

    addHandlerCreateTask(handler) {
        this._toDoActionBar.addEventListener('click', evt => {
            
            evt.preventDefault();
            if(evt.target.classList.contains('add-new') || 
               evt.target.classList.contains('add-new-span')) {
                handler();
            }
        });
    }

    addHandlerShowArchive(handler) {
        this._toDoActionBar.addEventListener('click', evt => {            
            evt.preventDefault();           

            if(evt.target.classList.contains('show-archive') ||
               evt.target.classList.contains('show-archive-span')) {                
                handler();
            }
        });
    }
    
    addHandlerRender(handler) {     
        this._toDoTable.addEventListener('click', function(evt) {                                    
            const selectedId = evt.target.dataset.taskId;

            //Edit image button clicked...
            if (evt.target.classList.contains('editActionImg')) { 
                handler(selectedId, 'edit');
            }
        
            //Delete image button clicked...
            if (evt.target.classList.contains('deleteActionImg')) {                
                handler(selectedId, 'delete');
            }

            //Archive image button clicked...
            if(evt.target.classList.contains('archiveActionImg')) {                
                handler(selectedId, 'archive');
            }
        });
    }

    addHandlerSortRows(handler) {
        this._toDoTableHeaderRow.addEventListener('click', function(evt) {
            evt.preventDefault();
            if(evt.target.classList.contains('.hdr--task-description')) 
                handler('description');
            else if(evt.target.classList.contains('.hdr--start-date')) 
                handler('startDate');
            else if(evt.target.classList.contains('.hdr--end-date')) 
                handler('endDate');
            else if(evt.target.classList.contains('.hdr--status')) 
                handler('status');
            
        });
    }

    createTaskRow(srNo, task = undefined, isLastIdx = true, newTaskID, isArchive = false) {        
        const editActionButton = `
        <td>
            <img data-task-id="${task ? task.taskID : newTaskID}" class="actionImg ${task ? 'editActionImg' : ''}" title="Edit" id="editTaskImg" src="./icons/editTask.png" ${task ? '' : 'style="opacity: 0.5"'}>
        </td>`;

        const archiveActionButton = `
        <td>
            <img data-task-id="${task ? task.taskID : newTaskID}" class="actionImg ${task && task.status === 'completed' ? 'archiveActionImg' : ''}" title="Archive" id="archiveTaskImg" src="./icons/archiveTask.png" ${task && task.status == 'completed' ? '' : 'style="display: none"'}>
        </td>`;
        
        
        const rowHtml = `        
        <tr class="taskRow">
          <td class="srNo">
            ${srNo > 0 ? srNo : ''}
          </td>
          <td id="taskDescCol">
            ${task ? task.taskDescription : ''}
          </td>
          <td id="taskStrDateCol">
            ${task ? task.startDate : ''}
          </td>
          <td id="taskEndDateCol">           
            ${task ? task.endDate : ''} 
          </td>
          <td id="taskStatusCol">
            ${task ? this._getTaskStatusString(task.status) :  ''}
          </td>          
          ${!isArchive ? editActionButton: ''}
          <td>
            <img data-task-id="${task ? task.taskID : newTaskID}" class="actionImg deleteActionImg" title="Delete" id="deleteTaskImg" src="./icons/deleteTask.jpg" ${task ? '' : 'style="opacity: 0.5"'}>
          </td>
          ${!isArchive ? archiveActionButton: ''}
          <td class="taskID" style="display: none;">${task ? task.taskID : newTaskID}</td>
        </tr>
        `;        
        this._toDoTable.insertAdjacentHTML('beforeend', rowHtml);
    }

    removeTaskRows() {
        document.querySelectorAll('.taskRow').forEach(el => el.remove());
    }

    validateTaskElements(taskElements) {
        const taskDesc = taskElements[1].firstElementChild;
        const taskStrDate = taskElements[2].firstElementChild;
        const taskEndDate = taskElements[3].firstElementChild;
        const taskStatus = taskElements[4].firstElementChild;

        let isDescValid = true, isStrDateValid = true, isEndDateValid = true, isStatusValid = true;
        if (taskDesc.value === "") {
            taskDesc.classList.add('taskDescError');
            taskDesc.title = 'Task description is not entered';
            isDescValid = false;
        } else {
            taskDesc.classList.remove('taskDescError');
            taskDesc.title = '';
            isDescValid = true;
        }

        if (taskStrDate.value === "") {
            taskStrDate.classList.add('taskDescError');
            taskStrDate.title = 'Task start date is not entered';
            isStrDateValid = false;
        } else {
            taskStrDate.classList.remove('taskDescError');
            taskStrDate.title = '';
            isStrDateValid = true;
        }

        if (taskEndDate.value === "") {
            taskEndDate.classList.add('taskDescError');
            taskEndDate.title = 'Task end date is not entered';
            isEndDateValid = false;
        } else {
            if (taskEndDate.value < taskStrDate.value) {
            taskEndDate.classList.add('taskDescError');
            taskEndDate.title = 'Task end date should not be less than start date';
            isEndDateValid = false;
            } else {
            taskEndDate.classList.remove('taskDescError');
            taskEndDate.title = '';
            isEndDateValid = true;
            }
        }

        if (taskStatus.value === "blank") {
            taskStatus.classList.add('taskDescError');
            taskStatus.title = 'Invalid status';
            isStatusValid = false;
        } else {
            taskStatus.classList.remove('taskDescError');
            taskStatus.title = '';
            isStatusValid = true;
        }

        return isDescValid && isStrDateValid && isEndDateValid && isStatusValid;
    }

    // SAVE TASK FUNCTION
    saveTaskButtonClicked(taskRow) {
        const taskChildren = [...taskRow.children];
    
        const taskDesc = taskChildren[1].firstElementChild;
        const taskStrDate = taskChildren[2].firstElementChild;
        const taskEndDate = taskChildren[3].firstElementChild;
        const taskStatus = taskChildren[4].firstElementChild;
        const taskID = taskChildren[9].innerHTML;
    
        let saveValidator = this.validateTaskElements(taskChildren);
    
        if (saveValidator) {
            // Enable/Disable the required buttons        
            taskDesc.disabled = true;
            taskStrDate.disabled = true;
            taskEndDate.disabled = true;
            taskStatus.disabled = true;
        
            // Update the assigned tasks
            const taskIdx = assignedTasks.findIndex(srchTask => srchTask.taskID === taskID);
        
            if (taskIdx === -1) {
                assignedTasks.push(new Task(taskID, taskDesc.value, taskStrDate.value, taskEndDate.value, taskStatus.value));
            } else {
                assignedTasks[taskIdx].taskID = taskID;
                assignedTasks[taskIdx].taskDescription = taskDesc.value;
                assignedTasks[taskIdx].startDate = taskStrDate.value;
                assignedTasks[taskIdx].endDate = taskEndDate.value;
                assignedTasks[taskIdx].status = taskStatus.value;
            }
        
            localStorage.setItem('toDoTasks', JSON.stringify(assignedTasks));
        }
        return saveValidator;
    }

    // ADD TASK FUNCTION
    addTaskButtonClicked() {
        Task.srNo++;
        const addText = createTaskRow();
        this._toDoTable.insertAdjacentHTML('beforeend', addText);
    }

    // EDIT TASK FUNCTION
    editTaskButtonClicked(taskRow) {
        const taskChildren = [...taskRow.children];
    
        const taskDesc = taskChildren[1].firstElementChild;
        const taskStrDate = taskChildren[2].firstElementChild;
        const taskEndDate = taskChildren[3].firstElementChild;
        const taskStatus = taskChildren[4].firstElementChild;
    
        taskDesc.disabled = false;
        taskStrDate.disabled = false;
        taskEndDate.disabled = false;
        taskStatus.disabled = false;
    }
    
    // DELETE TASK FUNCTION
    deleteTaskButtonClicked(taskRow) {
        const taskRowELs = [...taskRow.children];
        const taskIDEl = taskRowELs.find(el => el.classList.contains('taskID'));
        const delIdx = assignedTasks.findIndex(tsk => tsk.taskID == taskIDEl.textContent);
        delIdx > -1 && assignedTasks.splice(delIdx, 1);
        localStorage.setItem('toDoTasks', JSON.stringify(assignedTasks));
    }

    _getTaskStatusString(status) {
        if(status === 'started') return 'Started';
        if(status === 'notRq') return 'Not Required';
        if(status === 'defr') return 'Deferred';
        if(status === 'inProgress') return 'In Progress';
        if(status === 'completed') return 'Completed';
    }
}

export default new ToDoListView();