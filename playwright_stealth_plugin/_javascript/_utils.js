const worker_scripts = [];
const sync_fetch = (url) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    if (xhr.status !== 200)
        throw new Error("Response isn't valid !");
    return xhr.responseText;
};
const original_Worker = window.Worker;
const custom_Worker = (scriptURL, options) => {
    const url = typeof scriptURL == "string" ? scriptURL : scriptURL.href;
    const code = sync_fetch(url);
    const blob = new Blob([...worker_scripts, code], { type: "application/javascript" });
    return new original_Worker(URL.createObjectURL(blob));
};
window.Worker = custom_Worker;
window.worker_scripts = worker_scripts;
console.log("Hello, World !");
// export {};
