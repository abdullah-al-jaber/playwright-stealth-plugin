## test
import playwright_stealth_plugin
import playwright.async_api

async def test():   
    async with playwright.async_api.async_playwright() as pw:
        await playwright_stealth_plugin.apply(pw)
        browser = await pw.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        await page.goto("https://bot.sannysoft.com")
        await page.wait_for_timeout(100000)
        await browser.close()

def main():
    import asyncio
    print("Starting test...")
    asyncio.run(test())

main()