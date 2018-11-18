# ETC_EOS_LIGHTS_REDESIGN
This is a redesign of my original project ETC_EOS_LIGHTS which uses the vue framework for frontend development and be designed to scale much better than the original project. It is based on plugins that run in the node process, and register UI componenents as SFC vue files through an EventEmitter used as a global message bus. I use yarn for its workspaces to manage plugin dependencies.

# Building
I use gulp for testing, packaging, and building now.

```gulp```
This script is for testing. It compiles all of the source files, applies code beacons (compile-time expressions) in development mode, and outputs to ```out/``` with inline sourcemaps, ready to be used with your IDE's integrated debugger or chrome's inspector.

```gulp package```
This script is for packaging for the current system. It compiles all of the source files, applies code beacons (compile-time expressions) in production mode, transforms file paths to work after condensing into the build folder, downloads the current production version of electron, and installs production dependencies for the app.
