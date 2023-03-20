const log = false;

export const logMethod = (tag: string, className: string, methodName) => {
    if (log) {
        // logText(`[${tag}] ${className}#${methodName}`);
        console.log(`[${tag}] ${className}#${methodName}`);
    }
}

export const logClass = (tag: string, className) => {
    if (log) {
        console.log(`[${tag}] ${className}`);
    }
}

const logText = (text) => {
    if (document.getElementById("out"))
        (document.getElementById("out") as HTMLTextAreaElement).value += `${text}\n`;
}