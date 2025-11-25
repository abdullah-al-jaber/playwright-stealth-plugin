const original_navigator = window.navigator;
const custom_navigator = new Proxy(original_navigator, {
    get: (target, property, receiver) => {
        // webdriver
        if (property === "webdriver")
            return false;
        // userAgent
        if (property === "userAgent") {
            let custom_userAgent = original_navigator.userAgent.replace("HeadlessChrome", "Chrome");
            return custom_userAgent;
        }
        // platform
        if (property == "platform")
            return "Win32";
        return Reflect.get(target, property, receiver);
    },
});
Object.defineProperty(window, "original_navigator", {
    value: custom_navigator,
});
