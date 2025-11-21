if (!(window as any).chrome) {
  Object.defineProperty(window, "chrome", {
    writable: true,
    enumerable: true,
    configurable: false,
    value: {},
  });
}

if ("loadTimes" in (window as any).chrome) {
  console.warn("skipping chrome loadTimes update, running in headful mode");
}

if (window.performance?.timing || window.PerformancePaintTiming) {
  const { performance } = window;
  const ntEntryFallback = { nextHopProtocol: "h2", type: "other" };

  const protocolInfo = {
    get connectionInfo() {
      const ntEntry =
        performance.getEntriesByType("navigation")[0] || ntEntryFallback;
      return (ntEntry as any).nextHopProtocol;
    },
    get npnNegotiatedProtocol() {
      const ntEntry =
        performance.getEntriesByType("navigation")[0] || ntEntryFallback;
      return ["h2", "hq"].includes((ntEntry as any).nextHopProtocol)
        ? (ntEntry as any).nextHopProtocol
        : "unknown";
    },
    get navigationType() {
      const ntEntry =
        performance.getEntriesByType("navigation")[0] || ntEntryFallback;
      return (ntEntry as any).type;
    },
    get wasAlternateProtocolAvailable() {
      return false;
    },
    get wasFetchedViaSpdy() {
      const ntEntry =
        performance.getEntriesByType("navigation")[0] || ntEntryFallback;
      return ["h2", "hq"].includes((ntEntry as any).nextHopProtocol);
    },
    get wasNpnNegotiated() {
      const ntEntry =
        performance.getEntriesByType("navigation")[0] || ntEntryFallback;
      return ["h2", "hq"].includes((ntEntry as any).nextHopProtocol);
    },
  };

  const { timing } = performance;

  function toFixed(num: number, fixed: number) {
    const re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
    return num.toString().match(re)![0];
  }

  const timingInfo = {
    get firstPaintAfterLoadTime() {
      return 0;
    },
    get requestTime() {
      return timing.navigationStart / 1000;
    },
    get startLoadTime() {
      return timing.navigationStart / 1000;
    },
    get commitLoadTime() {
      return timing.responseStart / 1000;
    },
    get finishDocumentLoadTime() {
      return timing.domContentLoadedEventEnd / 1000;
    },
    get finishLoadTime() {
      return timing.loadEventEnd / 1000;
    },
    get firstPaintTime() {
      const fpEntry = performance.getEntriesByType("paint")[0] || {
        startTime: timing.loadEventEnd / 1000,
      };
      return toFixed((fpEntry.startTime + performance.timeOrigin) / 1000, 3);
    },
  };

  (window as any).chrome.loadTimes = function () {
    return {
      ...protocolInfo,
      ...timingInfo,
    };
  };

  utils.patchToString((window as any).chrome.loadTimes);
}
