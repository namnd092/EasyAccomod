import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { pageFromParams } from '../../page/HomePage/searchFilters';
import { notifyError } from '../../helper/notify';

// One paged list whose page is kept in the URL under `param` (none for the first page), so each list of a page
// keeps its own page across a refresh and the back button. Other parameters of the URL are left alone.
//
// `load(page)` fetches a page and answers { items, maxPage }. It is called again when the page changes, when
// `queryKey` changes (a different filter) and on `reload()`. A page past the end is replaced in the URL by
// the last page that exists.
export function usePagedList({ param = 'page', queryKey = '', load }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = pageFromParams(searchParams, param);
    const showPage = (nextPage, options) =>
        setSearchParams((current) => {
            const next = new URLSearchParams(current);
            if (nextPage > 1) next.set(param, String(nextPage));
            else next.delete(param);
            return next;
        }, options);
    const setPage = (nextPage) => showPage(nextPage);
    const showExistingPage = React.useEffectEvent((existingPage) => showPage(existingPage, { replace: true }));
    const fetchPage = React.useEffectEvent((pageToLoad) => load(pageToLoad));

    const [items, setItems] = React.useState([]);
    const [maxPage, setMaxPage] = React.useState(1);
    const [reloads, setReloads] = React.useState(0);
    React.useEffect(() => {
        let ignore = false;
        async function run() {
            try {
                const response = await fetchPage(page);
                if (ignore) return;
                // A page past the end comes back empty but still says how many pages there are.
                if (page > 1 && response.items.length === 0) {
                    showExistingPage(Math.max(1, Math.min(page - 1, response.maxPage)));
                    return;
                }
                setItems(response.items);
                setMaxPage(response.maxPage);
            } catch (error) {
                if (ignore) return;
                setItems([]);
                notifyError(error);
            }
        }
        run();
        return () => {
            ignore = true;
        };
    }, [page, queryKey, reloads]);

    return { items, page, setPage, maxPage, reload: () => setReloads((n) => n + 1) };
}
