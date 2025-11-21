if (!window.chrome) {
    Object.defineProperty(window, "chrome", {
        writable: true,
        enumerable: true,
        configurable: false,
        value: {},
    });
}
if (!("csi" in window.chrome) && window.performance?.timing) {
    const { timing } = window.performance;
    window.chrome.csi = function () {
        return {
            onloadT: timing.domContentLoadedEventEnd,
            startE: timing.navigationStart,
            pageT: Date.now() - timing.navigationStart,
            tran: 15,
        };
    };
    utils.patchToString(window.chrome.csi);
}
