import * as fs from "fs";
import { CONFIG_FILE, DEFAULT_CONFIG } from "./const";

export function CommandInitConfig() {
    const json = JSON.stringify(DEFAULT_CONFIG, null, 4);
    if (fs.existsSync(CONFIG_FILE)) {
        console.log(`Cannot generate ${CONFIG_FILE}: file already exists`);
    } else {
        fs.writeFileSync(CONFIG_FILE, json);
        console.log(`${CONFIG_FILE} successfully created`);
    }
}
