require('./crossdomain/build');


var path = require('path');
var webpack = require('webpack');
var root = path.dirname(__dirname);


module.exports = {
    entry: {
        //'request': root + '/src/request.js',
        //'request-iframe': root + '/src/request-iframe.js',
        //'limit': root + '/src/limit.js',
        //'messager': root + '/src/lib/messager.js',
        'crossdomain': root + '/src/crossdomain/crossdomain.js',
        'index': root + '/index.js'
    },
    output: {
        path: `${root}/dist`,
        filename: '[name].js',
        libraryTarget: "umd"
    },    
    plugins: [
        /*
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
        */
    ],
    //debug: true,
    //devtool: 'source-map'
};
