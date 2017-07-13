## ImportReplacePlugin

[NativeScript](https://www.nativescript.org/) webpack plugin to rewrite various imports with the `.ios` or `.android` platform suffix to allow various [Angular](https://angular.io/) Components, Directives, or Pipes to properly AoT compile when building a NativeScript for Angular app.

## Install

```
npm install nativescript-webpack-import-replace --save-dev
```

## Usage

In your app's `webpack.config.js`, add the following:

```
function getPlugins(platform, env) {
    let plugins = [
      ...
      new ImportReplacePlugin({
          debug: true, // optional - outputs results
          platform: platform,
          files: [
              'slider.directive'
          ]
      }),
      ...
```

The `files` collection can be a list of import filenames you'd like replaced with the target platform suffix. The plugin will find the import and add the proper platform ending to the import to allow a proper AoT compile of your NativeScript for Angular app.

### What does this solve?

When using [nativescript-dev-webpack](https://github.com/NativeScript/nativescript-dev-webpack) plugin with NativeScript for Angular project and you are using platform specific Components, Directives or Pipes, you may run into this type of bundling error:

> ERROR in Unexpected value 'CustomDirective in /path/to/YourApp/app/your-folders/custom.directive.d.ts' declared by the module 'YourModule in /path/to/YourApp/app/your-folders/custom.module.ts'. Please add a @Pipe/@Directive/@Component annotation.

In this case, you can add this plugin to your config and designate the name of the import file to adjust to solve the error.

### Learn why this exists?

The development and reason for the creation of this plugin will be featured in an upcoming "NativeScript for Angular" book published via Packt Publishing in the Fall 2017.

### CREDITS

Huge thank you to [Stanimira Vlaeva](https://github.com/sis0k0).

### LICENSE

MIT
