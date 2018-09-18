{
  "include_dirs": ["../include"],
  "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"],
  "cflags_cc": ["-std=c++14"],
  "xcode_settings": {
    "OTHER_CPLUSPLUSFLAGS": ["-std=c++14"]
  },
  "conditions": [[
    "asmjs==1",
    {
      "type": "executable",
      "cflags": [
        "-O2", "-s DEMANGLE_SUPPORT=1", "-s ASSERTIONS=2", "-s SAFE_HEAP=1",
        "-s ALIASING_FUNCTION_POINTERS=0", "--js-library",
        "<!(npm run -s emscripten-js-library-napi-path)"
      ],
      "cflags_cc": ["-std=c++11", "-fno-exceptions"],
      "ldflags": [
        "<@(_cflags)",
        "--memory-init-file",
        "0",
        "-s",
        "PRECISE_F32=1",
        "-s",
        "NO_FILESYSTEM=1",
        "-s RESERVED_FUNCTION_POINTERS=3",
        # "-s EMULATE_FUNCTION_POINTER_CASTS=1",
        "-s EXPORT_FUNCTION_TABLES=1",
        # "-s", "MODULARIZE=1",
        "-s",
        "TOTAL_MEMORY=256MB",
        # "-s", "TOTAL_MEMORY=134217728",
        # "-s", "EXTRA_EXPORTED_RUNTIME_METHODS=[\'ccall\']"
      ],
      "conditions": [[
        "wasm==1", {
          "product_name": "<@(_target_name)_wasm.js",
          "ldflags": ["-s", "WASM=1"]
        }, {
          "product_name": "<@(_target_name).js",
          "ldflags": ["-s", "WASM=0"]
        }
      ]],
      "xcode_settings": {
        "GCC_GENERATE_DEBUGGING_SYMBOLS": "NO",
        "OTHER_CFLAGS": ["<@(_cflags)"],
        "OTHER_CPLUSPLUSFLAGS": ["<@(_cflags_cc)"],
        "OTHER_LDFLAGS": ["<@(_ldflags)"]
      }
    }
  ]]
}