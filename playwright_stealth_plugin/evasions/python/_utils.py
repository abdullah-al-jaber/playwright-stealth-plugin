import os
import sys
import logging

# onPageCreated beforeLaunch beforeConnect getDefaults
logger = logging.getLogger("playwright_stealth_plugin")


def read_script(script_path: str) -> str:
    with open(script_path, "r") as script:
        return script.read()
