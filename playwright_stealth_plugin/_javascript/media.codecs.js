const parseInput = (arg) => {
    const [mime, codecStr] = arg.trim().split(";");
    let codecs = [];
    if (codecStr && codecStr.includes(`codecs="`)) {
        codecs = codecStr
            .trim()
            .replace(`codecs="`, "")
            .replace(`"`, "")
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean);
    }
    return { mime, codecStr, codecs };
};
const canPlayType = {
    apply(target, ctx, args) {
        if (!args?.length)
            return target.apply(ctx, args);
        const { mime, codecs } = parseInput(args[0]);
        if (mime === "video/mp4" && codecs.includes("avc1.42E01E")) {
            return "probably";
        }
        if (mime === "audio/x-m4a" && !codecs.length) {
            return "maybe";
        }
        if (mime === "audio/aac" && !codecs.length) {
            return "probably";
        }
        return target.apply(ctx, args);
    },
};
utils.replaceWithProxy(HTMLMediaElement.prototype, "canPlayType", canPlayType);
