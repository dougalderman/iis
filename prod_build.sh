#!/bin/sh
webpack --config webpack.prod.js > prod_build.log
# babel server -d dist/server >> prod_build.log
