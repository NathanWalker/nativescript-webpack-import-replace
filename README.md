## ImportReplacePlugin

[NativeScript] webpack plugin to rewrite various imports with the `.ios` or `.android` platform suffix to allow various Angular Components, Directives, or Pipes to properly AoT compile when building a NativeScript for Angular app.

## Usage

In your app's `webpack.config.js`, add the following:

```
function getPlugins(platform, env) {
    let plugins = [
      ...
      new ImportReplacePlugin({
          debug: true, // optional 
          platform: platform,
          files: [
              'slider.directive'
          ]
      }),
      ...
```

The `files` collection can be a list of import names or even the component/directive/pipe names like `SlimSliderDirective` for example. The plugin will find the import and add the proper platform ending to the import to allow a proper AoT compile of your NativeScript for Angular app.

### LICENSE

MIT
