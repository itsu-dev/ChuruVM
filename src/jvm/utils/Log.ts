const log = true;

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
    (document.getElementById("out") as HTMLTextAreaElement).value += `${text}\n`;
}