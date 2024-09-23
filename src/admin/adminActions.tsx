import {Button, Card, Code, Group} from "@mantine/core";
import {usePouch} from "use-pouchdb";
import log from "loglevel";
import {useEffect, useState} from "react";

export default function AdminActions() {
    const logger = log.getLogger('AdminActions');
    const db = usePouch();
    const [rows, setRows] = useState([]);
    useEffect(() => {
        db.allDocs({include_docs: true})
            .then((allDocs) => {
                setRows(allDocs.rows);
            });

    }, []);
    const clearAllData = () => {
        db.destroy();
    }
    const renderAllData = () => {

        logger.debug('rows', rows);

        if (!rows || rows.length === 0) {
            return <div>No data</div>
        } else {
            return (
                <>
                    {
                        rows.map((row) => {
                            return (
                                <Card key={row.id}>
                                    <Card.Section>
                                        {row.id}
                                    </Card.Section>
                                    <Card.Section>
                                        <Code block>
                                            {JSON.stringify(row.doc, null, 2)}
                                        </Code>

                                    </Card.Section>
                                </Card>
                            )
                        })
                    }
                </>
            )
        }
    }
    return (
        <>

            <Group>
                <Button onClick={clearAllData} fullWidth>Remove All Data</Button>
            </Group>
            {renderAllData()}
        </>
    );
}