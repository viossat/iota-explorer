import { IIdentityDocument } from "./../identity/IIdentityDocument";
export interface IIdentityDidHistoryResponse {
    integrationChainData?: IntegrationChainData[];
    diffChainData?: unknown[];
    diffChainSpam?: string[];
    integrationChainSpam?: string[];
    error?: string;
}

export interface IntegrationChainData {
    document: IIdentityDocument;
    messageId: string;
}

