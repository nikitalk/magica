#!/bin/bash
# This file is auto-generated from src/templates
source emscripten-scripts/base.sh

mkdir -p $PREFIX/src
cd $PREFIX/src

if [ ! -d "zlib" ]; then
  git clone https://github.com/ImageMagick/zlib.git
else
  ( cd zlib ; make clean )
fi

cd zlib

chmod a+x ./configure
export CHOST=emcc && emconfigure ./configure --prefix=$PREFIX --static 
testExitCode "zlib configure" $?

emcmake make install CFLAGS="$CFLAGS"
testExitCode "zlib make install" $?
