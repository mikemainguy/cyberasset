import {AppShell, MantineProvider} from "@mantine/core";
import {theme} from "../theme.ts";
import AdminActions from "../adminActions.tsx";
import Navigation from "../navigation.tsx";
import Diagram from "../diagram.tsx";


export default function AdminPage() {
    return <MantineProvider defaultColorScheme="dark" theme={theme}>
        <AppShell
            header={{height: 80}}
            padding="md">
            <Navigation/>
            <AppShell.Main>
                <AdminActions/>
            </AppShell.Main>
        </AppShell>
    </MantineProvider>
}