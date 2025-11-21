if (!(window as any).chrome) {
  Object.defineProperty(window, "chrome", {
    writable: true,
    enumerable: true,
    configurable: false,
    value: {},
  });
}

if (!("csi" in (window as any).chrome) && (window as any).performance?.timing) {
  const { timing } = (window as any).performance;

  (window as any).chrome.csi = function () {
    return {
      onloadT: timing.domContentLoadedEventEnd,
      startE: timing.navigationStart,
      pageT: Date.now() - timing.navigationStart,
      tran: 15,
    };
  };

  utils.patchToString((window as any).chrome.csi);
}
