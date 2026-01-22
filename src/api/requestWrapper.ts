import axios, { AxiosRequestConfig } from 'axios';
import z from 'zod';

const authorization = `Bearer ${process.env.FACEIT_API_KEY}`;
const authorizedAxios = axios.create({
    baseURL: 'https://open.faceit.com/data/v4',
    headers: {
        Authorization: authorization,
    },
});

export const requestWrapper = async <S extends z.ZodType>(input: AxiosRequestConfig, schema: S | null): Promise<z.infer<S>> => {
    const response = await authorizedAxios(input);
    if (!response.status.toString().startsWith('2')) {
        throw new Error(`Failed to fetch with status ${response.status}`);
    }
    if (!schema) {
        return response.data;
    }
    const result = schema.safeParse(response.data, { reportInput: true });
    if (result.success) {
        return result.data;
    }
    throw new Error('Response validation failed');
};
