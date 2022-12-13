"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jvm_js_1 = require("./jvm/jvm.js");
var todo = function () {
    var image = document.getElementById("loading");
    fetch("/jvm-on-typescript/lib/java-dom-api.jar").then(function (data) {
        data.arrayBuffer().then(function (array) {
            var jvmArgs = {
                Xss: 100
            };
            var jvm = new jvm_js_1.JVM(new Uint8Array(array), "java-dom-api.jar", jvmArgs, [], function () {
                image.style.display = "none";
            });
            jvm.launch();
        });
    });
};
var index = function () {
    var reader = new FileReader();
    var fileInput = document.getElementById("file_input");
    fileInput.onchange = function () {
        reader.readAsArrayBuffer(fileInput.files[0]);
    };
    reader.onload = function () {
        var jvmArgs = {
            Xss: 100
        };
        var jvm = new jvm_js_1.JVM(new Uint8Array(reader.result), fileInput.files[0].name, jvmArgs, [], function () { });
        jvm.launch();
    };
};
window.onload = function () {
    index();
    //todo();
};
//# sourceMappingURL=main.js.map