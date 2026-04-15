export const rssFeeds = [
  {
    url: "https://www.deeperblue.com/feed/",
    name: "DeeperBlue",
  },
  {
    url: "https://www.deeperblue.com/category/freediving/feed/",
    name: "DeeperBlue Freediving",
  },
  {
    url: "https://divernet.com/category/scuba-news/freediving/feed/",
    name: "Divernet Freediving",
  },
  {
    url: "https://news.google.com/rss/search?q=freediving&hl=en&gl=US&ceid=US:en",
    name: "Google News (EN)",
  },
  {
    url: "https://news.google.com/rss/search?q=%ED%94%84%EB%A6%AC%EB%8B%A4%EC%9D%B4%EB%B9%99&hl=ko&gl=KR&ceid=KR:ko",
    name: "Google News (KO)",
  },
  {
    url: "https://news.google.com/rss/search?q=apnea+diving&hl=en&gl=US&ceid=US:en",
    name: "Google News Apnea (EN)",
  },
];

export const scrapeTargets = [
  {
    url: "https://www.aidainternational.org/News",
    name: "AIDA International",
    selectors: {
      articleList: ".news-item, article",
      title: "h2, h3, .title",
      link: "a",
      date: "time, .date",
      snippet: "p, .excerpt",
    },
  },
];

export const searchKeywords = [
  "freediving",
  "free diving",
  "apnea diving",
  "breath hold diving",
  "AIDA",
  "CMAS freediving",
  "freediving record",
  "freediving competition",
];
