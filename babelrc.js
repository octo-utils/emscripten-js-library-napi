/* Created by tommyZZM.OSX on 2018/7/9. */
"use strict";

module.exports = {
  "presets": [
    [
      "@babel/preset-env", {
        "loose": false,
        "targets": {
          "browsers": ["last 2 versions"]
        },
        "exclude": [
          "transform-typeof-symbol"
        ]
      }
    ]
  ],
  "plugins": [
    "@babel/plugin-proposal-throw-expressions",
    "@babel/plugin-proposal-object-rest-spread"
  ]
}