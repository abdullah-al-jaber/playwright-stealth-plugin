if (navigator.webdriver == true) {
    Object.defineProperty(Object.getPrototypeOf(navigator), "webdriver", {
        ...Object.getOwnPropertyDescriptors(Object.getPrototypeOf(navigator)),
        get: new Proxy(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(navigator), "webdriver").get, {
            apply: (target, thisArg, args) => {
                Reflect.apply(target, thisArg, args);
                return false;
            },
        }),
    });
}
