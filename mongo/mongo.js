/**
 * Created by zhengjunling on 2016/11/25.
 */

var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
var db = mongoose.connect('10.33.31.234/xx', function (err) {
    if (err) {
        console.log(err);
    }
    console.log("Connect to mongoDB success!");
});

module.exports = db;
