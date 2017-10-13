#!/usr/bin/env node

import * as fs from "fs";
import * as minimist from "minimist";
import * as path from "path";
import globToRegExp = require("glob-to-regexp");
import * as jsonParser from "json-parser";

import { CommandClear } from "./cmd_clear";
import { CommandHelp } from "./cmd_help";
import { CommandInitConfig } from "./cmd_init";
import { CommandRun } from "./cmd_run";
import { CONFIG_FILE, DEFAULT_CONFIG } from "./const";

async function Main(argv: string[]) {
    // Get arguments
    const args: IMinimistArguments = minimist(process.argv, {
        alias: {
            c: "clear",
            d: "debug",
            h: "help",
            i: "init",
        },
        default: {
            debug: false,
            help: false,
            init: false,
        },
        string: [],
    }) as any;

    if (args.help) {
        CommandHelp();
    } else if (args.init) {
        CommandInitConfig();
    } else {
        const config = readConfig(args);

        if (config.clear) {
            CommandClear(config);
        }

        const copied = await CommandRun(config);
        let copiedCount = 0;
        copied.forEach((item) => {
            if (item.copied) {
                copiedCount++;
            }
        });
        console.log(`${copiedCount} files copied`);
    }
}

function readConfig(args: IMinimistArguments) {
    let srcDir = "./";
    let config = DEFAULT_CONFIG;
    if (args._ && args._[2]) {
        srcDir = args._[2];
    }

    // get config file
    const configPath = path.join(srcDir, CONFIG_FILE);
    if (fs.existsSync(CONFIG_FILE)) {
        try {
            config = jsonParser.parse(fs.readFileSync(CONFIG_FILE).toString());
        } catch {
            throw new Error(`Cannot read ${CONFIG_FILE} file. Bad JSON format`);
        }
    } else {
        throw new Error(`Cannot read ${CONFIG_FILE} file. File doesn't not exist`);
    }

    // check output dir
    if (!config.outDir) {
        throw new Error(`Cannot get required 'outDir' property from ${CONFIG_FILE} file`);
    }
    // check src dir
    if (!config.srcDir) {
        config.srcDir = "./";
    }

    if (args.clear) {
        config.clear = true;
    }

    return config;
}

Main(process.argv.slice(2))
    .catch((err) => {
        console.log(err.message);
    });
