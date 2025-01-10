'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function VerificationComponent() {
  const [status, setStatus] = useState('Verifying...');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('Email verified successfully! Redirecting to login...');
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          setStatus(data.message || 'Verification failed');
        }
      } catch (error) {
        setStatus('An error occurred during verification');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div>
      {status === 'Verifying...' ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <p className={`text-lg ${
          status.includes('successfully') ? 'text-green-600' : 'text-red-600'
        }`}>
          {status}
        </p>
      )}
      {!status.includes('Verifying') && !status.includes('successfully') && (
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Return to login
          </button>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
          <div className="mt-4 text-center">
            <Suspense fallback={
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            }>
              <VerificationComponent />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
