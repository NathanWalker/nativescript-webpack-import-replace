## ImportReplacePlugin

[NativeScript](https://www.nativescript.org/) webpack plugin to rewrite various imports with the `.ios` or `.android` platform suffix to allow various [Angular](https://angular.io/) Components, Directives, or Pipes to properly AoT compile when building a NativeScript for Angular app.

## Usage

In your app's `webpack.config.js`, add the following:

```
function getPlugins(platform, env) {
    let plugins = [
      ...
      new ImportReplacePlugin({
          debug: true, // optional 
          platform: platform
      }),
      ...
```

### LICENSE

MIT
