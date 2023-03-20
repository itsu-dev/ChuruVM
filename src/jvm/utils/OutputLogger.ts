export class OutputLogger {
    private static logger: Logger = new class {
        log(text: string) {
            if (document.getElementById("out"))
                (document.getElementById("out") as HTMLDivElement).innerHTML += `<span>${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}<br /></span>`;
        }

        write(char: string) {
            if (char !== "\n") {
                if (document.getElementById("out"))
                    (document.getElementById("out") as HTMLDivElement).innerHTML += `<span>${char.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`;
            } else {
                if (document.getElementById("out"))
                    (document.getElementById("out") as HTMLDivElement).innerHTML += "<br />";
            }
        }

        error(text: string) {
            if (document.getElementById("out"))
                (document.getElementById("out") as HTMLDivElement).innerHTML += `<span style='color: red;'>${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}<br /></span>`;
        }
    };

    static setLogger(logger: Logger) {
        this.logger = logger;
    }

    static write(char: string) {
        this.logger.write(char);
    }

    static log(text: string) {
        this.logger.log(text);
    }

    static error(text: string) {
        this.logger.error(text);
    }
}

export interface Logger {

    log(text: string);
    write(char: string);
    error(text: string);

}