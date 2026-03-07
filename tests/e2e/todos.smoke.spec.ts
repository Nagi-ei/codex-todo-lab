import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function ensureAuthenticatedOnTodos(page: Page) {
  const seed = `${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
  const email = `todo_smoke_${seed}@example.com`;
  const password = `Codex!${seed}`;

  await page.goto("/auth");

  await page.getByRole("tab", { name: "회원가입" }).click();
  await page.locator("#signup-email").fill(email);
  await page.locator("#signup-password").fill(password);
  await page.getByRole("button", { name: "회원가입" }).click();

  await expect(page).toHaveURL(/\/(auth\/check-email|todos)$/);

  if (page.url().endsWith("/auth/check-email")) {
    await page.getByRole("link", { name: "인증으로 이동" }).click();
    await expect(page).toHaveURL(/\/auth$/);

    await page.getByRole("tab", { name: "로그인" }).click();
    await page.locator("#login-email").fill(email);
    await page.locator("#login-password").fill(password);
    await page.getByRole("button", { name: "로그인" }).click();
  }

  await expect(page).toHaveURL(/\/todos$/);
}

test("@smoke todos crud and filter flow", async ({ page }) => {
  await ensureAuthenticatedOnTodos(page);

  await page.locator("#todo-create-title").fill("첫 할 일");
  await page.getByRole("button", { name: "추가" }).click();

  await expect(page.getByText("첫 할 일")).toBeVisible();

  await page.getByRole("link", { name: "진행중" }).click();
  await expect(page.getByText("첫 할 일")).toBeVisible();

  await page.getByLabel("첫 할 일 완료 상태 토글").click();

  await page.getByRole("link", { name: "완료" }).click();
  await expect(page.getByText("첫 할 일")).toBeVisible();

  await page.getByRole("button", { name: "수정" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const dialogInput = dialog.locator('[id^="todo-edit-title-"]');
  await expect(dialogInput).toBeVisible();
  await dialogInput.fill("수정된 할 일");
  await dialogInput.press("Enter");

  await expect(page.getByText("수정된 할 일")).toBeVisible();

  await page.getByRole("button", { name: "삭제" }).click();
  await expect(page.getByText("완료한 할 일이 없습니다.")).toBeVisible();
});
