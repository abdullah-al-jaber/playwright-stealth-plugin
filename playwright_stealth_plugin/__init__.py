import playwright_stealth_plugin._python.async_api as async_api
import playwright_stealth_plugin._python.sync_api as sync_api

async_apply = async_api.apply
sync_apply = sync_api.apply
__all__ = ["async_apply", "sync_apply"]
