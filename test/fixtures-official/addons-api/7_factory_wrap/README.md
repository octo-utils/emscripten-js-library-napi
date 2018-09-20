## test/../7_factory_wrap

该测试来自于 https://github.com/nodejs/node/tree/v8.12.0/test/addons-napi/7_factory_wrap .

由于以下原因, 所以对原测试用例进行了一定修改。

## comment

因为javascript不能判断一个javascript值何时会被垃圾回收机制销毁。所以当编译为asm.js时，对于`napi_wrap`里面`finalize_cb`回调将不会被调用。对于这种情况，建议在原生代码一侧定义一个方法在合适时机手动销毁原生对象，以释放asm.js虚拟机内内存。

since javascript can't detect the garbage collection of `javascript value`. 
so the `finalize_cb` in `napi_wrap` would never call while compiled to `asm.js`. 
to destruct `native value` the you can provid a method in native side to manually destruct the `native value`.


