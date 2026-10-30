import { Box, Flex, Heading } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";
interface Props {
    title: string;
}

const ComponentHeader = ({ title }: Props) => {
    return (
        <Box marginBottom={"1.5em"}>
            <Heading size={"xl"}>
                <Flex align={"center"} gap={2}>
                    <FaCheck />
                    {title}
                </Flex>
            </Heading>
        </Box>
    );
};
export default ComponentHeader;
