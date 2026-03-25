import { expect, test } from "@playwright/test";

test("super admin can create, edit, and delete a video", async ({ page }) => {
  const unique = Date.now();
  const initialTitle = `Codex Test Video ${unique}`;
  const updatedTitle = `Codex Updated Video ${unique}`;

  await page.goto("/admin/login");
  await page.getByLabel("邮箱").fill("admin@example.com");
  await page.getByLabel("密码").fill("12345678");
  await page.getByRole("button", { name: "进入后台" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await page.getByRole("link", { name: "视频管理" }).click();
  await expect(page).toHaveURL(/\/admin\/videos$/);

  await page.getByRole("link", { name: "新增视频" }).click();
  await expect(page).toHaveURL(/\/admin\/videos\/new$/);

  await page.getByLabel("标题", { exact: true }).fill(initialTitle);
  await page.getByLabel("副标题", { exact: true }).fill("Phase 1");
  await page.getByLabel("简介").fill("Created by the automated admin workflow test.");
  await page.getByLabel("内容类型", { exact: true }).fill("series");
  await page.getByLabel("分类", { exact: true }).fill("Automation");
  await page.getByLabel("地区", { exact: true }).fill("CN");
  await page.getByLabel("语言", { exact: true }).fill("Chinese");
  await page.getByLabel("年份", { exact: true }).fill("2026");
  await page.getByLabel("时长（秒）", { exact: true }).fill("1800");
  await page.getByLabel("标签（逗号分隔）").fill("automation, admin-flow");
  await page.getByLabel("播放源地址").fill("https://example.com/automation-video.m3u8");
  await page.getByRole("button", { name: "创建视频" }).click();

  await expect(page).toHaveURL(/\/admin\/videos$/);
  await expect(page.getByText(initialTitle)).toBeVisible();

  const row = page.locator("article").filter({ hasText: initialTitle }).first();
  await row.getByRole("link", { name: "编辑" }).click();

  await expect(page).toHaveURL(/\/edit$/);
  await page.getByLabel("标题", { exact: true }).fill(updatedTitle);
  await page.getByLabel("简介").fill("Updated by the automated admin workflow test.");
  await page.getByRole("button", { name: "保存修改" }).click();

  await expect(page).toHaveURL(/\/admin\/videos$/);
  await expect(page.getByText(updatedTitle)).toBeVisible();

  await page.screenshot({
    path: "D:/xiangmu/web2/.codex-logs/admin-videos-after-edit.png",
    fullPage: true,
  });

  const updatedRow = page.locator("article").filter({ hasText: updatedTitle }).first();

  page.once("dialog", (dialog) => dialog.accept());
  await updatedRow.getByRole("button", { name: "删除" }).click();

  await expect(page.getByText(updatedTitle)).toHaveCount(0);

  await page.screenshot({
    path: "D:/xiangmu/web2/.codex-logs/admin-videos-after-delete.png",
    fullPage: true,
  });
});
