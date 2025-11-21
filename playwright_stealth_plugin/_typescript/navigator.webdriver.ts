if (navigator.webdriver) {
  utils.replaceProperty(Object.getPrototypeOf(navigator), "webdriver", {
    get: new Proxy(
      Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(navigator),
        "webdriver",
      )!.get!,
      {
        apply: (target, thisArg, args) => {
          Reflect.apply(target, thisArg, args);
          return false;
        },
      },
    ),
  });
}
