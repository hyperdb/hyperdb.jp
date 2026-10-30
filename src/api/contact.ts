export interface ContactInput {
    name: string;
    email: string;
    subject: string;
    body: string;
}

// contact.hyperdb.cloud のAPI仕様が未確定のため、送信処理は未実装
export const sendContact = async (
    _input: ContactInput,
    _signal?: AbortSignal,
): Promise<void> => {
    throw new Error("Contact API is not implemented");
};
