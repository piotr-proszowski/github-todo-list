function getBaseUri(comment) {
    const baseUri = comment.baseURI
    const indexOfHash = baseUri.indexOf("#")
    let newUri = baseUri
    if(indexOfHash > 0) {
      newUri = baseUri.substring(0, indexOfHash)
    }
    return newUri
}

function toDto(comment, task) {
  const obj = {};
  const baseUri = getBaseUri(comment)
  obj['id'] = comment.id;
  obj['url'] = `${baseUri}#${comment.id}`;
  obj['content'] = `${task.innerText}`;
  return obj;
}

function retrieveToDoItems(comment) {
  return [...comment.getElementsByClassName("task-list-item")]
    .map((task) => toDto(comment, task));
}

function getToDoItems() {
  return [...document.getElementsByClassName("unminimized-comment")]
    .filter(comment => comment.getElementsByClassName("task-list-item").length > 0)
    .filter(comment => comment.querySelector("input:checked") == null)
    .flatMap(comment => retrieveToDoItems(comment));
}

function removeTask(task) {
  const commentWithDesiredTask = [...document.getElementsByClassName("unminimized-comment")]
    .filter(comment => comment.id == task.id)[0]

  const desiredTask =
    [...commentWithDesiredTask.getElementsByClassName("task-list-item")]
      .filter((it) => it.innerText == task.content)[0]
      .getElementsByClassName("task-list-item-checkbox")[0]
  desiredTask.click()
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.type === 'LOAD_TO_DO_ITEMS') {
    const toDoItems = getToDoItems()
    sendResponse({items: toDoItems})
  }
  if(request.type === 'TOGGLE_TODO_TASK') {
    removeTask(request.payload.task)
    sendResponse({})
    return true
  }
});
