const cdp = () => {
  Object.defineProperty(Error, "stackTraceLimit", {
    configurable: false,
    writable: false,
    value: 0,
  });
  Object.defineProperty(Error, "prepareStackTrace", {
    value: () => {},
  });
};
cdp();
window.worker_scripts.push(`(${cdp.toString()})();`);
