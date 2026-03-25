import { expect, test } from "@playwright/test";

const INTERNAL_API_KEY = "replace-with-an-internal-api-key";

test("super admin can search and delete a viewer with all related data", async ({
  page,
  request,
}) => {
  const unique = Date.now();
  const title = `Admin User Cleanup ${unique}`;
  const slug = `admin-user-cleanup-${unique}`;
  const externalId = `admin-user-cleanup-${unique}`;
  const email = `cleanup-${unique}@example.com`;
  const password = "cleanup12345";
  const commentText = `待删除用户评论 ${unique}`;

  const upsertResponse = await request.post("/api/internal/videos/upsert", {
    headers: {
      "x-api-key": INTERNAL_API_KEY,
    },
    data: {
      sourceProvider: "openclaw",
      sourceExternalId: externalId,
      title,
      slug,
      description: "A QA fixture for admin user deletion flows.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      videoFormat: "mp4",
      type: "movie",
      category: "User Cleanup Lab",
      tags: ["admin-user", `cleanup-${unique}`],
      year: 2026,
      language: "中文",
      region: "中国",
      status: "PUBLISHED",
    },
  });

  expect(upsertResponse.ok()).toBeTruthy();

  try {
    const registerResponse = await request.post("/api/auth/register", {
      data: {
        email,
        password,
        nickname: "待删用户",
      },
    });

    expect(registerResponse.ok()).toBeTruthy();

    await page.goto("/login");
    const loginForm = page.locator("form").filter({
      has: page.locator('input[type="password"]'),
    });
    await loginForm.locator('input[type="email"]').fill(email);
    await loginForm.locator('input[type="password"]').fill(password);
    await loginForm.getByRole("button").click();

    await expect(page).toHaveURL(/\/$/);

    await page.goto(`/videos/${slug}`);
    await page.getByRole("button", { name: /加入收藏/ }).click();
    await expect(page.getByRole("button", { name: /已收藏/ })).toBeVisible();

    await page.locator("video").evaluate((node) => {
      const video = node as HTMLVideoElement;
      video.currentTime = 22;
      video.dispatchEvent(new Event("pause"));
    });

    await page.getByPlaceholder("写下你对这部影片的观感...").fill(commentText);
    await page.getByRole("button", { name: "提交评论" }).click();

    await page.goto("/admin/login");
    await page.getByLabel("邮箱").fill("admin@example.com");
    await page.getByLabel("密码").fill("12345678");
    await page.getByRole("button", { name: "进入后台" }).click();

    await expect(page).toHaveURL(/\/admin$/);

    await page.goto("/admin/comments");
    const commentRow = page.locator("article").filter({ hasText: commentText }).first();
    await expect(commentRow).toBeVisible();

    await page.goto("/admin/users");
    await expect(page).toHaveURL(/\/admin\/users$/);
    const userSearchInput = page.locator('input[name="email"]');
    await userSearchInput.fill(email);
    await userSearchInput.press("Enter");
    const userRow = page.locator("article").filter({ hasText: email }).first();
    await expect(userRow).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await userRow.getByRole("button").click();

    await expect(page.locator("article").filter({ hasText: email })).toHaveCount(0);

    await page.goto("/admin/comments");
    await expect(page.getByText(commentText)).toHaveCount(0);
  } finally {
    await request.delete(`/api/internal/videos/openclaw/${externalId}`, {
      headers: {
        "x-api-key": INTERNAL_API_KEY,
      },
    });
  }
});
