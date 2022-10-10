import esbuild from "rollup-plugin-esbuild";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import del from "rollup-plugin-delete";
import externals from "rollup-plugin-node-externals";
import dts from "rollup-plugin-dts";

import { compilerOptions } from "./tsconfig.json";

const inputPath = "./src/main.ts";
const outputPath = "./dist";
export default [
  {
    input: inputPath,
    output: { file: outputPath + "/bundle.js", format: "cjs" },
    plugins: [
      del({ targets: outputPath + "/*" }),
      esbuild({ minify: true }),
      typescriptPaths({ preserveExtensions: true }),
      externals(),
    ],
  },
  {
    input: inputPath,
    output: [{ file: outputPath + "/bundle.d.ts", format: "cjs" }],
    plugins: [dts({ compilerOptions: { paths: compilerOptions.paths } })],
  },
];
