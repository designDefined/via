import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

const baseConfig = {
  entryPoints: ["index.ts"],
  outdir: "dist",
  bundle: true,
  sourcemap: true,
  plugins: [nodeExternalsPlugin()],
};

Promise.all([
  esbuild.build({
    ...baseConfig,
    format: "cjs",
    outExtension: {
      ".js": ".cjs",
    },
  }),

  esbuild.build({
    ...baseConfig,
    format: "esm",
  }),
]).catch(() => {
  console.log("Build failed");
  process.exit(1);
});
