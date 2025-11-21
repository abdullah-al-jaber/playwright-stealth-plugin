const current_ua = navigator.userAgent;
utils.replaceProperty(Object.getPrototypeOf(navigator), "userAgent", {
    get: () => opts.navigator_user_agent ||
        current_ua.replace("HeadlessChrome/", "Chrome/"),
});
