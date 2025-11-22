import os
import sys
import typing

sys.__file__ = os.path.abspath(os.path.join(__file__, ".."))

script_folder = "_javascript"
script_names: typing.List[str] = []

browser_options: typing.Dict[str, typing.Any] = {}
context_options: typing.Dict[str, typing.Any] = {}
