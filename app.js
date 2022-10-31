const fs = require('fs');
const fsp = require('fs').promises;
const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const exp = require('constants');

const port = process.env.PORT || 3009;
const app = express();

app.use(express.static(__dirname));

let server = http.createServer(app);
let io = socketIO(server);
let toDoListData = {};
let toDoListArchiveData = [];

const blankFile = '{ "lastID": "A00000", "assignedTasks": [] }';


// Read data from to list data file
let fileData = fs.readFileSync(`${__dirname}/toDoList.json`, err => {    
});
let archiveData = fs.readFileSync(`${__dirname}/toDoListArchive.json`, err => {});


try {
    toDoListData = JSON.parse(fileData);
} catch(e) {
    toDoListData = JSON.parse(blankFile);
}

// Populate existing archived tasks
try {
    toDoListArchiveData = JSON.parse(archiveData);
} catch(e) {
    toDoListArchiveData = [];
}

// Initial get request to server
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

const retrieveToDoList = async function(socket, updatedData) {
    await fsp.writeFile(`${__dirname}/toDoList.json`, JSON.stringify(updatedData), err => {
        if (err !== null) {
            socket.emit('errorUpdate', `Error occurred: ${err}`);
        }
    });       

    fileData = await fsp.readFile(`${__dirname}/toDoList.json`, err => {
            console.log('Error 😒' + err);
    });        

    toDoListData = JSON.parse(fileData);    
}

const retrieveToDoListArchive = async function(socket, archiveData) {
    await fsp.writeFile(`${__dirname}/toDoListArchive.json`, JSON.stringify(archiveData), err => {
        if(err !== null) {
            socket.emit('errorUpdate', `Error occurred: ${err}`);
        }
    });

    archiveData = await fsp.readFile(`${__dirname}/toDoListArchive.json`, err => {
        console.log('Error 😒' + err);
    });    
    toDoListArchiveData = JSON.parse(archiveData);
}

// Make connection with the user from server side
io.on('connection', (socket) => {
    socket.on('getInitialData', (reqData) => {        
        socket.emit('initialData', JSON.stringify(toDoListData));
    });   

    socket.on('updateToDoList', (updatedData) => {                
        retrieveToDoList(socket, updatedData);
    });

    socket.on('updateToDoListArchive', (archData) => {        
        retrieveToDoListArchive(socket, archData);
    });

    socket.on('getToDoListArchive', (archData) => {          
        socket.emit('toDoListArchive', JSON.stringify(toDoListArchiveData));
    });

});

server.listen(port, ()=> {
    console.log(`Server listening on port ${port}...`);
});