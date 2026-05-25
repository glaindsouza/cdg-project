import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { UploadBox } from "../components/UploadBox";
import { GraduationCap, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export function ProfileCompletion() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    usn: "",
    email: "",
    phone: "",
    department: "Computer Science",
    semester: "1",
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [idCardPhoto, setIdCardPhoto] = useState<File | null>(null);

  const [existingPassportUrl, setExistingPassportUrl] = useState("");
  const [existingIdCardUrl, setExistingIdCardUrl] = useState("");

  const [uploading, setUploading] = useState(false);
  const [profileUploaded, setProfileUploaded] = useState(false);
  const [idUploaded, setIdUploaded] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    fetchExistingProfile();
  }, []);

  const fetchExistingProfile = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        navigate({ to: "/auth" });
        return;
      }

      const user = sessionData.session.user;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
        toast.error(error.message);
        return;
      }

      if (data) {
        setFormData({
          fullName: data.full_name ||"",
          usn: data.usn || "",
          email: data.email || user.email || "",
          phone: data.phone || "",
          department: data.department || "Computer Science",
          semester: data.semester || "1",
        });

        setExistingPassportUrl(data.passport_photo_url || "");
        setExistingIdCardUrl(data.id_card_url || "");

        if (data.passport_photo_url) {
          setProfileUploaded(true);
        }

        if (data.id_card_url) {
          setIdUploaded(true);
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          email: user.email || "",
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  const uploadFile = async (file: File, bucket: string, folder: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profilePhoto && !existingPassportUrl) {
      toast.error("Passport size photo is required");
      return;
    }

    if (!idCardPhoto && !existingIdCardUrl) {
      toast.error("ID card photo is required");
      return;
    }

    setUploading(true);

    try {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !data.session) {
        toast.error("No active session found. Please login again.");
        navigate({ to: "/auth" });
        return;
      }

      const user = data.session.user;

      let finalPassportUrl = existingPassportUrl;
      let finalIdCardUrl = existingIdCardUrl;

      if (profilePhoto) {
        finalPassportUrl = await uploadFile(
          profilePhoto,
          "student-passport-photos",
          user.id
        );
      }

      if (idCardPhoto) {
        finalIdCardUrl = await uploadFile(
          idCardPhoto,
          "student-id-cards",
          user.id
        );
      }

      const { error } = await supabase.from("profiles").upsert(
        [
          {
            user_id: user.id,
            role: "student",
            full_name: formData.fullName,
            email: formData.email,
            usn: formData.usn,
            phone: formData.phone,
            department: formData.department,
            semester: formData.semester,
            passport_photo_url: finalPassportUrl,
            id_card_url: finalIdCardUrl,
            profile_completed: true,
          },
        ],
        {
          onConflict: "user_id",
        }
      );

      if (error) {
        console.error(error);
        toast.error(error.message);
        return;
      }

      toast.success("Profile saved successfully!");
      navigate({ to: "/student/dashboard" });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-500 mb-4">
            <GraduationCap size={32} />
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Complete Your Profile
          </h1>

          <p className="text-slate-500">
            Please provide your details to access the dashboard
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>

                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  USN
                </label>

                <input
                  type="text"
                  required
                  value={formData.usn}
                  onChange={(e) =>
                    setFormData({ ...formData, usn: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="1RV20CS001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>

                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="john@college.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number
                </label>

                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Department
                </label>

                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Science">
                    Information Science
                  </option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Semester
                </label>

                <select
                  value={formData.semester}
                  onChange={(e) =>
                    setFormData({ ...formData, semester: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={String(sem)}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <UploadBox
                  label="Passport Size Photo *"
                  onChange={(file) => {
                    setProfilePhoto(file);
                    setProfileUploaded(true);
                  }}
                />

                {profileUploaded && (
                  <p className="text-green-600 text-sm font-medium mt-2">
                    ✓ Passport photo selected/saved successfully
                  </p>
                )}
              </div>

              <div>
                <UploadBox
                  label="College ID Card *"
                  onChange={(file) => {
                    setIdCardPhoto(file);
                    setIdUploaded(true);
                  }}
                />

                {idUploaded && (
                  <p className="text-green-600 text-sm font-medium mt-2">
                    ✓ ID card selected/saved successfully
                  </p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <CheckCircle2 size={20} />
                {uploading ? "Saving..." : "Save & Continue to Dashboard"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}