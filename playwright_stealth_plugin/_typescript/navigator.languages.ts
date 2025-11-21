if (!utils.arrayEqual(navigator.languages, opts.navigator_languages_override)) {
  utils.replaceProperty(Object.getPrototypeOf(navigator), "languages", {
    get: () => opts.navigator_languages_override,
  });
}
