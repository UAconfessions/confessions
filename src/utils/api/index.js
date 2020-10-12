const API_BASE_URL = new URL('https://confessions.link/api/');
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

const searchEncode = obj => {
    const paramString = Object.entries(obj)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    if(!paramString) return '';
    const uri = `?${paramString}`;
    return encodeURI(uri);
};
const bodyEncode = obj => {
    return Object.entries(obj)
        .reduce((formData, [key, value]) => {
            formData.append(key, JSON.stringify(value));
            return formData;
        }, new FormData());
};
const endpointToApi = (api, [name, {url /* ,methods */}] ) => {
    api[name] = {
        get: (urlData = {}, success = (res) => {if(!res) throw res}, fail = (e) => {console.log(e)}, pwd = '') => {
            url.search = searchEncode(urlData);
            fetch(url, {
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
        post: (postData = {}, success = (res) => {if(!res) throw res}, fail = (e) => {console.log(e)}, pwd = '') => {
            fetch(url, {
                ...FETCH_CONFIG,
                headers: {
                    ...FETCH_CONFIG.headers,
                    Token: pwd
                },
                method: 'POST',
                body: bodyEncode(postData)
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
    confession: endpoint('confession/'),
    handle: endpoint('confession/handle/'),
    image: endpoint('image/')
}
const apis = reduceEndpointsToApis(endpoints);
export default apis;
