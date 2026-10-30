import type { Content } from "@/types/Content";
import { Box, Link as ChakraLink, Flex, HStack } from "@chakra-ui/react";
import { FaSquare } from "react-icons/fa6";
import { Link } from "wouter";
interface Props {
    item: Content;
    /** 一覧のページ番号（1始まり）。詳細から一覧に戻る際に使用 */
    listPage?: number;
}

const PostListItem = ({ item, listPage }: Props) => {
    return (
        <HStack
            justify="space-between"
            gap="4"
            align={"center"}
            h={"4em"}
            border={"1px solid"}
            borderRadius={"0.5em"}
            margin={"0.5em 0"}
            padding={"1.5em 1em"}
        >
            <Flex align={"center"} gap={2}>
                <FaSquare />
                <ChakraLink asChild>
                    <Link
                        href={
                            listPage && listPage > 1
                                ? `/blog/${item.key}?page=${listPage}`
                                : `/blog/${item.key}`
                        }
                    >
                        {item.title}
                    </Link>
                </ChakraLink>
            </Flex>
            <Box color="fg.muted" whiteSpace="nowrap">
                {item.published_at ?? ""}
            </Box>
        </HStack>
    );
};
export default PostListItem;
