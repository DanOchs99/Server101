const url = "http://localhost:3000/todos";

const addTask = document.getElementById('addTask');
const taskTextbox = document.getElementById('taskTextbox');
const priorityCheckbox = document.getElementById('priorityCheckbox');
const tasks = document.getElementById('tasks');
const completed = document.getElementById('completed');
const instructionsButton = document.getElementById('instructionsButton');
const instructions = document.getElementById('instructions');

function getList() {
    fetch(url).then(response => response.json()).then(json => {
        updateUI(json);
    });
}

function updateUI(json) {
    listHTML = ['<h2>Tasks</h2>'];
    for (let i=0; i<json.length; i++) {
        if (json[i].priority == 0) {
            priority = 'Low';
        }
        else if (json[i].priority == 1) {
            priority = 'High';
        }
        else {
            priority = 'Unknown';
        }
        itemHTML = `<div class="listElement">
                      <label class="titleElement" id="${json[i].dateCreated}">${json[i].title}</label>
                      <label class="priorityElement">(${priority})</label>
                      <label class="deleteItem" onmouseover="showDel(event);" onmouseout="hideDel(event);" onclick="delItem(event);">X</label>
                    </div><br>`;
        listHTML.push(itemHTML);
    }
    tasks.innerHTML = listHTML.join(' ');
}

addTask.addEventListener('click',() => {
    if (priorityCheckbox.checked) {
        priority = 1;
    }
    else
    {
        priority = 0;
    }
    item = {title: taskTextbox.value, priority: priority}
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    }).then(response => response.json()).then(json => {
       updateUI(json);
       taskTextbox.value = '';
       priorityCheckbox.checked = false;
    });
});

function showDel(ev) {
    elDel = ev.target;
    elDel.style.color = 'red';
}

function hideDel(ev) {
    elDel = ev.target;
    elDel.style.color = 'white';
}

function delItem(ev) {
    console.log('user clicked delete!');
}

instructionsButton.addEventListener('click',(ev) => {
    if (ev.target.innerHTML == 'Show Directions') {
        ev.target.innerHTML = 'Hide Directions';
        instructions.style.display = 'flex';
    }
    else
    {
        ev.target.innerHTML = 'Show Directions';
        instructions.style.display = 'none';
    }
});

getList();

