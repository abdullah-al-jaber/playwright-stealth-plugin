if (opts.navigator_platform && navigator.platform !== opts.navigator_platform) {
  utils.replaceProperty(Object.getPrototypeOf(navigator), "platform", {
    get: () => opts.navigator_platform,
  });
}
