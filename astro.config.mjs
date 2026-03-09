// @ts-check
import { defineConfig } from 'astro/config';

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  site: "https://iridescent-zabaione-7a469e.netlify.app/blog/",
  integrations: [preact()]
});