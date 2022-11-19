'use strict';

const toDoListStorage = {
  get: (cb) => {
    chrome.storage.local.get(['todo'], (result) => {
      cb(result.todo);
    });
  },
  set: (value, cb) => {
    chrome.storage.local.set(
      {
        todo: value,
      },
      () => { cb() }
    );
  },
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SAVE_TO_DO_ITEMS') {
    const toDoItems = request.payload.toDoItems
    toDoListStorage.set(toDoItems, () => {
        sendResponse({toDoItems});
    });
    return true
  }

  if(request.type === 'FETCH_TO_DO_LIST') {
    toDoListStorage.get((todo) => {
      sendResponse({items: todo});
    });
    return true
  }
});
