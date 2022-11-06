class HelpCommand extends Command {
    constructor() {
        super("update", "Update index from MDN.");
    }

    onExecute(arg) {
        const value = [
            `Prefix ${c.match(":")} to execute command (:help, :update and :history, etc)`,
        ];
        return this.wrap(value);
    }
}