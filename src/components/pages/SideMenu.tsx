import { MENU_ITEMS } from "@/lib/constant";
import type { MenuItem } from "@/types/Menu";
import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { FaLink } from "react-icons/fa6";
const SideMenu = () => {
    return (
        <Flex direction={"column"}>
            {MENU_ITEMS.map((item: MenuItem) => (
                <Box padding={"0.5em 0"}>
                    <Flex justify={"flex-end"} align={"center"} gap={2}>
                        <Link href={item.path}>
                            <Text textStyle={"md"}>{item.title}</Text>
                        </Link>
                        <FaLink />
                    </Flex>
                </Box>
            ))}
        </Flex>
    );
};
export default SideMenu;
