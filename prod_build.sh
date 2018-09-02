#!/bin/sh
webpack --config webpack.prod.server.js > prod_build.log
webpack --config webpack.prod.js >> prod_build.log
