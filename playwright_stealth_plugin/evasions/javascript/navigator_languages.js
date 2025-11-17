const languages = opt.languages || ["en-US", "en"];
utils.replaceGetterWithProxy(
  Object.getPrototypeOf(navigator),
  "languages",
  utils.makeHandler().getterValue(Object.freeze([...languages]))
);
