import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';

test.describe('User login to Demobank', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  const userId = loginData.userId;
  test('successful login', async ({ page }) => {
    // Arrange
    const userPassword = loginData.userPassword;
    const expectedUserName = 'Jan Demobankowy';

    // Act
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(userId);
    await loginPage.passwordInput.fill(userPassword);
    await loginPage.loginButton.click();

    await page.waitForLoadState('domcontentloaded');

    // Assert
    await expect(page.getByTestId('user-name')).toHaveText(expectedUserName);
  });

  test('unsuccessful login with too short username', async ({ page }) => {
    // Arrange
    const invalidUserId = 'test';
    const errorMessageLogin = 'identyfikator ma min. 8 znaków';
    // Act
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(invalidUserId);
    await loginPage.loginInput.blur();
    await page.waitForLoadState('domcontentloaded');

    // Assert
    await expect(loginPage.loginError).toHaveText(errorMessageLogin);
  });

  test('unsuccessful login with too short password', async ({ page }) => {
    // Arrange
    const invalidPassword = 'test';
    const errorMessagePassword = 'hasło ma min. 8 znaków';

    // Act
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(userId);
    await loginPage.passwordInput.fill(invalidPassword);
    await loginPage.passwordInput.blur();

    await page.waitForLoadState('domcontentloaded');

    // Assert
    await expect(loginPage.passwordError).toHaveText(errorMessagePassword);
  });
});
