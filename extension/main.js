const locale = 'en-US';
const host = 'https://developer.mozilla.org';

// global variable, Can't rename
const c = new Compat();
const commandManager = new CommandManager(
    new HelpCommand(),
    new UpdateCommand(),
    new HistoryCommand(),
);

const defaultSuggestion = `Search MDN Doc!`;
const omnibox = new Omnibox(defaultSuggestion, c.omniboxPageSize());

let searchMap = staticIndex;
let searchIndex = Util.parseIndex(searchMap);

omnibox.bootstrap({
    onSearch: (query) => {
        const q = query
            .toLowerCase()
            .split(' ')
            .map((s) => s.trim());

        const result = [];
        searchIndex.forEach(([idx, title]) => {
            if (q.every((q) => title.includes(q))) {
                result.push(searchMap[idx]);
            }
        });

        return result;
    },
    onFormat: (index, doc, query) => {
        console.log(doc.title, Util.HighlightMatch(doc.title, query))
        return {
            content: `${host}${doc.url}`,
            description: Util.HighlightMatch(doc.title, query),
        };
    },
    onAppend: (query) => {
        return [
            {
                content: `${host}/${locale}/search?q=${query}`,
                description: `Search ${c.match(query)} on MDN Site`,
            },
        ];
    },
    onEmptyNavigate: (content, disposition) => {
        commandManager.handleCommandEnterEvent(content, disposition);
    },
    afterNavigated: (query, result) => {
        // Ignore the command history
        if (query && query.startsWith(":")) {
            return;
        }

        HistoryCommand.record(query, result, 10);
    },
});

omnibox.addPrefixQueryEvent(":", {
    onSearch: (query) => {
        return commandManager.execute(query);
    },
});

omnibox.addNoCacheQueries(":");


storage.getItem('searchIndex').then(lIndex => {
    if (lIndex) {
        searchMap = JSON.parse(lIndex);
        searchIndex = Util.parseIndex(searchMap);
    } else {
        Util.updateIndex();
    }
});