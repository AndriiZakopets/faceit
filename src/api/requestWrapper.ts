import z from 'zod';

export const requestWrapper = async <S extends z.ZodType>(url: string, schema: S): Promise<z.infer<S>> => {
    const response = await fetch(url);
    if (!response.ok) {
        const responseText = await response.text();
        console.error(`Response text: ${responseText}`);
        throw new Error(`Failed to fetch with status ${response.status}`);
    }
    const result = schema.safeParse(await response.json());
    if (result.success) {
        return result.data;
    }
    console.log(JSON.stringify(z.treeifyError(result.error), null, 2));
    throw new Error('Response validation failed');
};
