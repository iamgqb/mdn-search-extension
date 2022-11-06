class UpdateCommand extends Command {
    constructor() {
        super("update", "Update index from MDN.");

        this.updateParam = '';
    }

    onEnter(content, disposition) {
        if (this.updateParam === 'sync') {
            // sync
            fetch(`${host}/${locale}/search-index.json`)
                .then(res => res.json())
                .then(json => {

                    // !! variable in global
                    searchMap = staticIndex;
                    searchIndex = Util.parseIndex(searchMap);

                    return Promise.all([
                        storage.setItem('searchIndex', JSON.stringify(json)),
                        storage.setItem('updateTime', new Date().getTime())
                    ])
                })
                .then(() => console.log('update index success'))
                .catch(e => console.error('update Error', e));
        }
    }

    onExecute(arg) {
        const splitArgs = arg.split(' ');
        const updateParam = splitArgs[0] ? splitArgs[0].trim() : '';

        if (updateParam === 'sync') {
            this.updateParam = 'sync';

            return [{
                content: this.name,
                description: `Press ${c.match("Enter")} to update search index.`
            }];
        }

        return storage.getItem('updateTime').then(time => {
            const value = [];
            if (time) {
                value.push(`Last Update Time: ${new Date(time)}`);
            }

            value.push(
                `Param ${c.match("sync")} to update search index.`
            );

            return this.wrap(value);
        });
    }
}