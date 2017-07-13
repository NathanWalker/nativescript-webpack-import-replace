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
      var sf = this.getSourceFileOfNode(node);
      var s = node.moduleSpecifier.getStart();
      var e = node.moduleSpecifier.getEnd();

      var additionLength = this.platform.length + 1;
      var replaced = sf.text.substring(s, e - 1) + "." + this.platform + "\"";

      sf.text = 
          sf.text.substring(0, s) +
          replaced +
          sf.text.substring(e)

      node.moduleSpecifier.end += additionLength;

      this.debug(`Import replaced with: ${node.moduleSpecifier.getText()}`);
  }

    ImportReplacePlugin.prototype.getSourceFileOfNode = function (node) {
        while (node && node.kind !== 263 /* SourceFile */) {
            node = node.parent;
        }
        return node;
    }
  
  ImportReplacePlugin.prototype.setCurrentDirectory = function (sourceFile) {
    this.currentDirectory = resolve(sourceFile.path, "..");
  }

  return ImportReplacePlugin;
})();
