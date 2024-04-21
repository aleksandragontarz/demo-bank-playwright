import { test, expect } from '@playwright/test';

test.describe('User login to Demobank', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Arrange
  const userId = 'test1234';
  const userPassword = 'test1234';
  const expectedUserName = 'Jan Demobankowy';
  const invalidUserId = 'test';
  const errorMessageLogin = 'identyfikator ma min. 8 znaków';
  const invalidPassword = 'test';
  const errorMessagePassword = 'hasło ma min. 8 znaków';
  test('successful login', async ({ page }) => {
    // Act
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(userPassword);
    await page.getByTestId('login-button').click();

    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByTestId('user-name')).toHaveText(expectedUserName);
  });

  test('unsuccessful login with too short username', async ({ page }) => {
    // Act
    await page.getByTestId('login-input').fill(invalidUserId);
    await page.getByTestId('login-input').blur();
    await page.waitForLoadState('domcontentloaded');

    // Assert
    await expect(page.getByTestId('error-login-id')).toHaveText(
      errorMessageLogin,
    );
  });

  test('unsuccessful login with too short password', async ({ page }) => {
    // Act
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(invalidPassword);
    await page.waitForLoadState('domcontentloaded');

    await page.getByTestId('password-input').blur();

    // Assert
    await expect(page.getByTestId('error-login-password')).toHaveText(
      errorMessagePassword,
    );
  });
});
