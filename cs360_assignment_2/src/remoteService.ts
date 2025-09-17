import axios from 'axios'

/**
 * @desc Fetches data from a given url and returns it
 * @param resource
 */
export async function remoteGet(resource:string) {
    let url = resolveUrl(resource);
    let res = await axios.get(url);
    console.log(res.status);
    return res.data;
}

export function resolveUrl(resource: string) {
    const baseUrl = 'http://localhost:4001/';
    return baseUrl + resource;

}