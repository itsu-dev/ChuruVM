import {Unzipped} from "fflate";

export type Manifest = {
    key: string,
    value: string
}

export type JarFile = {
    manifest: {[key: string]: string},
    unzipped: Unzipped
}