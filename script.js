const tabs = document.getElementById("tabs");
const newTabBtn = document.getElementById("newTab");
const urlBar = document.getElementById("url");
const iframeContainer = document.getElementById("iframeContainer");

let tabIdCounter = 0;
let currentTab = null;

// List of sites we do NOT embed (will open directly in browser)
const blockedSites = ["google.com", "youtube.com"];

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
  // Ensure proper protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  const isBlocked = blockedSites.some(site => url.includes(site));
  if (isBlocked) {
    // Open blocked sites directly
    window.location.href = url;
    return;
  }

  // Embed allowed sites in iframe
  const activeFrame = document.querySelector(`iframe[data-id='${currentTab}']`);
  if (activeFrame) activeFrame.src = url;
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
