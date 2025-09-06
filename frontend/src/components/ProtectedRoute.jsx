import { RedirectToSignIn, useUser } from "@clerk/clerk-react";

export default function ProtectedRoute({ children }) {
    const { isSignedIn, isLoaded } = useUser();

    if (!isLoaded) {
        return <div>Loading...</div>; // while Clerk loads session
    }

    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }

    return children;
}
