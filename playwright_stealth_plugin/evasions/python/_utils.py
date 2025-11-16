import os
import sys
import logging

init_scripts = []
logger = logging.getLogger("playwright_stealth_plugin")


def read_script(script_path: str) -> str:
    with open(script_path, "r") as script:
        return script.read()


init_scripts.append(read_script(f"../javascript/_utils.js"))
