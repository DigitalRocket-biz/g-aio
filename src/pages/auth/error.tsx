import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const errors: { [key: string]: string } = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification link was invalid or has expired.",
  default: "An error occurred during authentication."
};

export default function ErrorPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const errorType = router.query.error as string;
    setError(errors[errorType] || errors.default);
  }, [router.query]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <div className="mt-2 text-center text-sm text-gray-600">
            {error}
          </div>
          <div className="mt-5 text-center">
            <button
              onClick={() => router.push('/auth/signin')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 