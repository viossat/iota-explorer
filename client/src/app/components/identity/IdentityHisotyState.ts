import { IIdentityDIDHistoryResponse } from "../../../models/api/IIdentityDIDHistoryResponse";

export interface IdentityHistoryState {

    // if history data are already loaded from Server.
    historyLoaded: boolean;

    // MessageId of the selected item of the tree.
    selectedMessageId?: string;

    // The history data if resolved from Server.
    resolvedHistory?: IIdentityDIDHistoryResponse | undefined;

    // The content of the selected integration of diff message.
    contentOfSelectedMessage?: unknown;

    // if history request is in progress.
    loadingHistory: boolean;

    // if error during history resolution.
    error: string | undefined;
}
