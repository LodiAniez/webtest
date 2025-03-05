import {
	collection,
	addDoc,
	getDocs,
	getDoc,
	query,
	orderBy,
	limit,
	where,
	updateDoc,
	deleteDoc,
	setDoc,
	doc,
	QueryConstraint,
	arrayUnion as ArrayUnion,
	arrayRemove as ArrayRemove,
	increment as Increment,
} from "firebase/firestore";
import { firestore } from "./config";
import { NoUndefinedPrimitiveType, QueryConstraintType, ResponseType } from "@/types";
import { FirestoreCollectionNameType, FirestoreCollectionsType } from "@/types";
import { convertTimestampsToDate, removeUndefined, replaceUndefinedWithNull } from "@/utils/functions";

export const createId = (Collection: FirestoreCollectionNameType) => doc(collection(firestore, Collection)).id

export const createDocument = async <T extends FirestoreCollectionsType[FirestoreCollectionNameType][number]>(
	{
		Collection,
		Data,
		Id,
	}: {
		Collection: FirestoreCollectionNameType,
		Data: T,
		Id?: string,
	}
): Promise<ResponseType<T | undefined>> => {
	try {
		if (Id) {
			const documentRef = doc(firestore, Collection, Id)
			const document = await setDoc(documentRef, replaceUndefinedWithNull(Data));
			return {
				status: 200,
				message: "Success!",
				data: {
					...Data,
					id: Id
				}
			};
		} else if ("id" in Data && typeof Data["id"] === "string") {
			const documentRef = doc(firestore, Collection, Data["id"])
			const document = await setDoc(documentRef, replaceUndefinedWithNull(Data));
			return {
				status: 200,
				message: "Success!",
				data: Data
			};
		}
		else {
			const collectionFunc = collection(firestore, Collection);
			const documentRef = await addDoc(collectionFunc, replaceUndefinedWithNull(Data));
			return {
				status: 200,
				message: "Success!",
				data: {
					...Data,
					id: documentRef.id
				}
			}
		}
	} catch (e) {
		console.error("Error adding document: ", e, Data);
		return {
			status: 400,
			message: "Error adding document: " + e,
			data: undefined
		}
	}
};
export const readCollection = async <T extends FirestoreCollectionsType[FirestoreCollectionNameType][number]>({
	Collection,
	Query,
}: {
	Collection: FirestoreCollectionNameType
	Query?: QueryConstraint[]
}): Promise<T[]> => {
	try {
		const querySnapshot = await getDocs(Query ? query(collection(firestore, Collection), ...Query) : query(collection(firestore, Collection)));
		const values: T[] = [];
		querySnapshot.forEach((document) => {
			values.push(convertTimestampsToDate<T>(document.data() as T));
		});
		return values;
	} catch (error) {
		console.error("Error fetching document: ", error);
		return []
	}
};
export const readDocument = async <T extends FirestoreCollectionsType[FirestoreCollectionNameType][number]>({ Collection, Id, }: { Collection: FirestoreCollectionNameType, Id: string, }): Promise<ResponseType<T | undefined>> => {
	try {
		const documentRef = doc(firestore, Collection, Id);
		const document = await getDoc(documentRef);
		if (document.exists()) {
			return {
				status: 200,
				message: "Data fetched!",
				data: convertTimestampsToDate<T>(document.data() as T)
			};
		} else {
			console.warn("No such document!");
			return {
				status: 400,
				message: "No such document!",
				data: undefined
			}
		}
	} catch (e) {
		console.error("Error fetching document: ", e);
		return {
			status: 400,
			message: String(e),
			data: undefined
		}
	}
};

export const readDocument2 = async <T extends FirestoreCollectionsType[FirestoreCollectionNameType][number]>({ Collection, Id, }: { Collection: FirestoreCollectionNameType, Id?: string | null, }): Promise<T | null> => {
	try {
		if (!Id || Id === "undefined" || Id === "null") return null
		const documentRef = doc(firestore, Collection, Id);
		const document = await getDoc(documentRef);
		if (document.exists()) {
			return convertTimestampsToDate<T>(document.data() as T)
		} else {
			return null
		}
	} catch (e) {
		console.error("Error fetching document: ", e);
		return null
	}
};
export const updateDocument = async <T extends FirestoreCollectionsType[FirestoreCollectionNameType][number]>({ Collection, Id, Data }: { Collection: FirestoreCollectionNameType, Id?: string | null, Data: Partial<T> }): Promise<ResponseType<T>> => {
	try {
		if (!Id || Id === "undefined" || Id === "null") return {
			status: 400,
			message: "No id"
		}
		return await updateDoc(doc(firestore, Collection, Id), replaceUndefinedWithNull(Data)).then(() => ({
			status: 200,
			message: "Update success"
		})).catch(error => ({
			status: error.status ?? 400,
			message: error.message ?? "Update fail"
		}))
	} catch (error) {
		return {
			status: 400,
			message: String(error)
		}
	}
}
export const deleteDocument = async<T>({ Collection, Id }: { Collection: FirestoreCollectionNameType, Id: string }): Promise<ResponseType<T>> => {
	try {
		const response = await deleteDoc(doc(firestore, Collection, Id))
		return { status: 200, message: "Document deleted successfully", data: { Id } as T }
	} catch (e) {
		return { status: 400, message: "Failed to delete document", data: { Id } as T }
	}
}
export const deleteMultiple = async ({ Collection, Query }: { Collection: FirestoreCollectionNameType, Query: QueryConstraint[], }) => {
	const q = query(collection(firestore, Collection), ...Query)
	const querySnapshot = await getDocs(q);
	return querySnapshot.forEach(async (document) => {
		const del = await deleteDoc(doc(firestore, Collection, document.id))
		return del
	})
}


export const getOldestDocument = (Collection: string, map: string) => {
	try {
		const q = query(collection(firestore, Collection), where("map", "==", map), orderBy("date"), limit(1))
		return getDocs(q).then((snapshot) => {
			let data: any = undefined
			snapshot.forEach((document) => {
				if (data === undefined && Object.keys(document.data()).length !== 0) data = document.data();
			})
			return data
		})
	} catch (error) {
		console.error(error)
	}
};
export const getArrayOfId = async <T extends FirestoreCollectionsType[FirestoreCollectionNameType][number]>({ Collection, Ids = [] }: { Collection: FirestoreCollectionNameType, Ids: string[] }): Promise<Array<T>> => {
	try {
		const result: T[] = []
		if (!Array.isArray(Ids)) {
			console.error("getArrayOfId: ", Collection, Ids);
			return result;
		}
		await Promise.all(Ids.map(async (Id) => {
			const doc = await readDocument<T>({ Collection, Id })
			if (doc.data) result.push(doc.data)
		}))
		return result
	} catch (e: any) {
		console.error("Failed to fetch array of documents", e)
		return []
	}

}
export const deleteArrayOfId = async <T extends FirestoreCollectionsType[FirestoreCollectionNameType][number]>({ Collection, Ids = [] }: { Collection: FirestoreCollectionNameType, Ids: string[] }): Promise<Array<T>> => {
	try {
		const result: T[] = []
		if (!Array.isArray(Ids)) {
			console.error("deleteArrayOfId: ", Collection, Ids);
			return result;
		}
		await Promise.all(Ids.map(async (Id) => {
			const doc = await deleteDocument<T>({ Collection, Id })
			if (doc.data) result.push(doc.data)
		}))
		return result
	} catch (e: any) {
		console.error("Failed to delete array of documents", e)
		return []
	}

}

export const checkIfDocumentExist = async<T extends FirestoreCollectionsType[FirestoreCollectionNameType][number]>({ Collection, ID, Query }: { Collection: FirestoreCollectionNameType, ID?: string, Query?: QueryConstraint[] }): Promise<T | undefined> => {
	if (!ID && !Query) return undefined
	if (ID) {
		return await readDocument<T>({
			Collection,
			Id: ID
		}).then((response) => response.data)
	} else {
		return await readCollection<T>({
			Collection,
			Query: Query ?? [],
		}).then((response) => response.length === 0 ? undefined : response[0])
	}
}


export const increment = (x: number): number => {
	return Increment(x) as unknown as number
}
export const arrayUnion = <T extends NoUndefinedPrimitiveType>(values: T | Array<T>): T[] => {
	return ArrayUnion(...removeUndefined(Array.isArray(values) ? values : [values])) as unknown as T[]
}
export const arrayRemove = <T extends NoUndefinedPrimitiveType>(values: T | Array<T>): T[] => {
	return ArrayRemove(...removeUndefined(Array.isArray(values) ? values : [values])) as unknown as T[]
}

export const applyQueries = <T extends FirestoreCollectionsType[FirestoreCollectionNameType][number]>(queries: QueryConstraintType<T>[]) => {

	return queries.map(({ field, operator, value }) => {
		return where(String(field), operator, value);
	});

};