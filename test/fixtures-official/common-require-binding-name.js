const argv = require("yargs").argv;

module.exports = function() {
  if (argv.binding === "wasm") {
    return "binding_wasm.js";
  }
  if (argv.binding === "asmjs") {
    return "binding.js";
  }
  return "binding.node";
}
