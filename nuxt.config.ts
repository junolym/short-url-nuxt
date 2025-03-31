// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 开发工具
  devtools: { enabled: true },

  // 模块
  modules: [
    '@nuxt/ui',
  ],

  // UI 配置
  ui: {
    // 启用图标
    icons: ['heroicons'],
  },

  // 应用配置
  app: {
    // 页面过渡效果
    pageTransition: { 
      name: 'page',
      mode: 'out-in'
    },
    // 头部配置
    head: {
      title: '短链接生成器',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          hid: 'description', 
          name: 'description', 
          content: '一个简单的短链接生成和管理工具' 
        }
      ],
    }
  },

  // 运行时配置
  runtimeConfig: {
    // 服务器端配置
    dbPath: process.env.DB_PATH || './data/urls.db',
    
    // 公共配置（客户端可访问）
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    }
  },

  // TypeScript 配置
  typescript: {
    strict: true
  },

  // Nitro 配置
  nitro: {
    // 启用开发时的源码映射
    sourceMap: true,
  },

  compatibilityDate: '2025-03-31',
})