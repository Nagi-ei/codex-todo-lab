import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function returnToAuthLanding(page: Page) {
  if (page.url().endsWith("/todos")) {
    await page.getByRole("button", { name: "로그아웃" }).click();
    await expect(page).toHaveURL(/\/auth$/);
    return;
  }

  if (page.url().endsWith("/auth/check-email")) {
    await page.getByRole("link", { name: "인증으로 이동" }).click();
    await expect(page).toHaveURL(/\/auth$/);
  }
}

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
  await returnToAuthLanding(page);

  await page.getByRole("tab", { name: "로그인" }).click();
  await page.locator("#login-email").fill(email);
  await page.locator("#login-password").fill(password);
  await page.getByRole("button", { name: "로그인" }).click();

  await expect(page).toHaveURL(/\/todos$/);
  await expect(page.getByRole("heading", { name: "Todos" })).toBeVisible();
});

test("@smoke auth wrong password shows toast", async ({ page }) => {
  const seed = `${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
  const email = `auth_wrong_password_${seed}@example.com`;
  const password = `Codex!${seed}`;

  await page.goto("/auth");

  await page.getByRole("tab", { name: "회원가입" }).click();
  await page.locator("#signup-email").fill(email);
  await page.locator("#signup-password").fill(password);
  await page.getByRole("button", { name: "회원가입" }).click();
  await expect(page).toHaveURL(/\/(auth\/check-email|todos)$/);
  await returnToAuthLanding(page);

  await page.getByRole("tab", { name: "로그인" }).click();
  await page.locator("#login-email").fill(email);
  await page.locator("#login-password").fill(`${password}wrong`);
  await page.getByRole("button", { name: "로그인" }).click();

  await expect(page).toHaveURL(/\/auth$/);
  await expect(
    page.getByText("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해 주세요."),
  ).toBeVisible();
});

test("@smoke auth duplicate signup is handled safely", async ({ page }) => {
  const seed = `${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
  const email = `auth_duplicate_${seed}@example.com`;
  const password = `Codex!${seed}`;

  await page.goto("/auth");

  await page.getByRole("tab", { name: "회원가입" }).click();
  await page.locator("#signup-email").fill(email);
  await page.locator("#signup-password").fill(password);
  await page.getByRole("button", { name: "회원가입" }).click();
  await expect(page).toHaveURL(/\/(auth\/check-email|todos)$/);

  await returnToAuthLanding(page);
  await page.getByRole("tab", { name: "회원가입" }).click();
  await page.locator("#signup-email").fill(email);
  await page.locator("#signup-password").fill(password);
  await page.getByRole("button", { name: "회원가입" }).click();

  await expect(page).toHaveURL(/\/(auth|auth\/check-email)$/);

  if (page.url().endsWith("/auth")) {
    await expect(page.getByRole("tab", { name: "로그인" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "회원가입" })).toBeVisible();
    return;
  }

  await expect(page.getByRole("link", { name: "인증으로 이동" })).toBeVisible();
});
