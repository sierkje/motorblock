import { defineConfig } from "tsup";

export default defineConfig([
  {
    clean: false,
    dts: true,
    entry: ["lib/index.tsx"],
    format: ["esm"],
    outDir: "dist",
  },
]);
