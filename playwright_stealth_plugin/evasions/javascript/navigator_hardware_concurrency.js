utils.replaceGetterWithProxy(
  Object.getPrototypeOf(navigator),
  "hardwareConcurrency",
  utils.makeHandler().getterValue(4)
);
