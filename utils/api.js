const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const GET = 'get';
const POST = 'post';
const FETCH_CONFIG = {
    mode: 'cors',
    headers: {
        Accept: 'application/json'
    },
    cache: 'no-cache',
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
}
const replaceUrlData = (url, urlData) => {
    return Object.entries(urlData).reduce( (href, [key, value]) =>  href.replace(`:${key}`, value), url.href);
}
const endpointToApi = (api, [name, { url, methods }] ) => ({ ...api,
    [name]: methods
        .reduce(( options, method ) => ({ ...options,
            [method]: async ({postData = {}, urlData = {}} = {}) =>
                await fetch(
                    replaceUrlData(url, urlData),
                    {
                        ...FETCH_CONFIG,
                        headers: {
                            ...FETCH_CONFIG.headers,
                            // Token: pwd
                        },
                        method: 'POST',
                        body: JSON.stringify(postData)
                    }
                ).then(
                    res => res.json()
                )
        }), {})
});
const reduceEndpointsToApis = (endpoints) => {
    return Object.entries(endpoints).reduce( endpointToApi, {});
}
const endpoint = (url, methods = [GET, POST]) => {
    return {
        url: new URL(url, API_BASE_URL),
        methods: methods
    };
}
const endpoints = {
    confession: endpoint('confess', [POST]),
    confessions: endpoint('confessions', [GET]),
    reaction: endpoint('confess/:id', [GET, POST]),
    handle: endpoint('confession/handle', [GET]),
}
const apis = reduceEndpointsToApis(endpoints);
export default apis;
