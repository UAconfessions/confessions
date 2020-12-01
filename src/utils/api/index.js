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
const endpointToApi = (api, [name, {url /* ,methods */}] ) => {
    api[name] = {
        get: ({urlData = {}, success = (res) => {if(!res) throw res}, fail = (e) => {console.log(e)}, pwd = ''}) => {

            fetch(replaceUrlData(url, urlData), {
                ...FETCH_CONFIG,
                headers: {
                    ...FETCH_CONFIG.headers,
                    Token: pwd
                },
                method: 'GET',
            })
                .then(res=>res.json())
                .then(success)
                .catch(fail);
        },
        post: ({postData = {}, urlData = {}, success = (res) => {if(!res) throw res}, fail = (e) => {console.log(e)}, pwd = ''}) => {

            fetch(replaceUrlData(url, urlData), {
                ...FETCH_CONFIG,
                headers: {
                    ...FETCH_CONFIG.headers,
                    Token: pwd
                },
                method: 'POST',
                body: JSON.stringify(postData)
            })
                .then(res=>res.json())
                .then(success)
                .catch(fail);
        }
    };
    return api;
};
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
    confession: endpoint('confess'),
    reaction: endpoint('confess/:id'),
    handle: endpoint('confession/handle')
}
const apis = reduceEndpointsToApis(endpoints);
export default apis;
