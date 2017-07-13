const { forEachChild, SyntaxKind } = require("typescript");
const { resolve } = require("path");

exports.ImportReplacePlugin = (function () {
  function ImportReplacePlugin(options) {
    if (!options || !options.platform) {
      throw new Error(`Target platform must be specified!`);
    }

    this.platform = options.platform;
    this.debugEnabled = options.debug; // log which imports get replaced
    this.files = options.files;
    if (!this.files) {
      throw new Error(`An array of files containing just the filenames to replace with platform specific names must be specified.`);
    }
  }

  ImportReplacePlugin.prototype.debug = function (...args) {
    if (this.debugEnabled) {
      console.log(args);
    }
  }

  ImportReplacePlugin.prototype.apply = function (compiler) {
    compiler.plugin("make", (compilation, callback) => {
      const aotPlugin = getAotPlugin(compilation);
      aotPlugin._program.getSourceFiles()
        .forEach(sf => {
          this.usePlatformUrl(sf)
        });

      callback();
    })
  };

  function getAotPlugin(compilation) {
    let maybeAotPlugin = compilation._ngToolsWebpackPluginInstance;
    if (!maybeAotPlugin) {
      throw new Error(`This plugin must be used with the AotPlugin!`);
    }

    return maybeAotPlugin;
  }

  ImportReplacePlugin.prototype.usePlatformUrl = function (sourceFile) {
    this.setCurrentDirectory(sourceFile);
    forEachChild(sourceFile, node => this.replaceImport(node));
  }

  ImportReplacePlugin.prototype.replaceImport = function (node) {
    if (node.moduleSpecifier) {
      var sourceFile = this.getSourceFileOfNode(node);

      const sourceFileText = sourceFile.text;
      const result = this.checkMatch(sourceFileText);
      if (result.index > -1) {
        this.debug(`------ ImportReplacePlugin webpack plugin ------`);
        this.debug(`result.match: ${result.match}`);
        this.debug('result.index: ', result.index);
        this.debug(sourceFileText);

        var platformSuffix = "." + this.platform;
        this.debug('adding platform suffix: ', platformSuffix);
        var additionLength = platformSuffix.length;
        var escapeAndEnding = 2; // usually "\";" or "\';"
        var remainingStartIndex = result.index + (result.match.length - 1) + (platformSuffix.length - 1) - escapeAndEnding;

        sourceFile.text =
          sourceFileText.substring(0, result.index) +
          result.match +
          platformSuffix +
          sourceFileText.substring(remainingStartIndex)

        node.moduleSpecifier.end += additionLength;

        this.debug(`Import replaced with:`);
        this.debug(sourceFile.text);
      }
    }
  }

  ImportReplacePlugin.prototype.getSourceFileOfNode = function (node) {
    while (node && node.kind !== SyntaxKind.SourceFile) {
      node = node.parent;
    }
    return node;
  }

  ImportReplacePlugin.prototype.setCurrentDirectory = function (sourceFile) {
    this.currentDirectory = resolve(sourceFile.path, "..");
  }

  ImportReplacePlugin.prototype.checkMatch = function (text) {
    let match = '';
    let index = -1;
    this.files.forEach(name => {
      const matchIndex = text.indexOf(name);
      if (matchIndex > -1) {
        match = name;
        index = matchIndex;
      }
    });
    return { match, index };
  }

  return ImportReplacePlugin;
})();
