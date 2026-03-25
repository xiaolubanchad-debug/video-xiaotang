import { expect, test } from "@playwright/test";

const INTERNAL_API_KEY = "replace-with-an-internal-api-key";

test("public frontend flow is coherent from home to search to detail", async ({
  page,
  request,
}) => {
  const unique = Date.now();
  const title = `Frontend Flow Feature ${unique}`;
  const tag = `frontflow-${unique}`;
  const slug = `frontend-flow-feature-${unique}`;
  const externalId = `frontend-flow-${unique}`;

  const upsertResponse = await request.post("/api/internal/videos/upsert", {
    headers: {
      "x-api-key": INTERNAL_API_KEY,
    },
    data: {
      sourceProvider: "openclaw",
      sourceExternalId: externalId,
      title,
      slug,
      description: "A frontend QA fixture for the public browsing flow.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      videoFormat: "mp4",
      coverUrl:
        "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1200&q=80",
      type: "movie",
      category: "Cinema Lab",
      tags: [tag, "spotlight"],
      year: 2026,
      language: "中文",
      region: "中国",
      status: "PUBLISHED",
    },
  });

  expect(upsertResponse.ok()).toBeTruthy();

  try {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "首页" }).first()).toBeVisible();
    await expect(page.getByText(title).first()).toBeVisible();
    await expect(
      page.locator("section").filter({ has: page.getByRole("heading", { name: "最新更新" }) }).getByText(title).first(),
    ).toBeVisible();
    await expect(
      page.locator("section").filter({ has: page.getByRole("heading", { name: "猜你喜欢" }) }).getByText(title).first(),
    ).toBeVisible();

    await page.getByRole("searchbox").fill(title);
    await page.getByRole("button", { name: "搜索" }).first().click();

    await expect(page).toHaveURL(/\/search\?q=/);
    await expect(page.getByRole("searchbox").first()).toHaveValue(title);
    await expect(page.getByText(`为“${title}”找到 1 部内容`)).toBeVisible();
    await expect(page.getByText(title).first()).toBeVisible();

    await page.getByRole("link", { name: title }).first().click();

    await expect(page).toHaveURL(new RegExp(`/videos/${slug}$`));
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
    await expect(page.locator("video")).toBeVisible();
    await expect(page.getByRole("link", { name: "打开源地址" })).toHaveAttribute(
      "href",
      "https://www.w3schools.com/html/mov_bbb.mp4",
    );
    await expect(page.getByRole("link", { name: tag })).toBeVisible();

    await page.goto(`/search?q=missing-${unique}`);
    await expect(page.getByText(`没有找到“missing-${unique}”`)).toBeVisible();

    await page.goto(`/videos/does-not-exist-${unique}`);
    await expect(page.getByText("你访问的影片暂时不存在")).toBeVisible();
  } finally {
    await request.delete(`/api/internal/videos/openclaw/${externalId}`, {
      headers: {
        "x-api-key": INTERNAL_API_KEY,
      },
    });
  }
});
