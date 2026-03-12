"use client";
import Signup from '@/components/signup/Signup'
import { useAuthContext } from '@/context/AuthContext';
// import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

function Page() {
   const { authenticated, loading } = useAuthContext();

  const router = useRouter();

  useEffect(() => {

    if (!loading && authenticated) {
      router.replace("/user");
    }

  }, [authenticated, loading, router]);

  if (loading) return <p>Loading...</p>;

  return <Signup />;
   
  
}

export default Page
