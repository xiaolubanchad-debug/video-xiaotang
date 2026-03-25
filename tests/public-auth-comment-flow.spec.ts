import { expect, test } from "@playwright/test";

const INTERNAL_API_KEY = "replace-with-an-internal-api-key";

test("viewer can register, sign in, and submit a comment for admin review", async ({
  page,
  request,
}) => {
  const unique = Date.now();
  const title = `Comment Flow Feature ${unique}`;
  const slug = `comment-flow-feature-${unique}`;
  const externalId = `comment-flow-${unique}`;
  const email = `viewer-${unique}@example.com`;
  const password = "comment12345";
  const commentText = `这是一条等待审核的评论 ${unique}`;

  const upsertResponse = await request.post("/api/internal/videos/upsert", {
    headers: {
      "x-api-key": INTERNAL_API_KEY,
    },
    data: {
      sourceProvider: "openclaw",
      sourceExternalId: externalId,
      title,
      slug,
      description: "A QA fixture for user auth and comment submission.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      videoFormat: "mp4",
      type: "movie",
      category: "Comment Lab",
      tags: ["comment-flow", `comment-${unique}`],
      year: 2026,
      language: "中文",
      region: "中国",
      status: "PUBLISHED",
    },
  });

  expect(upsertResponse.ok()).toBeTruthy();

  try {
    await page.goto("/login");
    await page.getByRole("button", { name: "注册账号" }).click();
    await page.getByLabel("昵称").fill("评论用户");
    await page.getByLabel("邮箱").fill(email);
    await page.getByLabel("密码").fill(password);
    await page.getByRole("button", { name: "注册并登录" }).click();

    await expect(page).toHaveURL(/\/$/);

    await page.goto(`/videos/${slug}`);
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
    await page.getByPlaceholder("写下你对这部影片的观感...").fill(commentText);
    await page.getByRole("button", { name: "提交评论" }).click();
    await expect(page.getByText("评论已提交，等待后台审核后会出现在前台。")).toBeVisible();

    await page.goto("/admin/login");
    await page.getByLabel("邮箱").fill("admin@example.com");
    await page.getByLabel("密码").fill("12345678");
    await page.getByRole("button", { name: "进入后台" }).click();

    await expect(page).toHaveURL(/\/admin$/);
    await page.getByRole("link", { name: "评论管理", exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/comments$/);
    await expect(page.getByText(commentText)).toBeVisible();
    await expect(page.getByText("待审核").first()).toBeVisible();
  } finally {
    await request.delete(`/api/internal/videos/openclaw/${externalId}`, {
      headers: {
        "x-api-key": INTERNAL_API_KEY,
      },
    });
  }
});
