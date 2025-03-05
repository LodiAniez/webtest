import { FirestoreCollectionNameType, FirestoreCollectionsType, } from '@/types';
import { query, onSnapshot, collection, QueryConstraint } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { convertTimestampsToDate, removeDuplicates, } from '@/utils/functions';
import { firestore } from '@/services/firebase/config';

type Props<T> = {
    Collection: FirestoreCollectionNameType;
    Condition?: QueryConstraint[];
    Dependencies?: Array<any>
    Run?: boolean
    ReplaceOld?: boolean
}
function useCollectionObserver<T extends FirestoreCollectionsType[FirestoreCollectionNameType][number]>({ Collection, Condition, Dependencies = [], Run = true, ReplaceOld = true }: Props<T>): (T & { docId: string })[] {
    const [firestoreCollection, setFirestoreCollection] = useState<Array<T & { docId: string }>>([]);
    useEffect(() => {
        if (Run === false) return setFirestoreCollection(prev => ReplaceOld ? [] : prev)
        console.info("Rerendering useCollectionObserver...")
        const q = Condition ? query(collection(firestore, Collection), ...Condition) : query(collection(firestore, Collection));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data: Array<T & { docId: string }> = [];
            querySnapshot.forEach((doc) => {
                data.push(convertTimestampsToDate({ ...doc.data(), docId: doc.id }) as T & { docId: string });
            });
            setFirestoreCollection(prev => ReplaceOld ? data : removeDuplicates([...prev, ...data], "docId"))
        });


        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [...Dependencies, Run,]);

    return firestoreCollection;
};

export default useCollectionObserver;
