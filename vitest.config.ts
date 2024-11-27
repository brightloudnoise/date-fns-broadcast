// vitest.config.ts
import { defaultExclude, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    reporters: "verbose",
    coverage: {
      exclude: [...defaultExclude, "**/src/index.ts"],
    },
  },
});
