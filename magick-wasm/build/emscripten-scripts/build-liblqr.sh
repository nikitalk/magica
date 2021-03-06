#!/bin/bash
# This file is auto-generated from src/templates
source emscripten-scripts/base.sh

mkdir -p $PREFIX/src
cd $PREFIX/src

if [ ! -d "liblqr" ]; then
  git clone https://github.com/ImageMagick/lqr.git liblqr
else
  ( cd liblqr ; make clean )
fi

cd liblqr

chmod a+x ./configure
emconfigure ./configure --prefix=$PREFIX --disable-shared --enable-static PKG_CONFIG_PATH="$PKG_CONFIG_PATH"
testExitCode "liblqr configure" $?

emcmake make install  
testExitCode "liblqr make install" $?
