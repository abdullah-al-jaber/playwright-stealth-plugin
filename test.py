import playwright.sync_api
import playwright_stealth_plugin._python.sync_api

with playwright.sync_api.sync_playwright() as p:
    playwright_stealth_plugin._python.sync_api.apply(p)
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto("https://bot.sannysoft.com/")
    print(page.title())
    input("Press Enter to close the browser...")
    browser.close()