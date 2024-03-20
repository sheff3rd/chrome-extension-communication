document.getElementById("action").addEventListener("click", async function () {
  const message = document.getElementById("message").value;

  const tab = await getActiveTab();
  await injectScript(tab, message);
});

async function getActiveTab() {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tabs[0];
}

async function fetchPrivateKey() {
  let privateKey;

  await fetch("http://localhost:3000/api/privateKey")
    .then((response) => response.json())
    .then((data) => {
      privateKey = data.privateKey;
    })
    .catch((error) => console.error("Error fetching private key:", error));

  return privateKey;
}

async function injectScript(tab, message) {
  const PRIVATE_KEY = await fetchPrivateKey();

  const privateKey = await window.importPrivateKey(PRIVATE_KEY);
  const signature = await window.signMessage(privateKey, message);

  return chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    func: (signature, message) => {
      window.postMessage(
        { source: "secure-communication-extension", signature, message },
        "*"
      );
    },
    args: [signature, message],
  });
}
