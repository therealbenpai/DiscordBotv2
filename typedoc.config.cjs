/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
    entryPointStrategy: 'expand',
    entryPoints: [
        "index.ts",
        "types.ts",
        "triggers/collection.ts",
        "events/collection.ts",
        "components/collection.ts",
        "commands/collection.ts",
    ],
    readme: "none",
    name: "Fembot",
    plugin: ["typedoc-plugin-rename-defaults", "typedoc-plugin-extras", "typedoc-plugin-mdn-links"],
    darkHighlightTheme: "material-theme-darker",
    lightHighlightTheme: "material-theme-ocean",
    commentStyle: "all"
};