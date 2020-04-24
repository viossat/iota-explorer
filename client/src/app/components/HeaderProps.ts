import { ReactNode } from "react";
import { IClientNetworkConfiguration } from "../../models/config/IClientNetworkConfiguration";

/**
 * The props for the Header component.
 */
export interface HeaderProps {
    /**
     * The current network.
     */
    networkConfig: IClientNetworkConfiguration;

    /**
     * The children elements to display as content.
     */
    children: ReactNode | ReactNode[];
}
