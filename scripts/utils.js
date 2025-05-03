import { promises as fsp } from "node:fs";
import { join, resolve } from "node:path";
import { execSync } from "node:child_process";
import { readFile, writeFile } from "jsonfile";

const ROOT_DIR = resolve(__dirname, "..");

/**
 * @param {string} packageName
 * @param {string} [directory]
 * @returns {string}
 */
function packageJson(packageName, directory) {
  return join(ROOT_DIR, directory, packageName, "package.json");
}

/**
 * @param {string} packageName
 * @returns {Promise<string | undefined>}
 */
async function getPackageVersion(packageName) {
  let file = packageJson(packageName, "packages");
  let json = await readFile(file);
  return json.version;
}

/**
 * @returns {void}
 */
function ensureCleanWorkingDirectory() {
  let status = execSync(`git status --porcelain`).toString().trim();
  let lines = status.split("\n");
  invariant(
    lines.every((line) => line === "" || line.startsWith("?")),
    "Working directory is not clean. Please commit or stash your changes.",
  );
}

/**
 * @param {string} packageName
 * @param {(json: import('type-fest').PackageJson) => any} transform
 */
async function updatePackageConfig(packageName, transform) {
  let file = packageJson(packageName, "packages");
  let json = await readFile(file);
  transform(json);
  await writeFile(file, json, { spaces: 2 });
}

/**
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
async function fileExists(filePath) {
  try {
    await fsp.stat(filePath);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * @param {*} cond
 * @param {string} message
 * @returns {asserts cond}
 */
function invariant(cond, message) {
  if (!cond) throw new Error(message);
}

export default {
  ensureCleanWorkingDirectory,
  fileExists,
  getPackageVersion,
  invariant,
  packageJson,
  updatePackageConfig,
};
