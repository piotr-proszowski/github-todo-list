function getToDoItems() {
  const toDoItems = [...document.getElementsByClassName("unminimized-comment")]
    .filter(comment => comment.getElementsByClassName("task-list-item").length > 0)
    .filter(comment => comment.querySelector("input:checked") == null)
    .map(comment => {
      const baseUri = comment.baseURI
      const indexOfHash = baseUri.indexOf("#")
      let newUri = baseUri
      if(indexOfHash > 0) {
        newUri = baseUri.substring(0, indexOfHash)
      }
      const obj = {};
      obj['url'] = `${newUri}#${comment.id}`;
      obj['content'] = `${comment.getElementsByClassName("task-list-item")[0].innerText}`;
      return obj;
    });
  return toDoItems
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.type === 'LOAD_TO_DO_ITEMS') {
    const toDoItems = getToDoItems()
    sendResponse({items: toDoItems})
  }
});
