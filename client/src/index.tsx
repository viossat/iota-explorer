import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, RouteComponentProps } from "react-router-dom";
import App from "./app/App";
import { AppProps } from "./app/AppProps";
import { AppRouteProps } from "./app/AppRouteProps";
import { ServiceFactory } from "./factories/serviceFactory";
import { PaletteHelper } from "./helpers/paletteHelper";
import "./index.scss";
import { IConfiguration } from "./models/config/IConfiguration";
import { ApiClient } from "./services/apiClient";
import { CurrencyService } from "./services/currencyService";
import { LocalStorageService } from "./services/localStorageService";
import { MilestonesClient } from "./services/milestonesClient";
import { SettingsService } from "./services/settingsService";
import { TransactionsClient } from "./services/transactionsClient";

const configId = process.env.REACT_APP_CONFIG_ID || "local";
// tslint:disable-next-line: non-literal-require no-var-requires
const config: IConfiguration = require(`./assets/config/config.${configId}.json`);

PaletteHelper.setPalette(config.networks[0].palette);

registerServices();

ReactDOM.render(
    (
        <BrowserRouter>
            <Route
                exact={true}
                path="/:network?/:hashType?/:hash?"
                component={(props: RouteComponentProps<AppRouteProps> & AppProps) => (
                    <App configuration={config} {...props} />)}
            />
        </BrowserRouter>
    ),
    document.getElementById("root")
);

/**
 * Register all the services.
 */
function registerServices(): void {
    ServiceFactory.register("local-storage", () => new LocalStorageService());
    ServiceFactory.register("settings", () => new SettingsService());
    ServiceFactory.register("currency", () => new CurrencyService(config.apiEndpoint));
    ServiceFactory.register("api-client", () => new ApiClient(config.apiEndpoint));

    for (const netConfig of config.networks) {
        ServiceFactory.register(
            `transactions-${netConfig.network}`,
            serviceName => {
                const networkConfig = config.networks
                    .find(n => n.network === serviceName.substring(13));

                if (networkConfig) {
                    return new TransactionsClient(config.apiEndpoint, networkConfig);
                }
            }
        );

        ServiceFactory.register(
            `milestones-${netConfig.network}`,
            serviceName => {
                const networkConfig = config.networks
                    .find(n => n.network === serviceName.substring(11));

                if (networkConfig) {
                    return new MilestonesClient(networkConfig);
                }
            }
        );
    }
}
