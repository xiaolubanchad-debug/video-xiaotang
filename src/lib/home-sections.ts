export const HOME_SECTION_MAX_ITEMS = 8;

export const manualHomeSectionDefinitions = [
  {
    key: "hot",
    slug: "home-hot-recommend",
    title: "热门推荐",
    description: "后台手工编排的首页主推区块。",
  },
  {
    key: "editor",
    slug: "home-editor-picks",
    title: "站长精选",
    description: "由站长挑选并维护的精选内容区块。",
  },
] as const;

export const homePageSectionDefinitions = [
  {
    key: "hot",
    title: "热门推荐",
    description: "后台手工编排",
  },
  {
    key: "latest",
    title: "最新更新",
    description: "按发布时间倒序展示",
  },
  {
    key: "editor",
    title: "站长精选",
    description: "后台手工编排",
  },
  {
    key: "guess",
    title: "猜你喜欢",
    description: "刷新页面后随机换一批",
  },
] as const;

export type ManualHomeSectionKey =
  (typeof manualHomeSectionDefinitions)[number]["key"];

export function getManualHomeSectionDefinition(key: ManualHomeSectionKey) {
  return manualHomeSectionDefinitions.find((item) => item.key === key)!;
}
