'use strict';

import './popup.css';

(function () {

  const utils = {};
  (function(context) {

     context.createEl = function(o) {

        // get the type and create an element with it
        let type = o.type || 'div';
        let el = document.createElement(type);

         // assign properties
         for (const key of (Object.keys(o))) {
            if (key != 'attrs' && key != 'type') {
              el[key] = o[key];
            }
         }
         if (o.attrs) {
              // assign attributes
               for (let key of (Object.keys(o.attrs))) {

                  // grab the value of this attribute
                  let value = o.attrs[key];

                  // convert attribute key from camel case to dash syntax
                  if (key != key.toLowerCase()) {
                     key = key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
                  }
                  // set the attribute on the element
                  el.setAttribute(key, value);
              }
         }
         return el;
     };
  })(utils);

  function scrollToComment(newUrl) {
    const query = { active: true, currentWindow: true };
      chrome.tabs.query(query, ([tab]) => {
        if(tab.url != newUrl) {
          console.log(tab.url)
          console.log(tab)
          chrome.tabs.update(tab.id, {url: newUrl})
        }
      });
  }

  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
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
            const listItem =
              utils.createEl({
                 type: 'li',
                 innerHTML: `
                  <label class="hvr-underline-reveal">
                    <div class="todo_element">
                      <span class="customized_check">
                        <span class="checkbox">
                          <span class="internal_one"></span>
                          <span class="internal_two"></span>
                        </span>
                      </span>
                      <span class="element_title">${item.content}</span>
                    </div>
                  </label>
                 `
            })

            const checkbox = listItem.getElementsByClassName("checkbox")[0]
            const elementTitle = listItem.getElementsByClassName("element_title")[0]

            toDoList.appendChild(listItem);

            listItem.addEventListener("click", () => { scrollToComment(item.url)});
            checkbox.addEventListener("click", () => {
              elementTitle.classList.toggle("done-crossed-out");
              checkbox.classList.toggle("done");
            });
          });
        });
    });
})();
