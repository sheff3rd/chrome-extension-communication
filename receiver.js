window.addEventListener("message", async function (event) {
  if (event.data.source === "secure-communication-extension") {

    const publicKey = await window.importPublicKey(PUBLIC_KEY);
    const isValid = await window.verifyMessage(publicKey, event.data.signature, event.data.message);

    if (!isValid) {
      throw new Error("Invalid signature");
    }

    const li = document.createElement("li");
    li.innerHTML = event.data.message;

    const list = document.getElementById("list");
    list.appendChild(li);
  }
});

const PUBLIC_KEY = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5XHNwfRCFg869GpyvXez+g+/aNhSSWcTdbFjjHJRFxmccQ0G/Xr/V++spwo1VyiEAvxSGKsQbWnWL/w8LqkzntbArduc8oP2geV+S/k9INxKb/qlJtatxzb0IUpNoxKB1mChPNUlQGlxKVVg7LmNOA0jMHEzzMbrdT+ETc92xRnHN26UwnYA7a2FuWrsJvmBbtpTq6twtSqYSsVLoUB4hnLkWCQWPyu1B90eabnGQjqMGJRjc81BAUWsUElUQqQ2lRGb593OLOOfQ+aEZu9Gfq/xGjyG53gAimYjAdaeER2AyfDr/dLN9WEQ4AQPChlCtrR0F/bS6AgvTIPgUp4ZyQIDAQAB`;
