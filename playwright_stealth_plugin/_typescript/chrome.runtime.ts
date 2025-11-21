const STATIC_DATA = {
  OnInstalledReason: {
    CHROME_UPDATE: "chrome_update",
    INSTALL: "install",
    SHARED_MODULE_UPDATE: "shared_module_update",
    UPDATE: "update",
  },
  OnRestartRequiredReason: {
    APP_UPDATE: "app_update",
    OS_UPDATE: "os_update",
    PERIODIC: "periodic",
  },
  PlatformArch: {
    ARM: "arm",
    ARM64: "arm64",
    MIPS: "mips",
    MIPS64: "mips64",
    X86_32: "x86-32",
    X86_64: "x86-64",
  },
  PlatformNaclArch: {
    ARM: "arm",
    MIPS: "mips",
    MIPS64: "mips64",
    X86_32: "x86-32",
    X86_64: "x86-64",
  },
  PlatformOs: {
    ANDROID: "android",
    CROS: "cros",
    LINUX: "linux",
    MAC: "mac",
    OPENBSD: "openbsd",
    WIN: "win",
  },
  RequestUpdateCheckStatus: {
    NO_UPDATE: "no_update",
    THROTTLED: "throttled",
    UPDATE_AVAILABLE: "update_available",
  },
};

if (!(window as any).chrome) {
  Object.defineProperty(window, "chrome", {
    writable: true,
    enumerable: true,
    configurable: false,
    value: {},
  });
}

const existsAlready = "runtime" in (window as any).chrome;
const isNotSecure = !window.location.protocol.startsWith("https");

if (!existsAlready && !isNotSecure) {
  (window as any).chrome.runtime = {
    ...STATIC_DATA,
    get id() {
      return undefined;
    },
    connect: null,
    sendMessage: null,
  };

  const makeCustomRuntimeErrors = (
    preamble: string,
    method: string,
    extensionId?: string,
  ) => ({
    NoMatchingSignature: new TypeError(preamble + `No matching signature.`),
    MustSpecifyExtensionID: new TypeError(
      preamble +
        `${method} called from a webpage must specify an Extension ID (string) for its first argument.`,
    ),
    InvalidExtensionID: new TypeError(
      preamble + `Invalid extension id: '${extensionId}'`,
    ),
  });

  const isValidExtensionID = (str: string) =>
    str.length === 32 && str.toLowerCase().match(/^[a-p]+$/);

  const sendMessageHandler = {
    apply(target: Function, ctx: any, args: any[]) {
      const [extensionId, options, responseCallback] = args || [];
      const errorPreamble = `Error in invocation of runtime.sendMessage(optional string extensionId, any message, optional object options, optional function responseCallback): `;
      const Errors = makeCustomRuntimeErrors(
        errorPreamble,
        `chrome.runtime.sendMessage()`,
        extensionId,
      );

      const noArguments = args.length === 0;
      const tooManyArguments = args.length > 4;
      const incorrectOptions = options && typeof options !== "object";
      const incorrectResponseCallback =
        responseCallback && typeof responseCallback !== "function";

      if (
        noArguments ||
        tooManyArguments ||
        incorrectOptions ||
        incorrectResponseCallback
      )
        throw Errors.NoMatchingSignature;
      if (args.length < 2) throw Errors.MustSpecifyExtensionID;
      if (typeof extensionId !== "string") throw Errors.NoMatchingSignature;
      if (!isValidExtensionID(extensionId)) throw Errors.InvalidExtensionID;

      return undefined;
    },
  };
  utils.mockWithProxy(
    (window as any).chrome.runtime,
    "sendMessage",
    function sendMessage() {},
    sendMessageHandler,
  );

  const connectHandler = {
    apply(target: Function, ctx: any, args: any[]) {
      const [extensionId, connectInfo] = args || [];
      const errorPreamble = `Error in invocation of runtime.connect(optional string extensionId, optional object connectInfo): `;
      const Errors = makeCustomRuntimeErrors(
        errorPreamble,
        `chrome.runtime.connect()`,
        extensionId,
      );

      const noArguments = args.length === 0;
      const emptyStringArgument = args.length === 1 && extensionId === "";
      if (noArguments || emptyStringArgument)
        throw Errors.MustSpecifyExtensionID;

      const tooManyArguments = args.length > 2;
      const incorrectConnectInfoType =
        connectInfo && typeof connectInfo !== "object";
      if (tooManyArguments || incorrectConnectInfoType)
        throw Errors.NoMatchingSignature;

      const extensionIdIsString = typeof extensionId === "string";
      if (extensionIdIsString && extensionId === "")
        throw Errors.MustSpecifyExtensionID;
      if (extensionIdIsString && !isValidExtensionID(extensionId))
        throw Errors.InvalidExtensionID;

      if (typeof extensionId === "object") {
        const ci = extensionId;
        if (args.length > 1) throw Errors.NoMatchingSignature;
        if (Object.keys(ci).length === 0) throw Errors.MustSpecifyExtensionID;
        Object.entries(ci).forEach(([k, v]) => {
          const isExpected = ["name", "includeTlsChannelId"].includes(k);
          if (!isExpected)
            throw new TypeError(errorPreamble + `Unexpected property: '${k}'.`);
          if (k === "name" && typeof v !== "string")
            throw new TypeError(
              errorPreamble +
                `Error at property 'name': Invalid type: expected string, found ${typeof v}.`,
            );
          if (k === "includeTlsChannelId" && typeof v !== "boolean")
            throw new TypeError(
              errorPreamble +
                `Error at property 'includeTlsChannelId': Invalid type: expected boolean, found ${typeof v}.`,
            );
        });
        throw Errors.MustSpecifyExtensionID;
      }

      return utils.patchToStringNested(makeConnectResponse());
    },
  };
  utils.mockWithProxy(
    (window as any).chrome.runtime,
    "connect",
    function connect() {},
    connectHandler,
  );

  function makeConnectResponse() {
    const onSomething = () => ({
      addListener() {},
      dispatch() {},
      hasListener() {},
      hasListeners() {
        return false;
      },
      removeListener() {},
    });

    return {
      name: "",
      sender: undefined,
      disconnect() {},
      onDisconnect: onSomething(),
      onMessage: onSomething(),
      postMessage() {
        if (!arguments.length)
          throw new TypeError(`Insufficient number of arguments.`);
        throw new Error(`Attempting to use a disconnected port object`);
      },
    };
  }
}
