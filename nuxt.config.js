import TerserPlugin from "terser-webpack-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";

export default {
  target: "static",
  // debug: true,
  server: {
    host: "0.0.0.0"
  },
  env: {
    SITE_ID: process.env.SITE_ID
  },
  generate: {
    crawler: false,
    concurrency: 10, // 设置为 5 表示同时最多发起 5 个请求
    interval: 100, // 设置为 100 表示每隔 100 毫秒发起一次请求
    async routes() {
      // 获取应用的动态路由
      const appPathResponse = await fetch(
        `${process.env.PROD_API_URL}/api/game/get_all_path_v2?site_id=${process.env.SITE_ID}`
      );
      const appPosts = await appPathResponse.json();
      const appDetailPaths = appPosts.data.app_detail.map((item) => `/app/${item}`);
      const appDownloadPaths = appPosts.data.app_detail.map((item) => `/download/${item}`);

      // 获取应用合集的动态路由
      const collectionPathResponse = await fetch(
        `${process.env.PROD_API_URL}/api/game/get_app_collection_path?site_id=${process.env.SITE_ID}`
      );
      const collectionPosts = await collectionPathResponse.json();
      const collectionDetailPaths = collectionPosts.data.detail.map(
        (item) => `/collection/${item}`
      );
      const urls = [...appDetailPaths, ...appDownloadPaths, ...collectionDetailPaths];
      return urls;
    }
  },
  axios: {
    baseURL:
      process.env.NODE_ENV === "production" ? process.env.PROD_API_URL : process.env.TEST_API_URL
  },
  router: {
    trailingSlash: true
  },
  head: {
    title: "charmnovels－Carefully selected - Each one is filled with surprises and inspiration.",
    meta: [
      { charset: "utf-8" },
      {
        name: "version",
        content: process.env.APP_VERSION || "1.0"
      },
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,viewport-fit=cover,minimum-scale=1,minimal-ui"
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "yes"
      },
      {
        name: "mobile-web-app-capable",
        content: "yes"
      },
      {
        hid: "description",
        name: "description",
        content:
          "We are committed to providing you with a variety of high-quality wallpapers and collections, making every unlock a surprise and inspiration."
      },
      {
        hid: "keywords",
        name: "keywords",
        content:
          "Anime, 3D Dynamic, 4K HD, Scenery, Shoujo, Technological, Two-Dimensional, Personalized"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  image: {
    provider: "cloudflare",
    cloudflare: {
      baseURL: "https://bunchthings.com" // Cloudflare 图片服务的基础 URL
    }
  },
  css: ["@/assets/css/fonts.css", "@/assets/css/reset.css", "@/assets/css/common.scss"],
  plugins: [
    { src: "~/plugins/vue-infinite-scroll", ssr: false },
    "~/plugins/axios", // 注册 axios.js 插件
    "~/plugins/global-data.js"
  ],

  components: true,
  buildModules: ["@nuxtjs/style-resources", "@nuxt/image", "@nuxtjs/pwa", "@nuxtjs/sitemap"],
  styleResources: {
    scss: ["./assets/css/_mixins.scss"]
  },
  modules: ["@nuxtjs/axios"],
  sitemap: {
    hostname: "https://charmnovels.com/" // 网站根 URL
  },
  pwa: {
    manifest: {
      name: "charmnovels", // 应用名称
      short_name: "charmnovels", // 应用短名称
      description:
        "We are committed to providing you with a variety of high-quality wallpapers and collections, making every unlock a surprise and inspiration.",
      icons: [
        {
          src: "/icons/32.png",
          sizes: "32x32",
          type: "image/png"
        },
        {
          src: "/icons/36.png",
          sizes: "36x36",
          type: "image/png"
        },
        {
          src: "/icons/48.png",
          sizes: "48x48",
          type: "image/png"
        },
        {
          src: "/icons/72.png",
          sizes: "72x72",
          type: "image/png"
        },
        {
          src: "/icons/96.png",
          sizes: "96x96",
          type: "image/png"
        },
        {
          src: "/icons/144.png",
          sizes: "144x144",
          type: "image/png"
        },
        {
          src: "/icons/192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/icons/256.png",
          sizes: "256x256",
          type: "image/png"
        },
        {
          src: "/icons/512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    }
  },
  build: {
    html: {
      minify: {
        collapseWhitespace: true, // 压缩空格
        removeComments: true, // 移除注释
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true
      }
    },
    extractCSS: { allChunks: true },
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: "all",
        automaticNameDelimiter: ".",
        name: true,
        minSize: 10000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            name: "vendors",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            maxSize: 244000,
            priority: -10
          },
          styles: {
            name: "styles",
            test: /\.(css|vue)$/,
            chunks: "all",
            enforce: true
          }
        }
      },
      // 压缩配置
      minimizer: [
        // 压缩 JavaScript
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true // 删除 console 日志
            },
            output: {
              comments: false
            }
          }
        }),
        // 压缩 CSS
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: { inline: false },
            discardComments: { removeAll: true }
          }
        })
      ]
    }
  }
};
