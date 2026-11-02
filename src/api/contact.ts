export interface ContactInput {
    name: string;
    email: string;
    subject: string;
    body: string;
}

const CONTACT_API_URL = "https://contacts.hyperdb.cloud/api/v1/contacts";

export const sendContact = async (
    input: ContactInput,
    signal?: AbortSignal,
): Promise<void> => {
    const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: input.name,
            mail: input.email,
            ...(input.subject ? { title: input.subject } : {}),
            content: input.body,
        }),
        signal,
    });
    if (response.status !== 201) {
        throw new Error(`Contact API responded with ${response.status}`);
    }
};
