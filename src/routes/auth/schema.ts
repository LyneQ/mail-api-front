import { z } from 'zod';

export const formSchema = z.object({
	username: z.string().min(3).max(64),
	password: z.string().min(3).max(64)
});

export type FormSchema = typeof formSchema;
