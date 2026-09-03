import { useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Camera, Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface BannerImageUploaderProps {
  className?: string;
}

export function BannerImageUploader({ className }: BannerImageUploaderProps) {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const currentSrc = preview || user?.bannerImageUrl || null;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: t('bannerImageUploader.invalidFileTypeTitle'),
        description: t('bannerImageUploader.invalidFileTypeDescription'),
        variant: "destructive",
      });
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setIsUploading(true);

    try {
      const response = await api.updateBannerImage(file);
      const updatedArtist = response.data?.artist as { bannerImage?: string } | undefined;
      if (updatedArtist?.bannerImage) {
        updateUser({ bannerImageUrl: updatedArtist.bannerImage });
      }
      toast({
        title: t('bannerImageUploader.updateSuccessTitle'),
        description: t('bannerImageUploader.updateSuccessDescription'),
      });
    } catch (error) {
      setPreview(null);
      const errorMessage = error instanceof ApiError ? error.message : t('bannerImageUploader.updateFailedDescription');
      toast({
        title: t('bannerImageUploader.updateFailedTitle'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative w-full h-32 sm:h-44 rounded-xl overflow-hidden border border-border bg-muted ${className ?? ""}`}>
      {currentSrc ? (
        <img src={currentSrc} alt={t('bannerImageUploader.bannerAlt')} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
          {t('bannerImageUploader.noBannerYet')}
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        aria-label={t('bannerImageUploader.changeBanner')}
        className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-black/70 border border-primary-foreground/20 text-primary-foreground text-sm px-3 py-2 hover:bg-black/90 transition-colors disabled:opacity-70"
      >
        {isUploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Camera className="size-4" />
        )}
        {isUploading ? t('bannerImageUploader.uploading') : t('bannerImageUploader.changeBanner')}
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
