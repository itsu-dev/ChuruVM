import {JVM} from "./jvm/jvm.js";

const todo = () => {
    const image = document.getElementById("loading");
    fetch("./lib/java-dom-api.jar").then((data) => {
        data.arrayBuffer().then(array => {
            const jvmArgs = {
                Xss: 100
            }
            const jvm = new JVM(new Uint8Array(array), "java-dom-api.jar", jvmArgs, [], () => {
                image.style.display = "none";
            });
            jvm.launch();
        });
    });
}

const index = () => {
    const reader = new FileReader();
    const fileInput = document.getElementById("file_input") as HTMLInputElement;

    fileInput.onchange = () => {
        reader.readAsArrayBuffer(fileInput.files[0])
    }

    reader.onload = () => {
        const jvmArgs = {
            Xss: 100
        }
        const jvm = new JVM(new Uint8Array(reader.result as ArrayBuffer), fileInput.files[0].name, jvmArgs, [], () => {});
        jvm.launch();
    }
}

window.onload = () => {
    index();
    //todo();
}