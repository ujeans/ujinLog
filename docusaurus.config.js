// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "ujeans 지식 트리",
  tagline: "ujeans의 개발과 관련된 다양한 글을 쓰는 블로그",
  url: "https://ujeans-log.vercel.app",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "favicon.ico",
  organizationName: "ujeans", // Usually your GitHub org/user name.
  projectName: "ujinLog", // Usually your repo name.
  i18n: {
    defaultLocale: "ko",
    locales: ["ko"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          routeBasePath: "/",
          showReadingTime: true,
          editUrl: "https://github.com/ujeans/ujinLog/edit/main",
          blogSidebarTitle: "최근 포스트",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        // googleAnalytics: {
        //   trackingID: "G-YK4T99Z94F",
        // },
        // gtag: {
        //   trackingID: "G-YK4T99Z94F",
        // },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "ujeans 블로그",
        logo: {
          alt: "블로그 로고",
          src: "/img/logo.png",
        },
        items: [
          {
            label: "BLOG",
            position: "left",
            items: [
              { to: "/tags", label: "Tags" },
              { to: "/archive", label: "Archive" },
            ],
          },
          {
            type: "docSidebar",
            sidebarId: "feGroup",
            position: "left",
            label: "WIKI",
          },
          {
            href: "https://github.com/ujeans",
            label: "GitHub",
            position: "right",
          },
          {
            href: "https://github.com/ujeans",
            label: "이력서",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} ujeans, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      colorMode: {
        defaultMode: "dark",
        respectPrefersColorScheme: true,
      },
    }),
};

module.exports = config;
