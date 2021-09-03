export interface IdentityTreeItemProps {
    /**
     * Network name
     */
    network: string;

    /**
     * If item is nested (Diff message, Error Message, No Diffs, Diffs are loading)
     */
    nested?: boolean;

    /**
     * If item is the first in the list (of integration or diffs).
     */
    firstMsg?: boolean;

    /**
     * If item is the last in the list.
     */
    lastMsg?: boolean;

    /**
     * The messageId of the selected message of the tree.
     */
    selectedMessageId: string;

    /**
     * message Id of current message.
     */
    messageId?: string;

    /**
     * Content of current message.
     */
    content?: { created: string; updated: string };

    onItemClick(messageId?: string, content?: unknown): void;
}
