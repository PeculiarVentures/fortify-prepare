import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

import { CONFIG_FILE, DEFAULT_CONFIG, HASH_ALG } from "./const";
import { matchFiles } from "./matcher";

export async function CommandRun(config: IJsonConfig) {
    const srcDir = config.srcDir;
    const outDir = config.outDir;

    if (!fs.existsSync(srcDir)) {
        throw new Error(`Cannot find ${srcDir} folder`);
    }

    const files = matchFiles(srcDir, config);
    const result: Array<{ file: string, copied: boolean }> = [];
    for (const item of files) {
        if (item.include) {
            // Copy files which must be included
            result.push(await copyFile(item.file, srcDir, outDir)
                .catch((err) => {
                    console.log(`Cannot copy file ${item}. ${err.message}`);
                    return false;
                })
                .then((copied) => {
                    if (copied) {
                        console.log(`Copied ${item.matchFile}`);
                    }
                    return {
                        copied,
                        file: item.file,
                    };
                }));
        }
    }
    return result;
}

/**
 * Creates folder by path
 * @param dir Directory path
 */
function makeDir(dir: string) {
    if (dir && !fs.existsSync(dir)) {
        const parsedPath = path.parse(dir);
        makeDir(parsedPath.dir);
        fs.mkdirSync(dir);
    }
}

/**
 * Copies file to output directory
 * @param filePath  Source file path
 * @param srcDir    Source directory path
 * @param outDir    Output directory path
 */
function copyFile(filePath: string, srcDir: string, outDir: string) {
    let outPath: string;

    return Promise.resolve()
        .then(() => {
            outPath = path.join(outDir, filePath.replace(srcDir, ""));

            //#region Create directories, if needed
            const parsedPath = path.parse(outPath);
            if (!fs.existsSync(parsedPath.dir)) {
                makeDir(parsedPath.dir);
            }
            //#endregion

            //#region Compare digest of src and out file, if needed
            if (fs.existsSync(outPath)) {
                // compare files digest
                return digestFile(filePath)
                    .then((digestSrc) => {
                        return digestFile(outPath)
                            .then((digestOut) => {
                                if (!digestSrc.equals(digestOut)) {
                                    return true;
                                }
                                return false;
                            });
                    });

            }
            //#endregion
            return true;
        })
        .then((needCopy) => {
            if (needCopy) {
                // Copy file
                return new Promise<boolean>((resolve, reject) => {
                    fs.createReadStream(filePath)
                        .pipe(fs.createWriteStream(outPath))
                        .on("finish", () => {
                            resolve(true);
                        })
                        .on("error", (err) => {
                            reject(err);
                        });
                });
            }
            return false;
        });
}

/**
 * Calculate digest of file content
 * @param filePath File path
 */
function digestFile(filePath: string) {
    return new Promise<Buffer>((resolve, reject) => {
        const hash = crypto.createHash(HASH_ALG);
        fs.createReadStream(filePath).pipe(hash)
            .on("finish", () => {
                const buffer = hash.read() as Buffer;
                resolve(buffer);
            })
            .on("error", (err) => {
                reject(err);
            });
    });
}
