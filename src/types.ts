import { OrderByDirection, WhereFilterOp } from "firebase/firestore";
import React from "react";
import { SampleCollection } from "@/utils/sampleData";
import { User } from "firebase/auth";

type VoidFunction = () => void;
type ArgFunction<T> = (...arg: T[]) => void;
type AsyncFunction = (...args: any[]) => Promise<void>;

type PrimitiveType = boolean | string | number | undefined | null;
type NoUndefinedPrimitiveType = boolean | string | number | null;
type NonEmptyPrimitiveType = boolean | string | number;
type NotUndefined<T> = T extends undefined ? never : T;


type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;
type ScreenProps = {
	children?: React.ReactNode;
	[key: string]: any;
};

type ResponseType<T> = {
	status: number;
	message: string;
	data?: T;
}

type MessageType = {
	id: string
	authorId: string
	createdAt: Date
	message: string
}
type UserType = (Omit<User,
	| "delete"
	| "getIdToken"
	| "getIdTokenResult"
	| "metadata"
	| "reload"
	| "refreshToken"
	| "toJSON"
> & { id: string, createdAt: Date })
type FirestoreCollectionsType = {
	"users": UserType[]
	"messages": MessageType[]
}
type FirestoreCollectionNameType = keyof typeof SampleCollection;
type FirebaseCollections = FirestoreCollectionsType[FirestoreCollectionNameType][number]


type QueryConstraintType<T extends FirestoreCollectionsType[FirestoreCollectionNameType][number]> = {
	field: keyof T;
	operator: WhereFilterOp;
	value: NotUndefined<any>;
}


type QueryOrderByConstraintType<T extends FirestoreCollectionsType[FirestoreCollectionNameType][number]> = {
	field: keyof T
	direction?: OrderByDirection
}

export type {
	VoidFunction,
	ArgFunction,
	AsyncFunction,
	PrimitiveType,
	NoUndefinedPrimitiveType,
	NonEmptyPrimitiveType,
	NotUndefined,
	SetStateType,
	ScreenProps,
	FirestoreCollectionNameType,
	MessageType,
	UserType,
	FirestoreCollectionsType,
	FirebaseCollections,
	QueryConstraintType,
	QueryOrderByConstraintType,
	ResponseType,
}