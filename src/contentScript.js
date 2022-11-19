const toDoItems = [...document.getElementsByClassName("unminimized-comment")]
  .filter(comment => comment.getElementsByClassName("task-list-item").length > 0)
  .map(comment => {
    const obj = {}
    obj['url'] = `${comment.baseURI}#${comment.id}`
    obj['content'] = `${comment.getElementsByClassName("task-list-item")[0].innerText}`
    return obj
  });

chrome.runtime.sendMessage(
  {
    type: 'SAVE_TO_DO_ITEMS',
    payload: {
      toDoItems: toDoItems,
    },
  },
  (response) => {
    console.log(toDoItems)
    console.log(response)
  }
);
