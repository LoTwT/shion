// @ts-check
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import vue from "@astrojs/vue"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  // 请修改为你自己的线上地址，谢谢茄子
  site: "https://shion.ayingott.me",
  integrations: [mdx(), sitemap(), vue()],
  vite: {
    plugins: [tailwindcss()],
  },
})
