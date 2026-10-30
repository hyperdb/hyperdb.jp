import type { Content, ContentCategory } from "@/types/Content";
import { formatDateTime } from "@/utils/date";
import { Link as ChakraLink, Heading, HStack, Text } from "@chakra-ui/react";
import { Link } from "wouter";

interface Props {
    content: Content;
    category: ContentCategory | null;
}

const ContentTitle = ({ content, category }: Props) => {
    return (
        <>
            <Heading as="h1" size="2xl" mb={3}>
                {content.title}
            </Heading>
            <HStack gap={4} color="fg.muted" fontSize="sm" wrap="wrap">
                <Text>公開日時: {formatDateTime(content.published_at)}</Text>
                {category && (
                    <ChakraLink asChild>
                        <Link href={`/blog/category/${category.key}`}>
                            {category.category}
                        </Link>
                    </ChakraLink>
                )}
            </HStack>
        </>
    );
};
export default ContentTitle;
