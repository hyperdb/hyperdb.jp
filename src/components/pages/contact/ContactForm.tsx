import { sendContact } from "@/api/contact";
import { isValidEmail, sanitizeText } from "@/utils/text";
import { Button, Field, Input, Stack, Textarea } from "@chakra-ui/react";
import { useState, type FormEvent } from "react";

const LIMITS = { name: 32, subject: 128, body: 1024 } as const;

type Values = { name: string; email: string; subject: string; body: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { name: "", email: "", subject: "", body: "" };

const validate = (values: Values): Errors => {
    const errors: Errors = {};
    if (!values.name) {
        errors.name = "名前を入力してください";
    } else if (values.name.length > LIMITS.name) {
        errors.name = `${LIMITS.name}文字以内で入力してください`;
    }
    if (!values.email) {
        errors.email = "メールアドレスを入力してください";
    } else if (!isValidEmail(values.email)) {
        errors.email = "メールアドレスの形式が正しくありません";
    }
    if (values.subject.length > LIMITS.subject) {
        errors.subject = `${LIMITS.subject}文字以内で入力してください`;
    }
    if (!values.body) {
        errors.body = "本文を入力してください";
    } else if (values.body.length > LIMITS.body) {
        errors.body = `${LIMITS.body}文字以内で入力してください`;
    }
    return errors;
};

const ContactForm = () => {
    const [values, setValues] = useState<Values>(EMPTY);
    const [errors, setErrors] = useState<Errors>({});
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState<"idle" | "sent" | "failed">("idle");

    const change =
        (field: keyof Values) => (event: { target: { value: string } }) =>
            setValues((prev) => ({ ...prev, [field]: event.target.value }));

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setStatus("idle");

        const cleaned: Values = {
            name: sanitizeText(values.name).trim(),
            email: sanitizeText(values.email).trim(),
            subject: sanitizeText(values.subject).trim(),
            body: sanitizeText(values.body, true).trim(),
        };
        setValues(cleaned);

        const nextErrors = validate(cleaned);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setIsSending(true);
        try {
            await sendContact(cleaned);
            setStatus("sent");
            setValues(EMPTY);
        } catch (error: unknown) {
            console.error("コンタクトを送信できませんでした。", error);
            setStatus("failed");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <Stack gap={5} maxW="xl">
                <Field.Root required invalid={!!errors.name}>
                    <Field.Label>
                        名前 <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                        value={values.name}
                        onChange={change("name")}
                        maxLength={LIMITS.name}
                        autoComplete="name"
                    />
                    <Field.HelperText>{LIMITS.name}文字以内</Field.HelperText>
                    <Field.ErrorText>{errors.name}</Field.ErrorText>
                </Field.Root>

                <Field.Root required invalid={!!errors.email}>
                    <Field.Label>
                        メールアドレス <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                        type="email"
                        value={values.email}
                        onChange={change("email")}
                        autoComplete="email"
                    />
                    <Field.ErrorText>{errors.email}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.subject}>
                    <Field.Label>件名</Field.Label>
                    <Input
                        value={values.subject}
                        onChange={change("subject")}
                        maxLength={LIMITS.subject}
                    />
                    <Field.HelperText>{LIMITS.subject}文字以内</Field.HelperText>
                    <Field.ErrorText>{errors.subject}</Field.ErrorText>
                </Field.Root>

                <Field.Root required invalid={!!errors.body}>
                    <Field.Label>
                        本文 <Field.RequiredIndicator />
                    </Field.Label>
                    <Textarea
                        rows={8}
                        value={values.body}
                        onChange={change("body")}
                        maxLength={LIMITS.body}
                    />
                    <Field.HelperText>
                        {values.body.length} / {LIMITS.body}文字
                    </Field.HelperText>
                    <Field.ErrorText>{errors.body}</Field.ErrorText>
                </Field.Root>

                <Button type="submit" loading={isSending} alignSelf="flex-start">
                    送信
                </Button>
                {status === "sent" && <p role="status">送信しました</p>}
                {status === "failed" && <p role="alert">送信できませんでした</p>}
            </Stack>
        </form>
    );
};
export default ContactForm;
