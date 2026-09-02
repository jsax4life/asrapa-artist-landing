import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProfilePhotoUploaderProps {
  fallbackSrc: string;
  className?: string;
}

export function ProfilePhotoUploader({ fallbackSrc, className }: ProfilePhotoUploaderProps) {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const currentSrc = preview || user?.profilePhotoUrl || fallbackSrc;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Type de fichier invalide",
        description: "Sélectionnez une image (JPEG, PNG, WebP).",
        variant: "destructive",
      });
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setIsUploading(true);

    try {
      const response = await api.updateProfilePhoto(file);
      const profilePhotoUrl = response.data?.profilePhotoUrl;
      if (profilePhotoUrl) {
        updateUser({ profilePhotoUrl });
      }
      toast({
        title: "Photo de profil mise à jour",
        description: "Votre nouvelle photo est enregistrée.",
      });
    } catch (error) {
      setPreview(null);
      const errorMessage = error instanceof ApiError ? error.message : "Impossible de mettre à jour la photo de profil.";
      toast({
        title: "Échec de la mise à jour",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative shrink-0 ${className ?? ""}`}>
      <img
        src={currentSrc}
        alt="Photo de profil de l'artiste"
        className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-primary-foreground/20 shadow-accent object-cover"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        aria-label="Changer la photo de profil"
        className="absolute bottom-0 right-0 grid size-7 sm:size-8 place-items-center rounded-full bg-black/70 border-2 border-primary-foreground/20 text-primary-foreground hover:bg-black/90 transition-colors disabled:opacity-70"
      >
        {isUploading ? (
          <Loader2 className="size-3.5 sm:size-4 animate-spin" />
        ) : (
          <Camera className="size-3.5 sm:size-4" />
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
