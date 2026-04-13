const tabs = M.Tabs.init(document.querySelector('.tabs'));

async function displayTodos(data) {
  let result = document.querySelector('#result');
  result.innerHTML = '';
  let html = '';

  if ("detail" in data) {
    html += `
      <li class="card collection-item col s12 m4">
        <div class="card-content">
          <span class="card-title">Error: ${data.detail}</span>
        </div>
      </li>
    `;
  } else if (data.length === 0) {
    html += `
      <li class="card collection-item col s12 m4">
        <div class="card-content">
          <span class="card-title">No todos yet! Create one above.</span>
        </div>
      </li>
    `;
  } else {
    for (let todo of data) {
      html += `
        <li class="card collection-item col s12 m4">
          <div class="card-content">
            <span class="card-title">${todo.text}
              <label class="right">
                <input type="checkbox" data-id="${todo.id}" onclick="toggleDone(event)" ${todo.done ? 'checked' : ''} />
                <span>Done</span>
              </label>
            </span>
          </div>
          <div class="card-action">
            <a href="#" onclick="deleteTodo('${todo.id}')">DELETE</a>
          </div>
        </li>
      `;
    }
  }

  result.innerHTML = html;
}

async function loadView() {
  let todos = await sendRequest(`${server}/todos`, 'GET');
  displayTodos(todos);
}

loadView();

async function createTodo(event) {
  event.preventDefault();
  let form = event.target.elements;

  let data = {
    text: form['addText'].value,
  }

  event.target.reset();

  let result = await sendRequest(`${server}/todos`, 'POST', data);

  if ('detail' in result) {
    toast('Error: ' + result.detail);
  } else {
    toast('Todo Created!');
  }

  loadView();
}

document.forms['addForm'].addEventListener('submit', createTodo);

async function toggleDone(event) {
  let checkbox = event.target;
  let id = checkbox.dataset['id'];
  let done = checkbox.checked;

  let result = await sendRequest(`${server}/todo/${id}`, 'PUT', {done: done});

  if ('detail' in result) {
    toast('Error: ' + result.detail);
  } else {
    let message = done ? 'Marked Done!' : 'Marked Not Done!';
    toast(message);
  }
  
  loadView();
}

async function deleteTodo(id) {
  let result = await sendRequest(`${server}/todo/${id}`, 'DELETE');
  
  if ('detail' in result) {
    toast('Error: ' + result.detail);
  } else {
    toast('Deleted!');
  }
  
  loadView();
}

function logout() {
  window.localStorage.removeItem('access_token');
  window.location.href = "index.html";
}