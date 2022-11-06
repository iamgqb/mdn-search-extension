const Util = {
    HighlightMatch: (title, q) => {
        // Split on highlight term and include term into parts, ignore case.
        const words = q.trim().toLowerCase().split(/[ ,]+/);
        // $& means the whole matched string
        const regexWords = words.map((s) =>
            s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        );
        const regex = regexWords.map((word) => `(${word})`).join("|");
        const parts = title.split(new RegExp(regex, "gi"));
    
        return parts
            .map((part) =>
                words.includes(part.toLowerCase()) ? c.match(c.escape(part)) : c.dim(c.escape(part))
            )
            .join("");
    },

    parseIndex: (searchMap) => {
        return searchMap.map(({ title }, i) => [i, title.toLowerCase()]);
    },

    updateIndex: () => {
        return fetch(`${host}/${locale}/search-index.json`)
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