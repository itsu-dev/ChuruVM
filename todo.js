const image = document.getElementById("loading");
fetch("./todo.jar").then((data) => {
    data.arrayBuffer().then(array => {
        const jvmArgs = {
            Xss: 100
        }
        const jvm = new JVM(new Uint8Array(array), "todo.jar", jvmArgs, [], () => {
            image.style.display = "none";
        });
        jvm.launch();
    });
});