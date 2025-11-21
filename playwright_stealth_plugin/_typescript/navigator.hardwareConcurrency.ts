utils.replaceProperty(Object.getPrototypeOf(navigator), "hardwareConcurrency", {
  get: () => 4,
});
