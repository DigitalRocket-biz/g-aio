import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

export default function SignIn() {
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        } else {
            signIn("google", {
                callbackUrl: "/dashboard",
            });
        }
    }, [session, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Redirecting to Google Sign In...</h1>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        </div>
    );
} 