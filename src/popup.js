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

  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  getCurrentTab()
    .then((tab) => {
      chrome.tabs.sendMessage(
        tab.id,
        {type: 'LOAD_TO_DO_ITEMS', payload: 'example message from popup.js'},
        {},
        (response) => {
          const toDoList = document.getElementById("todo-list");
          const items = response.items;
          items.forEach(item => {
            const listItem = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox"
            checkbox.name = item.content
            listItem.appendChild(checkbox);
            const link = document.createElement("a");
            link.innerText = item.content
            link.setAttribute("href", item.url)
            listItem.appendChild(link);
            toDoList.appendChild(listItem);

            link.addEventListener("click", () => { scrollToComment(item.url)});
          });
        });
    });
})();
