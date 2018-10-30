#!/bin/sh
webpack --config webpack.dev.server.js > dev_build.log
webpack --config webpack.dev.js --watch >> dev_build.log
