import axios, { AxiosRequestConfig, AxiosProxyConfig } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import z from 'zod';

// 1. Define your proxies
const proxies = [
    'http://pldabjjo:gDE64grt@142.111.48.253:7030',
    'http://pldabjjo:gDE64grt@23.95.150.145:6114',
    'http://pldabjjo:gDE64grt@198.23.239.134:6540',
    'http://pldabjjo:gDE64grt@107.172.163.27:6543',
    'http://pldabjjo:gDE64grt@198.105.121.200:6462',
    'http://pldabjjo:gDE64grt@64.137.96.74:6641',
    'http://pldabjjo:gDE64grt@84.247.60.125:6095',
    'http://pldabjjo:gDE64grt@216.10.27.159:6837',
    'http://pldabjjo:gDE64grt@23.26.71.145:5628',
    'http://pldabjjo:gDE64grt@23.27.208.120:5830',
];

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
    const proxyUrl = proxies[proxyIndex];
    proxyIndex = (proxyIndex + 1) % proxies.length;
    const agent = new HttpsProxyAgent(proxyUrl!);

    // 3. Apply the agent to the config
    const configWithProxy: AxiosRequestConfig = {
        ...input,
        httpsAgent: agent,
        proxy: false, // Tell Axios NOT to use its internal proxy logic
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
