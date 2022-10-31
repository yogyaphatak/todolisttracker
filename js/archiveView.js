import { HEADER_TEXT_NORMAL, HEADER_TEXT_ARCHIVE } from './config.js';

class ArchiveView {
    _toDoActionBar = document.querySelector('.action--bar');
    _toDoListCreateTask = document.querySelector('.add-new');
    _toDoListShowArchive = document.querySelector('.show-archive');
    _toDoListShowActive = document.querySelector('.show-to-do-list');
    _toDoListHeader = document.querySelector('.to-do-list-header');
    _isShowActive = true;

    constructor() {
        this._toDoListHeader.textContent = HEADER_TEXT_NORMAL;
    }
    
    toggleArchiveView() {
        if(this._isShowActive) {            
            this._toDoListCreateTask.remove();
            this._toDoListShowArchive.remove();
            this._toDoListHeader.textContent = HEADER_TEXT_ARCHIVE;
            this._isShowActive = false;
        } else {
            this._toDoListShowActive.remove();            
            this._toDoActionBar.appendChild(this._toDoListCreateTask);
            this._toDoActionBar.appendChild(this._toDoListShowArchive);
            this._toDoActionBar.appendChild(this._toDoListShowActive);
            this._toDoListHeader.textContent = HEADER_TEXT_NORMAL;
            this._isShowActive = true;
        }
        this._toDoListShowActive.classList.toggle('hidden');        
    }

    isArchiveScreen() {
        if(!this._isShowActive) return true;
        return false;
    }

    addHandlerShowActiveList(handler) {
        this._toDoListShowActive.addEventListener('click', function(evt) {
            evt.preventDefault();            
            handler();
        })
    }
}

export default new ArchiveView();