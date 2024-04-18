import { test, expect } from '@playwright/test';

test.describe('Pulpit tests', () => {
  // Arrange
  const receiverId = '2';
  const transferTitle = 'pizza';
  const transferAmount = '120';
  const expectedTransferReceiver = 'Chuck Demobankowy';

  const url = 'https://demo-bank.vercel.app/';
  const userId = 'test1234';
  const userPassword = 'test1234';
  const receiverNumber = '502 xxx xxx';

  test('quick payment with correct data', async ({ page }) => {
    // Act
    await page.goto(url);
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(userPassword);
    await page.getByTestId('login-button').click();

    await page.waitForLoadState('domcontentloaded');

    await page.locator('#widget_1_transfer_receiver').selectOption(receiverId);
    await page.locator('#widget_1_transfer_amount').fill(transferAmount);
    await page.locator('#widget_1_transfer_title').fill(transferTitle);

    await page.getByRole('button', { name: 'wykonaj' }).click();
    await page.getByTestId('close-button').click();

    // Assert
    await expect(page.locator('#show_messages')).toHaveText(
      `Przelew wykonany! ${expectedTransferReceiver} - ${transferAmount},00PLN - ${transferTitle}`,
    );
  });

  test('successful phone top-up', async ({ page }) => {
    // Act
    await page.goto(url);
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(userPassword);
    await page.getByTestId('login-button').click();

    await page.waitForLoadState('domcontentloaded');

    await page.locator('#widget_1_topup_receiver').selectOption(receiverNumber);
    await page.locator('#widget_1_topup_amount').fill(transferAmount);
    await page.locator('#uniform-widget_1_topup_agreement').check();

    await page.getByRole('button', { name: 'doładuj telefon' }).click();
    await page.getByTestId('close-button').click();

    // Assert
    await expect(page.locator('#user_messages')).toHaveText(
      `Doładowanie wykonane! ${transferAmount},00PLN na numer ${receiverNumber}`,
    );
  });
});
