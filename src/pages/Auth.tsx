import { useEffect, useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { GraduationCap, Mail, Lock, User, ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
const [role, setRole] = useState("student");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
  checkSession();
}, []);

const checkSession = async () => {
  const { data } = await supabase.auth.getSession();

  if (!data.session) return;

  const user = data.session.user;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const actualRole = profile?.role || user.user_metadata?.role || "student";

  if (actualRole === "student") {
    if (!profile) {
      navigate({ to: "/student/profile-completion" });
      return;
    }

    navigate({ to: "/student/dashboard" });
  } else if (actualRole === "club_admin") {
    navigate({ to: "/club-admin/dashboard" });
  } else if (actualRole === "faculty") {
    navigate({ to: "/faculty/dashboard" });
  }
};

  const redirectByRole = async () => {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) return;

  const user = sessionData.session.user;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(error);
    toast.error(error.message);
    return;
  }

  const actualRole = profile?.role || user.user_metadata?.role || role;

  if (actualRole === "student") {
    if (!profile) {
      navigate({ to: "/student/profile-completion" });
      return;
    }

    navigate({ to: "/student/dashboard" });
  } else if (actualRole === "club_admin") {
    navigate({ to: "/club-admin/dashboard" });
  } else if (actualRole === "faculty") {
    navigate({ to: "/faculty/dashboard" });
  } else {
    toast.error("Role not found. Please contact admin.");
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error("Please enter email and password.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error(error.message);
          setLoading(false);
          return;
        }

       await redirectByRole();
      } else {
        if (!fullName.trim()) {
          toast.error("Please enter your full name.");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          toast.error("Passwords do not match.");
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: "student",
            },
          },
        });

        if (error) {
          toast.error(error.message);
          setLoading(false);
          return;
        }

        localStorage.setItem("role", role);
        localStorage.setItem("fullName", fullName);
        localStorage.setItem("email", email);
toast.success(
  "Verification email sent! Please verify your email before logging in."
);

setIsLogin(true);

setFullName("");
setEmail("");
setPassword("");
setConfirmPassword("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col justify-center py-12 px-6 lg:px-8 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-yellow-200/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link
          to="/"
          className="flex justify-center items-center gap-3 text-orange-500 font-bold text-3xl mb-8 hover:scale-105 transition-transform"
        >
          <GraduationCap className="w-10 h-10" />
          <span>CDG</span>
        </Link>

        <div className="bg-white py-10 px-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl border border-slate-100 relative">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                isLogin
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Log In
            </button>

            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                !isLogin
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              {isLogin ? "Welcome back!" : "Create your account"}
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              {isLogin
                ? "Enter your details to access your dashboard."
                : "Join CDG to manage your campus activities."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required={!isLogin}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-11 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                    placeholder="Glain Avila D'Souza"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required={!isLogin}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-11 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

    <div>
  <label className="block text-sm font-bold text-slate-700 mb-2">
    Account Type
  </label>

  {isLogin ? (
    <div className="grid grid-cols-3 gap-3">
      {[
        { id: "student", label: "Student" },
        { id: "club_admin", label: "Club Admin" },
        { id: "faculty", label: "Faculty" },
      ].map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => setRole(r.id)}
          className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-all ${
            role === r.id
              ? "border-orange-500 bg-orange-50 text-orange-700"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  ) : (
    <div className="py-3 px-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 font-bold text-sm text-center">
      Student Registration Only
    </div>
  )}
</div>

            {isLogin && (
              <div className="flex items-center justify-end">
                <a
                  href="#"
                  className="text-xs font-bold text-orange-600 hover:text-orange-500"
                >
                  Forgot your password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign in"
                : "Create account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs font-medium text-slate-500">
          By continuing, you agree to CDG&apos;s{" "}
          <a href="#" className="text-orange-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-orange-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}