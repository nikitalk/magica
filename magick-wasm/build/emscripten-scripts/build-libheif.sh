#!/bin/bash

# This file is auto-generated from src/templates

source emscripten-scripts/base.sh

HEIF_HACK="true"

mkdir -p $PREFIX/src
cd $PREFIX/src

if [ ! -d "libheif" ]; then
  git clone https://github.com/ImageMagick/libheif.git  
fi

cd libheif

CFLAGS_NEW="-Wno-error=macro-redefined -Wno-error=c++11-extensions"
export CFLAGS=$(echo "$CFLAGS $CFLAGS_NEW" | sed "s/-fno-rtti -fno-exceptions//") # error: cannot use dynamic_cast with -fno-rtti
export CXXFLAGS="$CFLAGS"
export SIMD_OPTIONS="-DWITH_SIMD=0"
export CONDITIONAL_DISABLE_SHARED="--disable-shared"
export HEIF_HACK=true

autoreconf -fiv

chmod +x ./configure

#--disable-shared --enable-static --disable-libfuzzer --disable-openmp --without-threads --disable-go --disable-gdk-pixbuf --disable-multithreading 


emconfigure ./configure --prefix=$PREFIX --disable-shared --disable-go \
  CFLAGS="$CFLAGS" CXXFLAGS="$CFLAGS"  CPPFLAGS="$CFLAGS"  PKG_CONFIG_PATH="$PKG_CONFIG_PATH"

if [ "$HEIF_HACK" = "true" ]; then
  for f in examples/*.cc; do echo "" > $f; done
fi
testExitCode "libheif configure" $?

emcmake   make install  
testExitCode "libheif make install" $?

testExitCode "libheif configure" $?

#emcmake make install
#testExitCode "libheif make install" $?