import axios from 'axios';

/**
 * @desc Resolves a resource path to a full URL
 * @param resource - The API resource path
 * @returns The complete URL
 */
export function resolveUrl(resource: string): string {
    const baseUrl = 'http://localhost:4001/';
    return baseUrl + resource;
}

/**
 * @desc Fetches data from a given resource and returns it
 * @param resource - The API resource path
 * @returns Promise containing the response data
 */
export async function remoteGet(resource: string): Promise<any> {
    let url = resolveUrl(resource);
    let res = await axios.get(url);
    console.log(res.status);
    return res.data;
}

/**
 * @desc Posts data to a given resource
 * @param resource - The API resource path
 * @param data - The data to send in the request body
 * @returns Promise containing the response data
 */
export async function remotePost(resource: string, data: any): Promise<any> {
    let url = resolveUrl(resource);
    let res = await axios.post(url, data);
    console.log(res.status);
    return res.data;
}

/**
 * @desc Deletes a resource
 * @param resource - The API resource path
 * @returns Promise containing the response data
 */
export async function remoteDelete(resource: string): Promise<any> {
    let url = resolveUrl(resource);
    let res = await axios.delete(url);
    console.log(res.status);
    return res.data;
}