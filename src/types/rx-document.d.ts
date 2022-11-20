import {
    Observable,
    BehaviorSubject
} from 'rxjs';

import {
    RxCollection,
} from './rx-collection';
import {
    RxAttachment,
    RxAttachmentCreator
} from './rx-attachment';
import { RxDocumentData } from './rx-storage';
import { RxChangeEvent } from './rx-change-event';
import { DeepReadonly, PlainJsonValue } from './util';
import { UpdateQuery } from './plugins/update';
import { CRDTEntry } from './plugins/crdt';

export type RxDocument<RxDocumentType = {}, OrmMethods = {}> = RxDocumentBase<RxDocumentType, OrmMethods> & RxDocumentType & OrmMethods;

declare type AtomicUpdateFunction<RxDocumentType> = (
    doc: RxDocumentData<RxDocumentType>,
    rxDocument: RxDocument<RxDocumentType>
) => RxDocumentType | Promise<RxDocumentType>;

/**
 * Meta data that is attached to each document by RxDB.
 */
export type RxDocumentMeta = {
    /**
     * Last write time.
     * Unix epoch in milliseconds.
     */
    lwt: number;

    /**
     * Any other value can be attached to the _meta data.
     * Mostly done by plugins to mark documents.
     */
    [k: string]: PlainJsonValue;
};

export declare interface RxDocumentBase<RxDocType, OrmMethods = {}> {
    isInstanceOfRxDocument: true;
    collection: RxCollection<RxDocType, OrmMethods>;
    readonly deleted: boolean;

    readonly $: Observable<DeepReadonly<any>>;
    readonly deleted$: Observable<boolean>;

    readonly primary: string;
    readonly allAttachments$: Observable<RxAttachment<RxDocType, OrmMethods>[]>;

    // internal things
    _dataSync$: BehaviorSubject<DeepReadonly<RxDocType>>;
    _data: RxDocumentData<RxDocType>;
    primaryPath: string;
    revision: string;
    _atomicQueue: Promise<any>;
    $emit(cE: RxChangeEvent<RxDocType>): void;
    _saveData(newData: any, oldData: any): Promise<void>;
    // /internal things

    get$(path: string): Observable<any>;
    get(objPath: string): DeepReadonly<any>;
    populate(objPath: string): Promise<RxDocument<RxDocType, OrmMethods> | any | null>;

    /**
     * mutate the document with a function
     */
    atomicUpdate(mutationFunction: AtomicUpdateFunction<RxDocType>, context?: string): Promise<RxDocument<RxDocType, OrmMethods>>;
    /**
     * patches the given properties
     */
    atomicPatch(patch: Partial<RxDocType>): Promise<RxDocument<RxDocType, OrmMethods>>;

    update(updateObj: UpdateQuery<RxDocType>): Promise<any>;
    updateCRDT(updateObj: CRDTEntry<RxDocType> | CRDTEntry<RxDocType>[]): Promise<any>;
    remove(): Promise<boolean>;
    _handleChangeEvent(cE: any): void;

    // only for temporary documents
    set(objPath: string, value: any): RxDocument<RxDocType, OrmMethods>;
    save(): Promise<boolean>;

    // attachments
    putAttachment(
        creator: RxAttachmentCreator,
        /**
         * If set to true and data is equal,
         * operation will be skipped.
         * This prevents us from upgrading the revision
         * and causing events in the change stream.
         * (default = true)
         */
        skipIfSame?: boolean
    ): Promise<RxAttachment<RxDocType, OrmMethods>>;
    getAttachment(id: string): RxAttachment<RxDocType, OrmMethods> | null;
    allAttachments(): RxAttachment<RxDocType, OrmMethods>[];

    toJSON(withRevAndAttachments: true): DeepReadonly<RxDocumentData<RxDocType>>;
    toJSON(withRevAndAttachments?: false): DeepReadonly<RxDocType>;

    toMutableJSON(withRevAndAttachments: true): RxDocumentData<RxDocType>;
    toMutableJSON(withRevAndAttachments?: false): RxDocType;

    destroy(): void;
}
