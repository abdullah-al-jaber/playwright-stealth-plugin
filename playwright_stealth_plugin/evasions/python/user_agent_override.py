import playwright_stealth_plugin.evasions.python._utils as _utils


async def run():
    script = _utils.read_script(f"../javascript/{__name__.split('.')[-1]}.js")
    _utils.scripts.append(script)
    _utils.options["context"]["locale"] = "en-US,en"
    _utils.logger.info(f"RUN: {__name__}")
