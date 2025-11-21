const elementDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight");
utils.replaceProperty(HTMLDivElement.prototype, "offsetHeight", {
    get() {
        if (this.id === "modernizr")
            return 1;
        return elementDescriptor?.get?.apply(this);
    },
});
