import { expect } from '@playwright/test';
import{test} from '../test-options';

test('Drag and drop with iFrame', async ({ page, globalsQaURL }) => {
    await page.goto(globalsQaURL);
    const fram = page.frameLocator('[rel-title="Photo Manager"] iframe');

    await fram.locator('li', { hasText: 'High Tatras 2' }).dragTo(fram.locator('#trash')) // drag the element to the trash

    //more precise control
      await fram.locator('li', { hasText: 'High Tatras 4' }).hover();
      await page.mouse.down();
      await fram.locator('#trash').hover();
      await page.mouse.up();

      await expect(fram.locator('#trash li h5')).toHaveText(['High Tatras 2', 'High Tatras 4']);
})