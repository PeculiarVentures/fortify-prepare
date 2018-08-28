/**
 * Print help info
 */
export function CommandHelp() {
    console.log();
    console.log("Usage: fortify-prepare <path/to/fprepare.json> <params>");
    console.log();
    console.log("Params:");
    console.log("  --help     Help info about CLI program");
    console.log("  --init     Creates fprepare.json file");
    console.log("  --clear    Removes outDir folder before files coping");
    console.log("  --input    Source folder. Alias is `in`");
    console.log("  --output   Source folder. Alias is `out`");
    console.log();
    console.log("Examples");
    console.log("  fortify-prepare --help");
    console.log();
    return;
}
