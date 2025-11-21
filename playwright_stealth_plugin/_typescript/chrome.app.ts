if (!(window as any).chrome) {
  Object.defineProperty(window, "chrome", {
    writable: true,
    enumerable: true,
    configurable: false,
    value: {},
  });
}

if (!("app" in (window as any).chrome)) {
  const makeError = {
    ErrorInInvocation: (fn: string) =>
      utils.stripErrorWithAnchor(
        new TypeError(`Error in invocation of app.${fn}()`),
        `at ${fn} (eval at <anonymous>`,
      ),
  };

  const APP_STATIC_DATA = {
    isInstalled: false,
    InstallState: {
      DISABLED: "disabled",
      INSTALLED: "installed",
      NOT_INSTALLED: "not_installed",
    },
    RunningState: {
      CANNOT_RUN: "cannot_run",
      READY_TO_RUN: "ready_to_run",
      RUNNING: "running",
    },
  };

  (window as any).chrome.app = {
    ...APP_STATIC_DATA,
    get isInstalled() {
      return false;
    },
    getDetails() {
      if (arguments.length) throw makeError.ErrorInInvocation("getDetails");
      return null;
    },
    getIsInstalled() {
      if (arguments.length) throw makeError.ErrorInInvocation("getIsInstalled");
      return false;
    },
    runningState() {
      if (arguments.length) throw makeError.ErrorInInvocation("runningState");
      return "cannot_run";
    },
  };

  utils.patchToStringNested((window as any).chrome.app);
}
