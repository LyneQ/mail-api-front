export interface Message {
	id: string;
	from: string;
	to: string[];
	subject: string;
	date: string;
	labels: string[];
}
