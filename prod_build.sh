#!/bin/sh
# webpack --config webpack.prod.js > prod_build.log
# webpack --config webpack.server.js >> prod_build.log
webpack --config webpack.server.js > prod_build.log
