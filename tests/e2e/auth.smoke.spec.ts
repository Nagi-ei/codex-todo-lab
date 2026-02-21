import { expect, test } from "@playwright/test";

test("@smoke auth signup then login success", async ({ page }) => {
  const seed = `${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
  const email = `auth_smoke_${seed}@example.com`;
  const password = `Codex!${seed}`;

  await page.goto("/auth");

  await page.getByRole("tab", { name: "회원가입" }).click();
  await page.locator("#signup-email").fill(email);
  await page.locator("#signup-password").fill(password);
  await page.getByRole("button", { name: "회원가입" }).click();

  await expect(page).toHaveURL(/\/(auth\/check-email|todos)$/);

  if (page.url().endsWith("/todos")) {
    await page.getByRole("button", { name: "로그아웃" }).click();
    await expect(page).toHaveURL(/\/auth$/);
  }

  if (page.url().endsWith("/auth/check-email")) {
    await page.getByRole("link", { name: "인증으로 이동" }).click();
    await expect(page).toHaveURL(/\/auth$/);
  }

  await page.getByRole("tab", { name: "로그인" }).click();
  await page.locator("#login-email").fill(email);
  await page.locator("#login-password").fill(password);
  await page.getByRole("button", { name: "로그인" }).click();

  await expect(page).toHaveURL(/\/todos$/);
  await expect(page.getByRole("heading", { name: "Todos" })).toBeVisible();
});
