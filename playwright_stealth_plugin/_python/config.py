import os
import sys
import typing

sys.__file__ = os.path.abspath(os.path.join(__file__, ".."))

script_folder = "_javascript"
script_names: typing.List[str] = ["_utils.js", "navigator.js", "webgl.js"]

browser_options: typing.Dict[str, typing.Any] = {"args": []}
context_options: typing.Dict[str, typing.Any] = {
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.7390.37 Safari/537.36",
    "viewport": {"width": 1280, "height": 720},
    "device_scale_factor": 1,
    "is_mobile": False,
    "has_touch": False,
    "default_browser_type": "chromium",
}
