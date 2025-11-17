opts = utils.replaceGetterWithProxy(
  Object.getPrototypeOf(navigator),
  "vendor",
  utils.makeHandler().getterValue("Google Inc.")
);
