from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:5173")

    # 1. Loader (Wait 3s)
    print("Waiting for loader...")
    page.wait_for_timeout(3500)

    # 2. Timeline
    print("On Timeline. Checking title.")
    page.wait_for_selector('text=The A4 Sheet Incident')

    # Go through stories
    # There are 9 stories.
    for i in range(8):
        page.click("button:has-text('Next Chapter')")
        page.wait_for_timeout(600) # Wait for animation

    print("Clicking Start The Game")
    page.wait_for_selector("button:has-text('Start The Game!')")
    page.click("button:has-text('Start The Game!')")

    # 3. Distance Game
    print("On Distance Game. Smashing!")
    page.wait_for_selector('text=Smash the Distance!')

    # Wait for button to be stable and enabled
    page.wait_for_selector("button:has-text('TAP!')", state="visible")
    page.wait_for_timeout(1000) # Extra wait for entrance animation

    # Click 20 times (100 -> 0, 5 per click)
    for i in range(21):
        # We need to click specifically the button.
        # Sometimes rapid clicks fail if element moves.
        # We can use force=True if needed, but better to wait.
        page.click("button:has-text('TAP!')", force=True)
        page.wait_for_timeout(50)

    # Wait for success message
    print("Waiting for success...")
    page.wait_for_selector('text=Together at Last!', timeout=10000)
    page.wait_for_timeout(3000) # Wait for transition (2s delay in code)

    # 4. Quiz
    print("On Quiz.")
    # Q1: Chicken Rice (Index 1)
    page.wait_for_selector('text=What is our absolute favorite food?')
    page.click("button:has-text('Chicken Rice')")
    page.wait_for_timeout(2000) # Wait for feedback + delay

    # Q2: Bet on Carrom (Index 2)
    page.wait_for_selector('text=What do we do on Sundays?')
    page.click("button:has-text('Bet on Carrom')")
    page.wait_for_timeout(2000)

    # Q3: Delhi (Index 2)
    page.wait_for_selector('text=Where did we live together for 30 days?')
    page.click("button:has-text('Delhi')")
    page.wait_for_timeout(2000)

    # Q4: Niyas (Index 1)
    page.wait_for_selector('text=Who talks more in the relationship?')
    page.click("button:has-text('Niyas')")
    page.wait_for_timeout(2000)

    # 5. Love Generator
    print("On Love Generator.")
    page.wait_for_selector('text=Why I Love You')
    page.click("button:has-text('Tell Me Why')")
    page.wait_for_timeout(500)

    for _ in range(3):
        page.click("button:has-text('Another Reason')")
        page.wait_for_timeout(500)

    print("Clicking Finale Button")
    page.wait_for_selector("button:has-text('Is that all? (Go to Finale)')")
    page.click("button:has-text('Is that all? (Go to Finale)')")

    # 6. Finale
    print("On Finale.")
    page.wait_for_selector('text=Happy Anniversary & Valentine\'s!')
    page.wait_for_timeout(1000) # Wait for hearts

    # Take screenshot
    page.screenshot(path="verification/verification.png")
    print("Screenshot saved.")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
