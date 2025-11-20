import typing

script_folder = "_javascript"
script_names: typing.List[str] = []

browser_options: typing.Dict[str, typing.Any] = {}
context_options: typing.Dict[str, typing.Any] = {}

import os
import sys
import playwright_stealth_plugin

sys.__file__ = os.path.abspath(playwright_stealth_plugin.__file__)
