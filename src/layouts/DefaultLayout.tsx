import Footer from "@/components/pages/Footer";
import Header from "@/components/pages/Header";
import Meta, { type MetaProps } from "@/components/pages/Meta";
import { Container, Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
    meta?: MetaProps;
}

const DefaultLayout = ({ children, meta }: Props) => {
    return (
        <Flex direction="column" minH="100dvh">
            <Meta {...meta} />
            <Header />
            <Container as="main" maxW="5xl" flex="1" px={6} py={10}>
                {children}
            </Container>
            <Footer />
        </Flex>
    );
};
export default DefaultLayout;
