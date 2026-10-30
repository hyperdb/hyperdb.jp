import SideMenu from "@/components/pages/SideMenu";
import { Button, CloseButton, Drawer, Portal } from "@chakra-ui/react";
import { IoMenu } from "react-icons/io5";

const SideDrawer = () => {
    return (
        <Drawer.Root placement={"start"} size={"xs"}>
            <Drawer.Trigger asChild>
                <Button variant="outline" size="sm">
                    <IoMenu />
                </Button>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner padding="4">
                    <Drawer.Content rounded="md">
                        <Drawer.Header>
                            <Drawer.Title>Content</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <SideMenu />
                        </Drawer.Body>
                        <Drawer.Footer></Drawer.Footer>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
};
export default SideDrawer;
