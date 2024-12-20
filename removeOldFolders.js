/*
 *                 ⚠️ ⚠️ ⚠️ WARNING ⚠️ ⚠️ ⚠️
 *
 * Updating this file in the main branch will do nothing!
 *
 * It is only invoked by the delete-pages.yml github action,
 * which is only run on the gh-pages branch.
 * Any changes _must_ be merged to gh-pages to take effect.
 */

/* eslint-disable no-console */
import { parseArgs } from "node:util";
import * as fs from "node:fs";
import { join } from "node:path";

/*
 * This program will delete all folders in the specified directory
 * which are older than a certain cutoff.
 *
 * It is a part of our Playwright setup:
 * We save test run output as files in the repo, in the gh-pages branch.
 * After a month, we consider it safe to delete those old test results.
 *
 * Since this program runs in a github action,
 * we cannot rely on file system timestamps to make the age determination;
 * every file and folder in the repo will appear to be less than a minute old.
 * Instead, we embed the test run timestamp in the folder name, and parse that.
 */

/** The threshold folder age for deletion. */
const MAX_AGE_DAYS = 30;

/**
 * Is this filesystem entry a folder,
 * with a timestamp-formatted name,
 * indicating that it is old enough to delete?
 * @param {fs.Dirent} entry
 */
function shouldDelete(entry) {
  const name = entry.name;
  if (!entry.isDirectory()) {
    console.info(
      `SKIPPED --- File ${name} is not a folder. It will not be deleted.`
    );
    return false;
  }

  const folderNameRegex = /^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})Z$/;
  const regexMatch = folderNameRegex.exec(name);
  if (!regexMatch) {
    console.info(
      `SKIPPED --- Folder ${name} does not match the expected regex. It will not be deleted.`
    );
    return false;
  }

  let folderTimestamp;
  try {
    const [yyyy, MM, dd, hh, mm, ss] = regexMatch
      .slice(1)
      .map((n) => parseInt(n, 10));
    // JS Dates have 0-based months
    folderTimestamp = new Date(yyyy, MM - 1, dd, hh, mm, ss);
  } catch {
    console.error(
      `SKIPPED --- Error parsing timestamp for folder ${entry.name}. It will not be deleted.`
    );
    return false;
  }

  const ageMS = new Date().valueOf() - folderTimestamp.valueOf();
  const ageDays = ageMS / 1000 / 60 / 60 / 24;
  if (ageDays < MAX_AGE_DAYS) {
    console.debug(
      `SKIPPED --- Folder ${entry.name} is not older than ${MAX_AGE_DAYS} days. It will not be deleted.`
    );
    return false;
  }

  return true;
}

/**
 * @param {string} directory - The directory to search for deletable folders
 */
function deleteOldFolders(directory) {
  const foldersToDelete = fs
    .readdirSync(directory, { withFileTypes: true })
    .filter(shouldDelete);
  for (let folder of foldersToDelete) {
    try {
      fs.rmSync(join(directory, folder.name), { force: true });
      console.debug(
        `DELETED --- Folder ${folder.name} and its contents have been deleted.`
      );
    } catch (err) {
      console.error(`SKIPPED --- Error deleting folder ${folder.name}`, err);
    }
  }
}

const directory = parseArgs({ allowPositionals: true }).positionals[0];
if (!directory) {
  throw new Error(
    "The directory to search must be provided via the command line."
  );
}
deleteOldFolders(directory);
