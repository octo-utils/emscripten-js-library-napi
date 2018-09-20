### emscripten-js-library-napi

([N-API](https://nodejs.org/api/n-api.html)) implement for emscripten.

### Build

```bash
npm install --save-dev
npm run gulp -- build # output in lib/library_napi.js
```

### Test Enviroment

to compile native code to `asm.js` or `wasm`, you have to install emscripten tools (`emcc`,`llvm`, etc.), you can install them with [emsdk](http://kripken.github.io/emscripten-site/docs/getting_started/downloads.html).

### Test 

see `./test/fixtures` 

### Related

- [github: RReverser/emnapi](https://github.com/RReverser/emnapi) many implements in `src` comes from this remote.

### Document and Issues

- https://nodejs.org/api/n-api.html

- https://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html

- https://stackoverflow.com/questions/25800382/how-to-write-an-emscripten-shim-for-a-c-library

- https://stackoverflow.com/questions/45387728/calling-a-c-style-function-pointer-in-a-webassembly-from-javascript