import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, UploadCloud, Users } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

export function ClubAdminCreateClub() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [clubImage, setClubImage] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  });

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();

    const fileName = `club-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("club-assets")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("club-assets")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";

      if (clubImage) {
        imageUrl = await uploadImage(clubImage);
      }

      const { error } = await supabase.from("clubs").insert([
        {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          photo_url: imageUrl,
          is_audition_open: false,
        },
      ]);

      if (error) {
        console.error(error);
        toast.error(error.message);
        return;
      }

      toast.success("Club created successfully!");

      navigate({
        to: "/club-admin/dashboard",
      });

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6F9] font-sans">
      <Sidebar role="club-admin" />

      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">

          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/club-admin/dashboard"
              className="p-2 bg-white rounded-full border border-slate-200"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Create Club
              </h1>

              <p className="text-sm text-slate-500">
                Add a new campus club
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6"
          >
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Club Name *
              </label>

              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                placeholder="Enter club name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Category
              </label>

              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                placeholder="Technical / Cultural / Sports"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Description *
              </label>

              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none resize-none"
                placeholder="Describe your club..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Club Photo
              </label>

              <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                <UploadCloud
                  size={28}
                  className="text-slate-400 mb-2"
                />

                <p className="text-sm font-bold text-slate-700">
                  Upload Club Image
                </p>

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    setClubImage(e.target.files?.[0] || null)
                  }
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors"
            >
              {loading ? "Creating..." : "Create Club"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}