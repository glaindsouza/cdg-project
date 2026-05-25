import { UploadCloud } from 'lucide-react';

interface UploadBoxProps {
  label: string;
  onChange: (file: File | null) => void;
  accept?: string;
  previewUrl?: string;
}

export function UploadBox({ label, onChange, accept = "image/*", previewUrl }: UploadBoxProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="relative border-2 border-dashed border-slate-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-colors group cursor-pointer overflow-hidden">
        <input 
          type="file" 
          accept={accept}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onChange(e.target.files[0]);
            }
          }}
        />
        <div className="flex flex-col items-center justify-center py-8 text-slate-500 group-hover:text-orange-500">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="max-h-32 object-contain" />
          ) : (
            <>
              <UploadCloud size={32} className="mb-3" />
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
