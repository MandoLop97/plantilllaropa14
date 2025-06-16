
import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Primero configuramos el listener para cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        
        // Guardar estado de autenticación en localStorage
        if (currentSession) {
          localStorage.setItem("isLoggedIn", "true");
        } else {
          localStorage.removeItem("isLoggedIn");
        }
      }
    );

    // Luego comprobamos si ya hay una sesión activa
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
      
      if (currentSession) {
        localStorage.setItem("isLoggedIn", "true");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al iniciar sesión";
      toast({
        title: "Error al iniciar sesión",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      // Si el usuario se ha creado correctamente y no es necesario confirmar el email
      if (data.user && !data.session) {
        toast({
          title: "Registro exitoso",
          description: "Se ha enviado un email de confirmación a tu correo.",
        });
      } else if (data.session) {
        // Si se ha creado la sesión automáticamente (no hay verificación de email)
        toast({
          title: "Registro exitoso",
          description: "Has sido registrado y autenticado correctamente.",
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al registrarse";
      toast({
        title: "Error al registrarse",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("isLoggedIn");
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al cerrar sesión";
      toast({
        title: "Error al cerrar sesión",
        description: message,
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
