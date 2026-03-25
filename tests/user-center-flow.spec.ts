import { expect, test } from "@playwright/test";

const INTERNAL_API_KEY = "replace-with-an-internal-api-key";

test("viewer can manage favorites, pending comments, and watch history in the user center", async ({
  page,
  request,
}) => {
  const unique = Date.now();
  const title = `User Center Feature ${unique}`;
  const slug = `user-center-feature-${unique}`;
  const externalId = `user-center-${unique}`;
  const email = `center-${unique}@example.com`;
  const password = "comment12345";
  const commentText = `用户中心评论 ${unique}`;

  const upsertResponse = await request.post("/api/internal/videos/upsert", {
    headers: {
      "x-api-key": INTERNAL_API_KEY,
    },
    data: {
      sourceProvider: "openclaw",
      sourceExternalId: externalId,
      title,
      slug,
      description: "A QA fixture for user-center flows.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      videoFormat: "mp4",
      type: "movie",
      category: "Profile Lab",
      tags: ["user-center", `favorite-${unique}`],
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
    await page.getByLabel("昵称").fill("片库用户");
    await page.getByLabel("邮箱").fill(email);
    await page.getByLabel("密码").fill(password);
    await page.getByRole("button", { name: "注册并登录" }).click();

    await expect(page).toHaveURL(/\/$/);

    await page.goto(`/videos/${slug}`);
    await page.getByRole("button", { name: /加入收藏/ }).click();
    await expect(page.getByRole("button", { name: /已收藏/ })).toBeVisible();

    await page.locator("video").evaluate((node) => {
      const video = node as HTMLVideoElement;
      video.currentTime = 18;
      video.dispatchEvent(new Event("pause"));
    });

    await page.goto("/me/favorites");
    await expect(page.getByText(title).first()).toBeVisible();

    await page.goto("/me/history");
    await expect(page.getByText(title).first()).toBeVisible();
    await expect(page.getByText("已观看约 18 秒")).toBeVisible();

    await page.goto(`/videos/${slug}`);
    await page.getByPlaceholder("写下你对这部影片的观感...").fill(commentText);
    await page.getByRole("button", { name: "提交评论" }).click();
    await expect(page.getByText("评论已提交，等待后台审核后会出现在前台。")).toBeVisible();

    await page.goto("/me/comments");
    await expect(page.getByText(commentText)).toBeVisible();
    await expect(page.getByText("待审核").first()).toBeVisible();
    await page.getByRole("button", { name: "删除待审核评论" }).click();
    await expect(page.getByText(commentText)).toHaveCount(0);
  } finally {
    await request.delete(`/api/internal/videos/openclaw/${externalId}`, {
      headers: {
        "x-api-key": INTERNAL_API_KEY,
      },
    });
  }
});
