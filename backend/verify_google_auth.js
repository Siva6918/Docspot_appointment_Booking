import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Wait for frontend to start
    try {
        await page.goto('http://localhost:5173/login');

        // Check for Google Login Button visibility (id or text containing "Sign in with")
        // Since Google button is in an iframe often, we might check for the wrapper
        // Or simply check if the text "Sign in with Google" is present

        // But more reliably, check if the client ID was picked up.
        // We can grab global config or check network requests.

        // Simple check: Look for the button if it's rendered.
        // The button component returns null if ID is missing.
        await page.waitForLoadState('networkidle');

        const buttonWrapper = await page.locator('div.w-full.flex.justify-center.mt-4');
        const count = await buttonWrapper.count();

        if (count > 0) {
            console.log('Google Login Button Wrapper Found');
            // Check for iframe or actual button elements
            const iframes = page.frames();
            const googleFrame = iframes.find(f => f.url().includes('accounts.google.com'));
            if (googleFrame) {
                console.log('Google Sign-In Iframe Detected');
                console.log('SUCCESS: Google Client ID likely configured correctly.');
            } else {
                console.log('WARNING: Wrapper found but no Google Iframe. Might still be loading or blocked?');
            }

        } else {
            console.log('FAILURE: Google Login Button NOT found. Client ID might be missing or invalid.');
        }

    } catch (err) {
        console.error('Error navigating to login page:', err);
    }

    await browser.close();
})();
