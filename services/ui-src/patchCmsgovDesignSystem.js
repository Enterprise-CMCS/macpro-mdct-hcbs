/* eslint-disable no-console */
/*
 * This script patches your node_modules folder, in place. Here's why:
 *
 * As of today (2025-06-27), we use @cmsgov/design-system@12 and react@18 .
 * These are 100% compatible with each other.
 * BUT React spits out a ton of irrelevant "warnings" as console errors,
 * because _in the future_ it will be incompatible. Specifically, design-system
 * uses `defaultProps` for some components, which React intends to deprecate.
 * @cmsgov is aware of this, and is in the process of upgrading.
 *
 * As soon as a version @cmsgov/design-system which does not use default props
 * is published, we should upgrade to it, and delete this script.
 * In the meantime, this script will silence those errors.
 */

const { join, basename } = require("node:path");
const { createHash } = require("node:crypto");
const { readFileSync, writeFileSync } = require("node:fs");

function main() {
  const cmsdsVersion = getCmsdsVersion();
  if (cmsdsVersion !== "^12.0.0") {
    console.error(
      "Hey! Can we delete our hacky node_modules patch script?\n" +
        `  It was designed for CMSDS 12.0.0, but the current version is ${cmsdsVersion}.\n` +
        "  Hopefully, that patching is no longer necessary?"
    );
    return;
  }

  let patchesToApply = [];
  for (let patch of ALL_PATCHES) {
    const filename = basename(patch.path);
    const hash = getHash(patch.path);
    if (hash === patch.postPatchHash) {
      console.info(`File ${filename} is already patched`);
    } else if (hash === patch.prePatchHash) {
      console.info(`Will patch ${filename}`);
      patchesToApply.push(patch);
    } else {
      console.error(
        "Failed to patch node_modules/@cmsgov/design-system!\n" +
          `  ${filename} had unexpected hash: ${hash}`
      );
      return;
    }
  }

  if (patchesToApply.length > 0) {
    applyPatches(patchesToApply);
    console.info("Patches applied to node_modules/@cmsgov/design-system.");
  } else {
    console.info("All files are already patched; no work required.");
  }
}

function getCmsdsVersion() {
  const packageJsonPath = join(__dirname, "package.json");
  const packageJsonContents = readFileSync(packageJsonPath, "utf-8");
  const packageObject = JSON.parse(packageJsonContents);
  return packageObject.dependencies["@cmsgov/design-system"];
}

function getHash(path) {
  const hasher = createHash("sha256");
  hasher.update(readFileSync(path));
  return hasher.digest("hex");
}

const BASE_PATH = join(
  __dirname,
  "node_modules",
  "@cmsgov",
  "design-system",
  "dist",
  "react-components",
  "cjs"
);
const ALL_PATCHES = [
  {
    path: join(BASE_PATH, "ChoiceList", "Choice.js"),
    prePatchHash:
      "d5402577642be31f5a02d23041da117745270bf725d6e342389b40d17ef4cc33", // pragma: allowlist secret
    postPatchHash:
      "90c99ddee40de6764d9232fa9459b4dd169a0b70c4b4e0c6315fc83baf5a7bd1", // pragma: allowlist secret
    changes: [
      { lineNumber: 35, replacement: "    _choiceChild = false," },
      { lineNumber: 138, replacement: "" },
      { lineNumber: 139, replacement: "" },
      { lineNumber: 140, replacement: "" },
    ],
  },
  {
    path: join(BASE_PATH, "Icons", "SvgIcon.js"),
    prePatchHash:
      "3a13f78866893c90bff80d70b33b2c943c21c675ed98d8ddb750eb95a0a082db", // pragma: allowlist secret
    postPatchHash:
      "617b56f19cc8770c032195763970cf1e49d8c5a0af58cf3190113f1ea6186a11", // pragma: allowlist secret
    changes: [
      { lineNumber: 15, replacement: "    ariaHidden = true," },
      { lineNumber: 20, replacement: "    inversed = false," },
      { lineNumber: 56, replacement: "" },
      { lineNumber: 57, replacement: "" },
      { lineNumber: 58, replacement: "" },
      { lineNumber: 59, replacement: "" },
    ],
  },
  {
    path: join(BASE_PATH, "Label", "Label.js"),
    prePatchHash:
      "82edcde539eca7b2767587b4efd5fc0e449d6126bf334bce32c0e64389f372a1", // pragma: allowlist secret
    postPatchHash:
      "fcbff0d725722a106e9b958342e36b1168982f84041f0510845ca857a49a4c77", // pragma: allowlist secret
    changes: [
      { lineNumber: 25, replacement: "    component = 'label'," },
      { lineNumber: 75, replacement: "" },
      { lineNumber: 76, replacement: "" },
      { lineNumber: 77, replacement: "" },
    ],
  },
  {
    path: join(BASE_PATH, "TextField", "TextField.js"),
    prePatchHash:
      "a4a9bfe225496d7931903d995d96254efff73c2a6502f9a20a2017f552d90319", // pragma: allowlist secret
    postPatchHash:
      "e23fe45d71290de14a2157a7026769ce325439fca8d44c11432c11d01746816c", // pragma: allowlist secret
    changes: [
      { lineNumber: 29, replacement: "    className, type='text'," },
      { lineNumber: 64, replacement: "    type: 'text'," },
      { lineNumber: 98, replacement: "" },
      { lineNumber: 99, replacement: "" },
      { lineNumber: 100, replacement: "" },
    ],
  },
];

function applyPatches(patches) {
  for (let patch of patches) {
    const lines = readFileSync(patch.path, "utf-8").split("\n");
    for (let change of patch.changes) {
      lines[change.lineNumber - 1] = change.replacement;
    }
    writeFileSync(patch.path, lines.join("\n"));
    console.info(`Patched ${basename(patch.path)}`);
  }
}

main();
