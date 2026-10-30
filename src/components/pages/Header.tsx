import SideDrawer from "@/components/pages/SideDrawer";
import { ColorModeButton } from "@/components/ui/color-mode";
import { SITE_INFO } from "@/lib/constant.ts";
import { Box, Container, Flex, HStack, Text } from "@chakra-ui/react";
import { Link } from "wouter";

const Header = () => {
    return (
        <Box as="header" borderBottomWidth="1px">
            <Container fluid>
                <Flex justify="space-between" align="center" minH="5em">
                    <HStack gap="2">
                        <SideDrawer />
                    </HStack>
                    <Link href={"/"}>
                        <Text textStyle={"md"} fontWeight="bold">
                            {SITE_INFO.title}
                        </Text>
                    </Link>
                    <HStack gap="2">
                        <ColorModeButton />
                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
};
export default Header;
