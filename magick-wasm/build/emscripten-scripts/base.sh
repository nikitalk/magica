#!/bin/bash

# This file is auto-generated from src/templates

export PREFIX="$PWD/emscripten_prefix"

export CPPFLAGS="-I$PREFIX/include -I$PREFIX/include/freetype2"

export EMCC_FLAGS_DEBUG="-s ASSERTIONS=2 -s SAFE_HEAP=1 -s ALIASING_FUNCTION_POINTERS=0 -s DISABLE_EXCEPTION_CATCHING=0 -s NODEJS_CATCH_EXIT=1 -g -s FS_LOG=1"

# export EMCC_DEBUG=1

export EMCC_FLAGS_PRODUCTION="-O3 --llvm-lto 1 -fno-rtti -fno-exceptions -s DISABLE_EXCEPTION_CATCHING=1 -s NODEJS_CATCH_EXIT=0 -s ASSERTIONS=0"

export EMCC_FLAGS=$EMCC_FLAGS_PRODUCTION

export LDFLAGS="-L$PREFIX/lib"

export PKG_CONFIG_PATH="$PREFIX/lib/pkgconfig"

export CFLAGS="$CPPFLAGS -s BINARYEN_TRAP_MODE=clamp -s ALLOW_MEMORY_GROWTH=1 -Wno-almost-asm -s ERROR_ON_UNDEFINED_SYMBOLS=1 -Werror=implicit-function-declaration $EMCC_FLAGS"

export CXXFLAGS="$CFLAGS"

export QUANTUM_DEPTH=16 

export HDRI=yes

export CURRENT_DIR=$PWD

testExitCode () {
  name=$1
  exitCode=$2
  echo "
    ******** $name exit code: $exitCode *******
  "
  if [ "$exitCode" -ne "0" ]; then
    exit 1
  fi
}

export -f testExitCode