{
  "includes": ["../../common-top.gypi"],
  "targets": [{
    "target_name": "helloworld",
    "sources": ["./helloworld.cc"],
    "conditions": [["asmjs==1", {
      "product_name": "helloworld.js",
    }]],
    "includes": ["../../default-test-target.gypi"]
  }]
}
