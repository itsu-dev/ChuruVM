import {ByteBuffer} from "./utils/ByteBuffer.js";
import {Throwable} from "./lib/java/lang/Throwable.js";
import RuntimeDataArea from "./core/rda/RuntimeDataArea.js";
import ClassFileLoader from "./core/cfl/ClassFileLoader.js";
import {unzip, Unzipped} from "fflate";
import {JarFile} from "./models/JarFile";
import {ClassFile} from "./core/cfl/ClassFile";

export class JVM {

    buffer: ByteBuffer;
    runtimeDataArea: RuntimeDataArea;
    jvmArgs: {};
    args: [];
    static loadedJars: JarFile[] = [];

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

        if (this.isClassFile()) {
            this.processClassFile();
        } else {
            await this.processJarFile();
        }
    }

    isClassFile(): boolean {
        let magic = this.buffer.getUint32();
        this.buffer.offset = 0;
        return magic == 0xCAFEBABE;
    }

    processClassFile() {
        const classFile = ClassFileLoader.loadClassFile(".", this.buffer);
        console.log(classFile);
        this.runtimeDataArea
            .createThread(this.jvmArgs["Xss"])
            .then(thread => thread.invokeMethod("main", classFile, this.args));
    }

    async processJarFile() {
        this.buffer.offset = 0;
        unzip(new Uint8Array(this.buffer.view.buffer), ((err, data) => {
            let manifest = JVM.loadManifest(data);
            let mainClass = manifest["Main-Class"];
            this.buffer = new ByteBuffer(data[mainClass.replaceAll(".", "/") + ".class"].buffer);
            JVM.loadedJars.push({
                manifest: manifest,
                unzipped: data
            });

            const classFile = ClassFileLoader.loadClassFile(mainClass.replaceAll(".", "/"), this.buffer);
            console.log(classFile);
            this.runtimeDataArea
                .createThread(this.jvmArgs["Xss"])
                .then(thread => thread.invokeMethod("main", classFile, this.args));
        }));
    }

    static getClassFile(path: string): ClassFile | null {
        if (!(ClassFileLoader.loadedClassFiles[path] == null)) {
            return ClassFileLoader.loadedClassFiles[path];
        }

        for (let jarFile of JVM.loadedJars) {
            if (!(jarFile.unzipped[path + ".class"] == null)) {
                return ClassFileLoader.loadClassFile(path, new ByteBuffer(jarFile.unzipped[path + ".class"].buffer));
            }
        }
        return null;
    }

    static loadManifest(data: Unzipped) {
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
