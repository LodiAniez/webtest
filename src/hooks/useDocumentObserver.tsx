import { query, where, onSnapshot, collection, QueryFieldFilterConstraint, QueryOrderByConstraint, doc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { FirestoreCollectionNameType, FirestoreCollectionsType } from '@/types';
import { firestore } from '@/services/firebase/config';
import { convertTimestampsToDate, } from '@/utils/functions';

type Props = {
    Collection: FirestoreCollectionNameType;
    Id?: string | null;
    Dependencies?: Array<any>
    Run?: boolean
}
function useDocumentObserver<T extends FirestoreCollectionsType[FirestoreCollectionNameType][0]>({ Collection, Id, Dependencies = [], Run = true }: Props): T | null {
    const [firestoreDocument, setFirestoreDocument] = useState<T | null>(null);


    useEffect(() => {
        if (Run === false) return setFirestoreDocument(prev => prev)
        if (!Id || Id === "undefined" || Id === "null") return setFirestoreDocument(null)
        console.info("Rerendering useDocumentObserver...")
        const unsubscribe = onSnapshot(doc(firestore, Collection, String(Id)), (document) => {
            if (document.data()) setFirestoreDocument({ ...convertTimestampsToDate<T>(document.data() as T) });
        });
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [...Dependencies, Run]);
    return firestoreDocument;
};

export default useDocumentObserver;
