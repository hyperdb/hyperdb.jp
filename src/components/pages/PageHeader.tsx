import { Flex, Heading, Stack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface Props {
    title: string;
    description?: string;
    /** 見出しの右側に置くボタンなど */
    actions?: ReactNode;
}

const PageHeader = ({ title, description, actions }: Props) => {
    return (
        <Flex
            justify="flex-end"
            align="center"
            gap="4"
            wrap="wrap"
            mb="6"
            mr={"0.5em"}
        >
            <Stack gap="1" align={"flex-end"}>
                <Heading as="h1" size="3xl">
                    {title}
                </Heading>
                {description && (
                    <Text textStyle={"sm"} color="fg.muted">
                        {description}
                    </Text>
                )}
            </Stack>
            {actions}
        </Flex>
    );
};
export default PageHeader;
