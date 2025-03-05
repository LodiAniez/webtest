import { GoogleAuthProvider, User, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./config";
import { createDocument } from "./firestore";
import { TSDate, UTCDate } from "@/utils/variables";
import { UserType } from "@/types"
const GoogleProvider = new GoogleAuthProvider();
const googleSignIn = async () => await signInWithPopup(auth, GoogleProvider)
    .then(async (result) => {
        const user = result.user;
        const Data: UserType = {
            id: user.uid,
            createdAt: TSDate(),
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            isAnonymous: user.isAnonymous,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            providerData: user.providerData,
            providerId: user.providerId,
            tenantId: user.tenantId,
            uid: user.uid,
        }
        const response = await createDocument<UserType>({
            Collection: "users",
            Data: Data
        });
        if (response.status !== 200) await signOut(auth);
        return {
            status: response.status,
            message: response.message,
            data: response.data
        }
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error(errorCode, errorMessage);
        return {
            status: errorCode,
            message: errorMessage,
            data: {
                email,
                credential
            }
        }
    });

export {
    GoogleProvider,
    googleSignIn
}