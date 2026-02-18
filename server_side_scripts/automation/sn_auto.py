import os
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright

load_dotenv()

class ServiceNowAutomation:
    def __init__(self):
        # Configuration from .env
        self.url = os.getenv("SN_URL")
        self.username = os.getenv("SN_USERNAME")
        self.password = os.getenv("SN_PASSWORD")
        self.auth_file = "auth.json"
        
        # Playwright objects
        self.playwright = None
        self.browser = None
        self.context = None
        self.page = None

    def start(self):
        """Initializes the browser and tries to resume or start a session."""
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(headless=False)
        self.establish_session()

    def establish_session(self):
        """Handles the logic of loading a saved session or logging in fresh."""
        if os.path.exists(self.auth_file):
            print("Attempting to reuse existing session...")
            self.context = self.browser.new_context(storage_state=self.auth_file)
            self.page = self.context.new_page()
            
            if not self.is_session_valid():
                print("Session invalid or expired. Performing fresh login...")
                self.login()
            else:
                print("Session validated successfully.")
        else:
            print("No saved session found. Logging in...")
            self.context = self.browser.new_context()
            self.page = self.context.new_page()
            self.login()

    def is_session_valid(self):
        """Checks if the current session is actually logged into ServiceNow."""
        try:
            # Navigate to a known protected page (like the home page)
            self.page.goto(self.url, wait_until="networkidle")
            
            # 1. Check if we were redirected to a login page
            if "login.do" in self.page.url or "external_login_auth" in self.page.url:
                return False
                
            # 2. Check for UI element only visible when logged in (User profile icon)
            # Selector may vary slightly by SN version (e.g., 'button#user_info_dropdown')
            user_icon = self.page.locator(".user-name, #user_info_dropdown")
            return user_icon.is_visible(timeout=5000)
        except Exception:
            return False

    def login(self):
        """Performs the login steps and saves the state to disk."""
        self.page.goto(self.url)
        
        # Fill credentials
        self.page.fill("input#user_name", self.username)
        self.page.fill("input#user_password", self.password)
        self.page.click("button#sysverb_login")
        
        # Wait for home page to load
        self.page.wait_for_load_state("networkidle")
        
        # Save state for future re-runs
        self.context.storage_state(path=self.auth_file)
        print(f"Login successful. Session saved to {self.auth_file}")

    def run_tasks(self):
        """Placeholder for your automation logic."""
        print(f"Current Page Title: {self.page.title()}")
        # Add your ServiceNow interactions here...

    def stop(self):
        """Clean up and close the browser."""
        self.browser.close()
        self.playwright.stop()

# Usage
if __name__ == "__main__":
    sn = ServiceNowAutomation()
    sn.start()
    sn.run_tasks()
    # sn.stop() # Keep open to see result
