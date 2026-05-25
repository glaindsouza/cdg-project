import { useEffect, useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { supabase } from "../lib/supabaseClient";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: string;
}

export function ProtectedRoute({
  children,
  allowedRole,
}: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    const user = sessionData.session.user;

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    if (data.role === allowedRole) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-bold text-orange-500">
        Loading...
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
}