import {ByteBuffer} from "./utils/ByteBuffer.js";
import {Throwable} from "./lib/java/lang/Throwable.js";
import RuntimeDataArea from "./core/rda/RuntimeDataArea.js";
import ClassFileLoader from "./core/cfl/ClassFileLoader.js";
import {unzip, Unzipped} from "fflate";

export class JVM {

    buffer: ByteBuffer;
    runtimeDataArea: RuntimeDataArea;
    jvmArgs: {};
    args: [];

    constructor(array: ArrayBuffer, jvmArgs: {}, args: []) {
        this.buffer = new ByteBuffer(array);
        this.jvmArgs = jvmArgs;
        this.args = args;
        this.runtimeDataArea = new RuntimeDataArea();
    }

    async load() {
        if (!this.buffer) {
            console.error("buffer must not be undefined!");
            return;
        }

        if (!this.isClassFile()) {
            await this.processJarFile();
        }

        const classFile = ClassFileLoader.loadClassFile(this.buffer);
        console.log(classFile);
        this.runtimeDataArea
            .createThread(this.jvmArgs["Xss"])
            .then(thread => thread.invokeMethod("main", classFile, this.args));

    }

    isClassFile(): boolean {
        let magic = this.buffer.getUint32();
        this.buffer.offset = 0;
        return magic == 0xCAFEBABE;
    }

    async processJarFile() {
        this.buffer.offset = 0;
        unzip(new Uint8Array(this.buffer.view.buffer), ((err, data) => {
            let manifest = this.loadManifest(data);
            console.log(manifest);
            let mainClass = manifest["Main-Class"];
            this.buffer = new ByteBuffer(data[mainClass.replaceAll(".", "/") + ".class"].buffer);
        }));
    }

    loadManifest(data: Unzipped) {
        let manifest = new TextDecoder().decode(data["META-INF/MANIFEST.MF"]);
        let manifestData = {};
        for (const line of manifest.split("\r\n")) {
            let [key, value] = line.split(": ");
            if (!(value == null)) manifestData[key] = value;
        }
        return manifestData;
    }

}

export const throwErrorOrException = (throwable: Throwable) => {
    throwable.printStackTrace()
}
