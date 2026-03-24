import { expect, test } from "@playwright/test";

test("super admin can create, edit, and delete a video", async ({ page }) => {
  const unique = Date.now();
  const initialTitle = `Codex Test Video ${unique}`;
  const updatedTitle = `Codex Updated Video ${unique}`;

  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("admin@example.com");
  await page.getByLabel("Password").fill("12345678");
  await page.getByRole("button", { name: "Enter admin" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await page.getByRole("link", { name: "Open videos" }).click();
  await expect(page).toHaveURL(/\/admin\/videos$/);

  await page.getByRole("link", { name: "Add video" }).click();
  await expect(page).toHaveURL(/\/admin\/videos\/new$/);

  await page.getByLabel("Title", { exact: true }).fill(initialTitle);
  await page.getByLabel("Subtitle", { exact: true }).fill("Phase 1");
  await page
    .getByLabel("Description")
    .fill("Created by the automated admin workflow test.");
  await page.getByLabel("Type", { exact: true }).fill("series");
  await page.getByLabel("Category", { exact: true }).fill("Automation");
  await page.getByLabel("Region", { exact: true }).fill("CN");
  await page.getByLabel("Language", { exact: true }).fill("Chinese");
  await page.getByLabel("Year", { exact: true }).fill("2026");
  await page
    .getByLabel("Duration (seconds)", { exact: true })
    .fill("1800");
  await page
    .getByLabel("Tags (comma separated)")
    .fill("automation, admin-flow");
  await page
    .getByLabel("Source URL")
    .fill("https://example.com/automation-video.m3u8");
  await page.getByRole("button", { name: "Create video" }).click();

  await expect(page).toHaveURL(/\/admin\/videos$/);
  await expect(page.getByText(initialTitle)).toBeVisible();

  const row = page.locator("article").filter({ hasText: initialTitle }).first();
  await row.getByRole("link", { name: "Edit" }).click();

  await expect(page).toHaveURL(/\/edit$/);
  await page.getByLabel("Title", { exact: true }).fill(updatedTitle);
  await page
    .getByLabel("Description")
    .fill("Updated by the automated admin workflow test.");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page).toHaveURL(/\/admin\/videos$/);
  await expect(page.getByText(updatedTitle)).toBeVisible();

  await page.screenshot({
    path: "D:/xiangmu/web2/.codex-logs/admin-videos-after-edit.png",
    fullPage: true,
  });

  const updatedRow = page
    .locator("article")
    .filter({ hasText: updatedTitle })
    .first();

  page.once("dialog", (dialog) => dialog.accept());
  await updatedRow.getByRole("button", { name: "Delete" }).click();

  await expect(page.getByText(updatedTitle)).toHaveCount(0);

  await page.screenshot({
    path: "D:/xiangmu/web2/.codex-logs/admin-videos-after-delete.png",
    fullPage: true,
  });
});
