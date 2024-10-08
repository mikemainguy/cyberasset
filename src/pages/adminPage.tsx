import {AppShell, MantineProvider} from "@mantine/core";
import {theme} from "../theme.ts";
import AdminActions from "../admin/adminActions.tsx";

export default function AdminPage() {
    return <MantineProvider defaultColorScheme="dark" theme={theme}>
        <AppShell
            header={{height: 80}}
            padding="md">

            <AppShell.Main>
                <AdminActions/>
            </AppShell.Main>
        </AppShell>
    </MantineProvider>
}