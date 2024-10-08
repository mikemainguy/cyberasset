import "@mantine/core/styles.css";
import "./global.css";
import React from "react";

import ReactDOM from "react-dom/client";

import {Provider} from "use-pouchdb";
import {data} from "./data.ts";
import {RouterProvider} from "react-router-dom";
import {Auth0Provider} from "@auth0/auth0-react";
import {webRouter} from "./webRouter.tsx";
import log from "loglevel";


const components = data();

log.default.setLevel('debug', false);
//log.getLogger('SolutionFlowDiagram').setLevel('debug', false);
//log.getLogger('deleteFlowstep').setLevel('debug', false);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider
            default="components"
            databases={{
                components: components
            }}>
            <Auth0Provider
                domain="dev-g0lt18ndbcp6earr.us.auth0.com"
                clientId="sxAJub9Uo2mOE7iYCTOuQGhppGLEPWzb"
                authorizationParams={{
                    redirect_uri: window.location.origin
                }}>
                <RouterProvider router={webRouter}>
                </RouterProvider>
            </Auth0Provider>
        </Provider>
    </React.StrictMode>
);
