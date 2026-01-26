import axios, { AxiosRequestConfig, AxiosProxyConfig } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import z from 'zod';

// 1. Define your proxies
const proxies: string[] = [];

let proxyIndex = 0;

const authorization = `Bearer ${process.env.FACEIT_API_KEY}`;
const authorizedAxios = axios.create({
    baseURL: 'https://open.faceit.com/data/v4',
    headers: {
        Authorization: authorization,
    },
});

export const requestWrapper = async <S extends z.ZodType>(input: AxiosRequestConfig, schema: S | null, useAuth = true): Promise<z.infer<S>> => {
    // 2. Select the next proxy and create an Agent
    // const proxyUrl = proxies[proxyIndex];
    // proxyIndex = (proxyIndex + 1) % proxies.length;
    // const agent = new HttpsProxyAgent(proxyUrl!);

    // 3. Apply the agent to the config
    const configWithProxy: AxiosRequestConfig = {
        ...input,
        // httpsAgent: agent,
        // proxy: false, // Tell Axios NOT to use its internal proxy logic
    };

    const response = await (useAuth ? authorizedAxios(configWithProxy) : axios(configWithProxy));

    if (!response.status.toString().startsWith('2')) {
        throw new Error(`Failed to fetch with status ${response.status}`);
    }

    if (!schema) {
        return response.data;
    }

    const result = schema.safeParse(response.data);
    if (result.success) {
        return result.data;
    }

    // console.error('Validation Error:', result.error);
    throw new Error('Response validation failed');
};
