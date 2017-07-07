const { forEachChild, SyntaxKind } = require("typescript");
const { existsSync } = require("fs");
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
        .forEach(sf => this.usePlatformUrl(sf));

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
    forEachChild(sourceFile, node => this.traverseImports(node));
  }

  ImportReplacePlugin.prototype.setCurrentDirectory = function (sourceFile) {
    this.currentDirectory = resolve(sourceFile.path, "..");
  }

  ImportReplacePlugin.prototype.traverseImports = function (node) {
    if (node.kind !== SyntaxKind.ImportDeclaration) {
      return;
    }

    const nodeText = node.getText();

    if (this.isMatchingImport(nodeText).length) {
      this.debug(`found: ${nodeText}`);
      this.replaceImport(node);
    }
  }

  ImportReplacePlugin.prototype.isMatchingImport = function (nodeText) {
    return this.files.filter(name => nodeText.indexOf(name) > -1);
  }

  ImportReplacePlugin.prototype.replaceImport = function (node) {
    const nodeText = node.getText();
    let endingQuote = "\"";
    let endingQuoteIndex = nodeText.indexOf(endingQuote);
    if (endingQuote === -1) {
      // single quote
      endingQuote = "'";
      endingQuoteIndex = nodeText.indexOf(endingQuote);
    }
    const prefix = nodeText.slice(0, endingQuoteIndex);

    node.text = `${prefix}.${this.platform}${endingQuote}`;
    this.debug(`Import replaced with: ${node.text}`);
  }

  return ImportReplacePlugin;
})();
