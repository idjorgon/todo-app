import { test, expect } from '@playwright/test';

test.describe('Todo App E2E Tests', () => {
  const testUsername = 'e2etest' + Date.now();
  const testEmail = `e2etest${Date.now()}@test.com`;
  const testPassword = 'password123';

  test('complete user flow: register, create todo, update, delete', async ({ page }) => {
    // Navigate to app
    await page.goto('/');

    // Should redirect to login
    await expect(page).toHaveURL('/login');

    // Click register link
    await page.click('text=Register');
    await expect(page).toHaveURL('/register');

    // Fill registration form
    await page.fill('#username', testUsername);
    await page.fill('#email', testEmail);
    await page.fill('#password', testPassword);
    await page.fill('#confirmPassword', testPassword);
    await page.click('button[type="submit"]');

    // Should redirect to todos page
    await expect(page).toHaveURL('/todos');
    await expect(page.locator('h1')).toContainText('My Todos');

    // Create a new todo
    await page.click('text=Add New Todo');
    await page.fill('#title', 'E2E Test Todo');
    await page.fill('#description', 'This is an E2E test');
    await page.selectOption('#priority', 'HIGH');
    await page.click('button:has-text("Create Todo")');

    // Verify todo was created
    await expect(page.locator('text=E2E Test Todo')).toBeVisible();
    await expect(page.locator('text=This is an E2E test')).toBeVisible();
    await expect(page.locator('text=HIGH')).toBeVisible();

    // Mark todo as complete
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.click();
    await page.waitForTimeout(500); // Wait for update

    // Edit todo
    await page.click('button:has-text("Edit")');
    await page.fill('#title', 'Updated E2E Todo');
    await page.click('button:has-text("Update Todo")');

    // Verify update
    await expect(page.locator('text=Updated E2E Todo')).toBeVisible();

    // Delete todo
    page.on('dialog', dialog => dialog.accept());
    await page.click('button:has-text("Delete")');
    await page.waitForTimeout(500); // Wait for deletion

    // Verify deletion
    await expect(page.locator('text=Updated E2E Todo')).not.toBeVisible();

    // Logout
    await page.click('text=Logout');
    await expect(page).toHaveURL('/login');
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('#username', 'invaliduser');
    await page.fill('#password', 'wrongpassword');
    
    // Wait for the login request to complete
    await Promise.all([
      page.waitForResponse(response => response.url().includes('/api/auth/login')),
      page.click('button[type="submit"]')
    ]);

    // Should show error message (wait up to 10 seconds)
    await expect(page.locator('.error-message')).toBeVisible({ timeout: 10000 });
  });

  test('protected route redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/todos');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });
});
