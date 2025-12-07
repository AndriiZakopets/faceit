import axios, { AxiosRequestConfig } from 'axios';
import z from 'zod';

type Callback = () => Promise<Response>;
type Input = string | Callback;

const apiKey = '0f4d171d-b693-4cc7-8a2e-aed4988b83a1';
const authorization = `Bearer ${apiKey}`;
const authorizedAxios = axios.create({
    baseURL: 'https://open.faceit.com/data/v4',
    headers: {
        Authorization: authorization,
    },
});

export const requestWrapper = async <S extends z.ZodType>(input: AxiosRequestConfig, schema: S): Promise<z.infer<S>> => {
    const response = await authorizedAxios(input);
    if (!response.status.toString().startsWith('2')) {
        console.error(`Response error: ${response.data}`);
        throw new Error(`Failed to fetch with status ${response.status}`);
    }
    const result = schema.safeParse(response.data, { reportInput: true });
    if (result.success) {
        return result.data;
    }
    console.log(JSON.stringify(z.treeifyError(result.error), null, 2));
    throw new Error('Response validation failed');
};
