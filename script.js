const tabs = document.getElementById("tabs");
const newTabBtn = document.getElementById("newTab");
const urlBar = document.getElementById("url");
const iframeContainer = document.getElementById("iframeContainer");

let tabIdCounter = 0;
let currentTab = null;

function createTab(url = "https://www.google.com/webhp?igu=1&gws_rd=ssl") {
  const id = "tab-" + tabIdCounter++;

  // Create tab button
  const tab = document.createElement("div");
  tab.className = "tab";
  tab.dataset.id = id;
  tab.innerHTML = `<span>New Tab</span> <div class='close'>✕ </div>`;
  tabs.appendChild(tab);

  // Create iframe
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.dataset.id = id;
  iframeContainer.appendChild(iframe);

  // Tab click = activate
  tab.addEventListener("click", () => setActiveTab(id));

  // Close button
  tab.querySelector(".close").addEventListener("click", (e) => {
    e.stopPropagation();
    removeTab(id);
  });

  setActiveTab(id);
}

function setActiveTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".iframe-container iframe").forEach(f => f.classList.remove("active"));

  const activeTab = document.querySelector(`.tab[data-id='${id}']`);
  const activeFrame = document.querySelector(`iframe[data-id='${id}']`);
  if (activeTab && activeFrame) {
    activeTab.classList.add("active");
    activeFrame.classList.add("active");
    urlBar.value = activeFrame.src;
    currentTab = id;
  }
}

function removeTab(id) {
  const tab = document.querySelector(`.tab[data-id='${id}']`);
  const frame = document.querySelector(`iframe[data-id='${id}']`);
  if (tab) tab.remove();
  if (frame) frame.remove();

  if (currentTab === id) {
    const remaining = document.querySelector(".tab");
    if (remaining) {
      setActiveTab(remaining.dataset.id);
    } else {
      createTab();
    }
  }
}

function replaceBrowser(url) {
  if (!url.startsWith("http")) {
    url = "https://www.google.com/search?q=" + encodeURIComponent(url);
  }
  document.body.innerHTML = `<iframe src="${url}" style="width:100%;height:100vh;border:none;"></iframe>`;
}

urlBar.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    replaceBrowser(urlBar.value);
  }
});

function reload() {
  const activeFrame = document.querySelector(`iframe[data-id='${currentTab}']`);
  if (activeFrame) activeFrame.src = activeFrame.src;
}

function goBack() {
  const activeFrame = document.querySelector(`iframe[data-id='${currentTab}']`);
  if (activeFrame && activeFrame.contentWindow) activeFrame.contentWindow.history.back();
}

function goForward() {
  const activeFrame = document.querySelector(`iframe[data-id='${currentTab}']`);
  if (activeFrame && activeFrame.contentWindow) activeFrame.contentWindow.history.forward();
}

newTabBtn.addEventListener("click", () => createTab());

// Open first tab by default
createTab();
