const webgl = () => {
    [WebGLRenderingContext.prototype, WebGL2RenderingContext.prototype].forEach((prototype) => {
        const original_getParameter = prototype.getParameter;
        const custom_getParameter = new Proxy(original_getParameter, {
            apply: (target, ctx, args) => {
                const parameter = args?.[0];
                if (parameter === 37445) return "Intel Inc."; // UNMASKED_VENDOR_WEBGL
                if (parameter === 37446) return "Intel Iris OpenGL Engine"; // UNMASKED_RENDERER_WEBGL
                return Reflect.apply(target, ctx, args);
            },
        });
        prototype.getParameter = custom_getParameter;
    });
};

webgl();
window.worker_scripts.push(`(${webgl.toString()})();`);
console.log("PLAYWRIGHT_STEALTH_PLUGIN: FINISH !");
