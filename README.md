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
          platform: platform,
          files: [
              'slider.directive'
          ]
      }),
      ...
```

The `files` collection can be a list of import names or even the component/directive/pipe names like `SlimSliderDirective` for example. The plugin will find the import and add the proper platform ending to the import to allow a proper AoT compile of your NativeScript for Angular app.

### Learn why this exists?

The development and reason for the creation of this plugin will be featured in an upcoming "NativeScript for Angular" book published via Packt Publishing in the Fall 2017.

### LICENSE

MIT
