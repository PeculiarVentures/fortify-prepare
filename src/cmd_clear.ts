import * as rimraf from "rimraf";

export function CommandClear(config: IJsonConfig) {
    rimraf.sync(config.outDir);
    console.log(`Folder ${config.outDir} was removed`);
}
