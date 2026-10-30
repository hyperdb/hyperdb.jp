import type { Content } from "@/types/Content";
import { formatDateTime } from "@/utils/date";
import { Link as ChakraLink, Badge, HStack, Separator, Text } from "@chakra-ui/react";
import { Link } from "wouter";

interface Props {
    content: Content;
    showTags: boolean;
}

const ContentFooter = ({ content, showTags }: Props) => {
    return (
        <>
            <Separator mb={4} />
            {showTags && content.tags.length > 0 && (
                <HStack gap={2} mb={3} wrap="wrap">
                    {content.tags.map((tag) => (
                        <Badge key={tag.key} asChild>
                            <ChakraLink asChild>
                                <Link href={`/blog/tag/${tag.key}`}>{tag.tag}</Link>
                            </ChakraLink>
                        </Badge>
                    ))}
                </HStack>
            )}
            <HStack gap={4} color="fg.muted" fontSize="sm" wrap="wrap">
                <Text>作成日時: {formatDateTime(content.created_at)}</Text>
                <Text>更新日時: {formatDateTime(content.updated_at)}</Text>
            </HStack>
        </>
    );
};
export default ContentFooter;
