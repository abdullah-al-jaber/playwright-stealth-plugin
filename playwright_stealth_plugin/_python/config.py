import os
import sys
import typing

sys.__file__ = os.path.abspath(os.path.join(__file__, ".."))

script_folder = "_javascript"
script_names: typing.List[str] = [
    "opts.js",
    "utils.js",
    "chrome.app.js",
    "chrome.csi.js",
    "chrome.hairline.js",
    "chrome.load.times.js",
    "chrome.runtime.js",
    "error.prototype.js",
    "generate.magic.arrays.js",
    "iframe.contentWindow.js",
    "media.codecs.js",
    "navigator.hardwareConcurrency.js",
    "navigator.languages.js",
    "navigator.permissions.js",
    "navigator.platform.js",
    "navigator.plugins.js",
    "navigator.userAgent.js",
    "navigator.vendor.js",
    "navigator.webdriver.js",
    "webgl.vendor.js",
]

browser_options: typing.Dict[str, typing.Any] = {}
context_options: typing.Dict[str, typing.Any] = {}
