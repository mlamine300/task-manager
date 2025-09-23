"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
var allowedOrigin_js_1 = require("./allowedOrigin.js");
exports.corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigin_js_1.allowedOrigin.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error("not allowed by CORS"));
        }
    },
    credential: true,
    optionsSuccessStatus: 200,
};
