import {expect, test} from '@playwright/test';

test.beforeEach(async({ page }, testInfo) => {
  await page.goto(process.env.URL);
  await page.getByText('Button Triggering AJAX Request').click();
  testInfo.setTimeout(testInfo.timeout + 2000); // Increase timeout for this test
})

test('auto waiting', async ({ page }) => {

    const sucessButton = page.locator('.bg-success');

    // await sucessButton.click();
    // const text = await sucessButton.textContent();
    // await sucessButton.waitFor({ state: 'attached' });
    // const text = await sucessButton.allTextContents();
    // expect(text).toEqual('Data loaded with AJAX get request.');

    await expect(sucessButton).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 });
});

test.skip('Alternative waits', async ({ page }) => {

    const sucessButton = page.locator('.bg-success');

    // wait for element 
    await page.waitForSelector

    // wait fpr particular response
    await page.waitForResponse('**http://uitestingplayground.com/ajaxdata');

    // wait for network calls to  be completed (NOT RECOMMENDED)
    await page.waitForLoadState('networkidle');

    // await page.waitForURL('**/ajax');


    const text = await sucessButton.allTextContents();
    expect(text).toContain('Data loaded with AJAX get request.');

})

test.skip('Timeouts', async ({ page }) => {
    //test.setTimeout(10000); // Set a timeout for the test to 60 seconds
   test.slow()
    const sucessButton = page.locator('.bg-success');
    await sucessButton.click(); // Set a timeout for the click action to 6 seconds
})  