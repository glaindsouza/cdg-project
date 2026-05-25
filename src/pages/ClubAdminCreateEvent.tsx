import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

export function ClubAdminCreateEvent() {
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    registrationLink: "",
    registrationDeadline: "",
    seatLimit: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const uploadPoster = async () => {
    if (!posterFile) return "";

    const fileExt = posterFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `posters/${fileName}`;

    const { error } = await supabase.storage
      .from("event-posters")
      .upload(filePath, posterFile);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("event-posters")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !data.session) {
        toast.error("Please login again");
        return;
      }

      const user = data.session.user;

      let posterUrl = "";

      if (posterFile) {
        posterUrl = await uploadPoster();
      }

      const { error } = await supabase.from("events").insert([
        {
          created_by: user.id,
          title: formData.title,
          description: formData.description,
          venue: formData.venue,
          event_date: formData.date,
          event_time: formData.time,
          registration_link: formData.registrationLink,
          registration_deadline: formData.registrationDeadline || null,
          seat_limit: formData.seatLimit ? Number(formData.seatLimit) : null,
          club_name: "Coding Club",
          poster_url: posterUrl,
        },
      ]);

      if (error) {
        console.error(error);
        toast.error(error.message);
        return;
      }
const { data: students } = await supabase
  .from("profiles")
  .select("user_id")
  .eq("role", "student");

if (students && students.length > 0) {
  await supabase.from("notifications").insert(
    students.map((student) => ({
      user_id: student.user_id,
      title: "New Event Published",
      message: `${formData.title} has been added. Check it out and register if interested.`,
      is_read: false,
    }))
  );
}
      toast.success("Event published successfully!");

      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        registrationLink: "",
        registrationDeadline: "",
        seatLimit: "",
      });

      setPosterFile(null);
      setPosterPreview("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden font-sans">
      <Sidebar role="club-admin" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto p-8">
          <header className="flex items-center gap-4 mb-8">
            <Link
              to="/club-admin/dashboard"
              className="p-2 bg-white text-slate-500 rounded-full hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Create New Event
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Publish a new event for students to register
              </p>
            </div>
          </header>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium"
                  placeholder="e.g. Tech Fest 2026"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium resize-none"
                  placeholder="Provide detailed information about the event..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium text-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium text-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Venue
                </label>
                <input
                  type="text"
                  name="venue"
                  required
                  value={formData.venue}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium"
                  placeholder="e.g. Main Auditorium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Club Name
                </label>
                <input
                  type="text"
                  defaultValue="Coding Club"
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 outline-none font-medium cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Event Poster
                </label>

                <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <UploadCloud size={32} className="mb-3 text-slate-400" />

                  <p className="text-sm font-bold text-slate-700 mb-1">
                    Click to upload poster
                  </p>

                  <p className="text-xs">PNG, JPG or GIF</p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterChange}
                    className="hidden"
                  />
                </label>

                {posterPreview && (
                  <div className="mt-4">
                    <p className="text-sm font-bold text-slate-700 mb-2">
                      Poster Preview
                    </p>

                    <img
                      src={posterPreview}
                      alt="Poster preview"
                      className="w-full max-h-64 object-cover rounded-2xl border border-slate-200"
                    />
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Google Form Link Optional
                </label>
                <input
                  type="url"
                  name="registrationLink"
                  value={formData.registrationLink}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium"
                  placeholder="https://forms.gle/..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Registration Deadline
                </label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium text-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Seat Limit
                </label>
                <input
                  type="number"
                  name="seatLimit"
                  value={formData.seatLimit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium"
                  placeholder="e.g. 150"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
              <Link
                to="/club-admin/dashboard"
                className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-all"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Publishing..." : "Publish Event"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}