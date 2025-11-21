try {
    const addContentWindowProxy = (iframe) => {
        const contentWindowProxy = {
            get(target, key) {
                if (key === "self")
                    return this;
                if (key === "frameElement")
                    return iframe;
                return Reflect.get(target, key);
            },
        };
        if (!iframe.contentWindow) {
            const proxy = new Proxy(window, contentWindowProxy);
            Object.defineProperty(iframe, "contentWindow", {
                get: () => proxy,
                set: (newValue) => newValue,
                enumerable: true,
                configurable: false,
            });
        }
    };
    const handleIframeCreation = (target, thisArg, args) => {
        const iframe = target.apply(thisArg, args);
        const _iframe = iframe;
        const _srcdoc = _iframe.srcdoc;
        Object.defineProperty(iframe, "srcdoc", {
            configurable: true,
            get: () => _iframe.srcdoc,
            set: function (newValue) {
                addContentWindowProxy(this);
                Object.defineProperty(iframe, "srcdoc", {
                    configurable: false,
                    writable: false,
                    value: _srcdoc,
                });
                _iframe.srcdoc = newValue;
            },
        });
        return iframe;
    };
    const addIframeCreationSniffer = () => {
        const createElementHandler = {
            get(target, key) {
                return Reflect.get(target, key);
            },
            apply(target, thisArg, args) {
                const isIframe = args?.length && `${args[0]}`.toLowerCase() === "iframe";
                return isIframe
                    ? handleIframeCreation(target, thisArg, args)
                    : target.apply(thisArg, args);
            },
        };
        utils.replaceWithProxy(document, "createElement", createElementHandler);
    };
    addIframeCreationSniffer();
}
catch (err) { }
