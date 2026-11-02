import Footer from "@/components/pages/Footer";
import Header from "@/components/pages/Header";
import { Container, Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

/** META情報を持たないレイアウト。META は記事取得後に ContentView が出力する */
const BlogLayout = ({ children }: Props) => {
    return (
        <Flex direction="column" minH="100dvh">
            <Header />
            <Container as="main" maxW="5xl" flex="1" px={6} py={10}>
                {children}
            </Container>
            <Footer />
        </Flex>
    );
};
export default BlogLayout;
