import * as fs from "fs";
import * as path from "path";
import globToRegExp = require("glob-to-regexp");

export function matchFiles(dir: string, config: IJsonConfig) {
    const files = findAllFiles(dir);
    const res: IMatchFileItem[] = [];
    for (const file of files) {
        let ok = true;
        let matchFile = file;

        //#region Cut dir name from file name
        const cutRe = new RegExp(`^${dir}[\\\\\\/]`);
        matchFile = file.replace(cutRe, "");
        //#endregion

        if (config.include.length) {
            ok = config.include.some((pattern) => {
                const re = globToRegExp(pattern, { globstar: true, extended: true });
                return re.test(matchFile);
            });
        }

        if (ok && config.exclude.length) {
            ok = !config.exclude.some((pattern) => {
                const re = globToRegExp(pattern, { globstar: true, extended: true });
                return re.test(matchFile);
            });
        }

        res.push({
            file,
            matchFile,
            include: ok,
        });
    }

    return res;
}

function findAllFiles(dir: string) {
    function _findAllFiles(dir2: string, list: string[]) {
        dir2 = path.normalize(dir2);
        if (fs.existsSync(dir2) && fs.statSync(dir2).isDirectory()) {
            const items = fs.readdirSync(dir2);
            for (const item of items) {
                const itemPath = path.join(dir2, item);
                const stat = fs.statSync(itemPath);
                if (stat.isDirectory()) {
                    _findAllFiles(itemPath, list);
                } else if (stat.isFile()) {
                    list.push(itemPath);
                }
            }
        }
    }
    const res: string[] = [];
    _findAllFiles(dir, res);

    return res;
}
