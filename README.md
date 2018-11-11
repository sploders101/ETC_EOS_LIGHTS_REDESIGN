# ETC_EOS_LIGHTS_REDESIGN
This will be a redesign of my original project ETC_EOS_LIGHTS, which will use the vue framework for frontend development and be designed to scale much better than the original project

# Building
After packaging, you will need to cd into the serial-port module and run ```node-gyp rebuild --target=8.12.0```. For some reason, electron-forge doesn't compile against the right node version.