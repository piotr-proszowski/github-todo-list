'use strict';

(function () {

  function addElementsToToDoList() {
  }

  function scrollToComment(newUrl) {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, (tab) =>
      chrome.tabs.update(tab.id, {url: newUrl})
    );
  }

  chrome.runtime.sendMessage(
    {
      type: 'FETCH_TO_DO_LIST',
      payload: {},
    },
    (response) => {
      const toDoList = document.getElementById("todo-list");
      const items = response.items;
      items.forEach(item => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.textContent = item.content
        link.setAttribute("href", item.url)
        listItem.appendChild(link);
        toDoList.appendChild(listItem);

        link.addEventListener("click", () => { scrollToComment(item.url)});
      });
    }
  );
})();
