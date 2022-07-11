import {ByteBuffer} from "./utils/ByteBuffer.js";
import {Throwable} from "./lib/java/lang/Throwable.js";
import RuntimeDataArea from "./core/rda/RuntimeDataArea.js";
import ClassFileLoader from "./core/cfl/ClassFileLoader.js";
import {unzip} from "fflate";
// import node_zip from "node-zip";
// import AdmZip from "adm-zip";

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

    load() {
        if (!this.buffer) {
            console.error("buffer must not be undefined!");
            return;
        }

        if (this.isClassFile()) {
            this.processClassFile();
        } else {
            this.processJarFile();
        }

    }

    isClassFile(): boolean {
        let magic = this.buffer.getUint32();
        this.buffer.offset = 0;
        return magic == 0xCAFEBABE;
    }

    processClassFile() {
        const classFile = ClassFileLoader.loadClassFile(this.buffer);
        console.log(classFile);
        this.runtimeDataArea
            .createThread(this.jvmArgs["Xss"])
            .then(thread => thread.invokeMethod("main", classFile, this.args));
    }

    processJarFile() {
        this.buffer.offset = 0;
        (async () => {
            await unzip(new Uint8Array(this.buffer.view.buffer), ((err, data) => {
                console.log(data);
            }));
        })();
    }

}

export const throwErrorOrException = (throwable: Throwable) => {
    throwable.printStackTrace()
}
