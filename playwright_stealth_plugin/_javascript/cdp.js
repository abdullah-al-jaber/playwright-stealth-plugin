const cdp = () => {
    Object.defineProperty(Error, "stackTraceLimit", {
        configurable: false,
        writable: false,
        value: 0,
    });
};
window.worker_scripts.push(`(${cdp.toString()})();`);
