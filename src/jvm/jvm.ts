import {ByteBuffer} from "./utils/ByteBuffer.js";
import {Throwable} from "./lib/java/lang/Throwable.js";
import RuntimeDataArea from "./core/rda/RuntimeDataArea.js";
import {unzip, Unzipped} from "fflate";
import ClassFile from "./core/cfl/ClassFile";
import BootstrapClassLoader from "./core/BootstrapClassLoader";
import JavaClass from "./core/cfl/JavaClass";
import Thread from "./core/rda/stack/Thread";
import {Thread as JVMThread} from './lib/java/lang/Thread';
import {OutputLogger} from "./utils/OutputLogger";
import {on} from "cluster";

export class JVM {

    buffer: Uint8Array;
    fileName: string
    jvmArgs: {};
    args: [];
    onLaunch: () => void;
    private readonly runtimeDataArea: RuntimeDataArea;

    constructor(array: Uint8Array, fileName: string, jvmArgs: {}, args: [], onLaunch: () => void) {
        this.buffer = array;
        this.fileName = fileName;
        this.jvmArgs = jvmArgs;
        this.args = args;
        this.onLaunch = onLaunch;
        this.runtimeDataArea = new RuntimeDataArea();
    }

    async launch() {
        if (!this.buffer) {
            console.error("buffer must not be undefined!");
            return;
        }

        if (!(this.jvmArgs["logger"] == null)) {
            OutputLogger.setLogger(this.jvmArgs["logger"]);
        }

        await this.loadLibraries();
    }

    async onLibrariesLoad() {
        BootstrapClassLoader.getInstance().setRuntimeDataArea(this.runtimeDataArea);
        if (this.isClassFile()) {
            this.processClassFile();
        } else {
            await this.processJarFile();
        }
    }

    isClassFile(): boolean {
        const buf = new ByteBuffer(this.buffer.buffer);
        let magic = buf.getUint32();
        return magic == 0xCAFEBABE;
    }

    processClassFile() {
        OutputLogger.log(`> java ${this.fileName.replace(".class", "")}`);

        this.runtimeDataArea.loadedClasses[this.fileName.replace(".class", "")] = this.buffer;
        const javaClass = BootstrapClassLoader.getInstance().defineClass(this.fileName.replace(".class", ""), this.buffer);
        this.invokeMain(javaClass);
    }

    async loadLibraries() {
        const libraries: {[key: string]: boolean} = {
            "./lib/rt.jar": false,
            "./lib/java-dom-api.jar": false
        }

        const checkForLibraries = (): boolean => {
            for (let key of Object.keys(libraries)) {
                if (!libraries[key]) return false;
            }
            return true;
        }

        const unzipJar = (key: string, target: Uint8Array) => {
            unzip(target, ((err, data) => {
                let manifest = JVM.loadManifest(data);
                this.runtimeDataArea.loadedJars.push({
                    manifest: manifest,
                    unzipped: data
                });
                libraries[key] = true;
                if (checkForLibraries()) {
                    this.onLibrariesLoad();
                }
                //this.onLibrariesLoad();
            }));
        }

        Object.keys(libraries).forEach(key => {
            fetch(key).then((data) => {
                data.arrayBuffer().then(array => {
                    unzipJar(key, new Uint8Array(array));
                });
            });
        });
    }

    async processJarFile() {
        OutputLogger.log(`> java -jar ${this.fileName}`);

        unzip(new Uint8Array(this.buffer), ((err, data) => {
            let manifest = JVM.loadManifest(data);
            let mainClass = manifest["Main-Class"];
            this.buffer = new Uint8Array(data[mainClass.replaceAll(".", "/") + ".class"].buffer);
            this.runtimeDataArea.loadedJars.push({
                manifest: manifest,
                unzipped: data
            });

            const classFile = BootstrapClassLoader.getInstance().defineClass(mainClass, this.buffer);
            this.invokeMain(classFile);
        }));
    }

    async initializeVM(thread: Thread) {
        await this.runtimeDataArea.registerNatives();

        BootstrapClassLoader.getInstance().findClass("java.lang.Class");
        BootstrapClassLoader.getInstance().findClass("java.net.URLClassLoader");

        const system = BootstrapClassLoader.getInstance().findClass("java.lang.System");
        system.initStatic(thread);

        JVMThread.init(thread);
        
        thread.invokeMethod("initializeSystemClass", "()V", system, []);
        console.log("VM is Booted!")
    }

    invokeMain(classFile: JavaClass) {
        this.runtimeDataArea
            .createThread(this.jvmArgs["Xss"], true)
            .then(thread => {
                (async () => {
                    await this.initializeVM(thread);
                    thread.invokeMethod("main", "([Ljava/lang/String;)V", classFile, this.args);
                    this.onLaunch();
                })();
            });
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
