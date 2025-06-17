import { expect, test } from '@playwright/test';


//beforeEach hook to navigate to the Forms page that will be executed before each test in the suite
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByText('Forms').click();
  await page.getByText('Form Layouts').click();
});

test('locatorsyntax rules', async ({ page }) => {

  // by Tag Name
  await page.locator('input').first().click();

  // pause the test to inspect the page
  // await page.pause();

  // by ID
  page.locator('#inputEmail1')

  // by Class value
  page.locator('.shape-rectangle')

  // by attribute
  page.locator('[placeholder="Email"]')

  // by Class value (full)
  page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

  // combine different selectors
  page.locator('input[placeholder="Email"]')

  // by XPath (not recommended)
  page.locator('//input[@placeholder="Email"]')

  // by partial text match
  page.locator(':text("Using")')

  // by exact text match
  page.locator(':text("Using the Grid")')

});

test('user facing locators', async ({ page }) => {

  await page.getByRole('textbox', { name: "Email" }).first().click();
  await page.getByRole('button', { name: "Sign in" }).first().click();

  await page.getByLabel('Email').first().click();

  await page.getByPlaceholder('Jane Doe').first().click();

  await page.getByText('Using the Grid').first().click();

  await page.getByTestId('SingIn').click();

  //  await page.getByTitle ('IoT Dashboard').first().click();

})

test('locating child elements', async ({ page }) => {

  await page.locator('nb-card nb-radio :text-is("Option 1")').click()
  await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

  await page.locator('nb-card').getByRole('button', { name: 'Sign in' }).first().click()

  // not the best way to do it, but works
  await page.locator('nb-card').nth(4).getByRole('button').click()

})

test('locating parent elements', async ({ page }) => {
  await page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" }).click()
  await page.locator('nb-card', { has: page.locator('#inputEmail1') }).getByRole('textbox', { name: "Email" }).click()

  // benefit of filter is that it can be used with any locator narrowing down the search to the elements that match the filter
  await page.locator('nb-card').filter({ hasText: "Basic form" }).getByRole('textbox', { name: "Email" }).click()
  await page.locator('nb-card').filter({ has: page.locator('.status-danger') }).getByRole('textbox', { name: 'Password' }).click()

  await page.locator('nb-card').filter({ has: page.locator('nb-checkbox') }).filter({ hasText: "Sign in" }).getByRole('textbox', { name: "Email" }).click()

  // not recommended, but works one level up
  await page.locator(':text("Using the Grid")').locator('..').getByRole('textbox', { name: "Email" }).click()

})

test('reusing Locators', async ({ page }) => {

  const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" })
  const emailField = basicForm.getByRole('textbox', { name: "Email" })

  await emailField.fill('test@test.com')
  await basicForm.getByRole('textbox', { name: "Password" }).fill('Welcome123')
  await basicForm.locator('nb-checkbox').click()
  await basicForm.getByRole('button').click()

  await expect(emailField).toHaveValue('test@test.com')
})

test('extracting Values', async ({ page }) => {
  //single text value
  const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" })
  const buttonText = await basicForm.getByRole('button').textContent();
  expect(buttonText).toEqual("Submit")

  // all text values
  const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
  expect(allRadioButtonsLabels).toContain("Option 1")

  // input value
  const emailField = basicForm.getByRole('textbox', { name: "Email" })
  await emailField.fill('test@test.com')

  // inputValue method is used to get the value of an input field
  const emailValue = await emailField.inputValue();
  expect(emailValue).toEqual('test@test.com')

  // get the value of the input field using the getAttribute method
  const placeholderValue = await emailField.getAttribute('placeholder');
  expect(placeholderValue).toEqual('Email');
})

test.describe('suite1', () => {

  test('The first test', async ({ page }) => {
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
  })

  test('Navigate to datepicker page', async ({ page }) => {
    await page.getByText('Datepicker').click();
  })

})

test('assertions', async ({ page }) => {

  const basicFormButton = page.locator('nb-card').filter({ hasText: "Basic form" }).locator('button');

  //General  assertions
  const value = 5
  expect(value).toEqual(5)

  const text = await basicFormButton.textContent();
  expect(text).toEqual('Submit');

  // Locator assertions
  await expect(basicFormButton).toHaveText('Submit');

  //Soft assertions
  await expect.soft(basicFormButton).toHaveText('Submit123');
  await basicFormButton.click();

})

test.describe('suite1', () => {

  test.beforeEach(async ({ page }) => {
    await page.getByText('Form').click();
  })

  test('The first test 1', async ({ page }) => {
    await page.getByText('Forms Layout').click();
  })

  test('Navigate to datepicker page 1', async ({ page }) => {
    await page.getByText('Datepicker').click();
  })

})