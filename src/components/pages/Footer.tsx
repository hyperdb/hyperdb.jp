import { Box, Container, Flex, Text } from "@chakra-ui/react";

const Footer = () => {
    return (
        <Box as="footer" borderTopWidth="1px">
            <Container maxW="5xl">
                <Flex justify="center" align="center" minH="12">
                    <Text textStyle="sm" color="fg.muted">
                        copyright &copy; 2026
                    </Text>
                </Flex>
            </Container>
        </Box>
    );
};
export default Footer;
