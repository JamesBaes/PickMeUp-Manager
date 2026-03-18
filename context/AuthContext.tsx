"use client"

import React, { useContext, useState, createContext, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import supabase from "@/utils/client";


interface AuthContextType {
  user: User | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
});


export const AuthProvider = ({children}: { children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);


  {/* Fetches current user on first render, listens for any changes in auth state  */}
  useEffect(() => {
    if (!supabase) {
      return;
    }

    const supabaseClient = supabase;

    const fetchUser = async() => {
      const { data } = await supabaseClient.auth.getUser();
      setUser(data.user);
    }

    fetchUser();

    const { data: listener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// hook for accessing context values.
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
