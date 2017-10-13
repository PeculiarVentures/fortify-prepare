interface IMinimistArguments {
    "_"?: string[];
    "--"?: string[];
    clear: boolean;
    help: boolean;
    debug: boolean;
    init: boolean;
}

interface IJsonConfig {
    srcDir: string;
    outDir: string;
    include: string[];
    exclude: string[];
    clear?: boolean;
}

type FileCallback = (file: string, match: boolean) => void;

interface IMatchFileItem {
    file: string;
    matchFile: string;
    include: boolean;
}

declare module "glob-to-regexp" {

    interface IGlobRegExp {
        test: (text: string) => boolean;
    }

    function create(pattern: string, options?: {
        extended?: boolean,
        globstar?: boolean,
        /**
         * RegEx flags (eg i, g)
         */
        flags?: string,
    }): IGlobRegExp;

    export = create;

}

declare module "json-parser" {
    function parse(data: string): any;
}
