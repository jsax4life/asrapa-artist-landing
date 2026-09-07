import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfilePhotoUploader } from "@/components/dashboard-components/ProfilePhotoUploader";
import { BannerImageUploader } from "@/components/dashboard-components/BannerImageUploader";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api, ApiError } from "@/lib/api";
import { mapArtistToUserData } from "@/lib/auth-utils";
import { CHAD_CITIES, CHAD_COUNTRY } from "@/lib/countries";
import artistProfile from "@/assets/images/artist-profile.jpg";

type ProfileForm = {
  fullName: string;
  stageName: string;
  email: string;
  hometown: string;
  city: string;
  website: string;
  bio: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
};

const emptyProfileForm = (): ProfileForm => ({
  fullName: '',
  stageName: '',
  email: '',
  hometown: '',
  city: '',
  website: '',
  bio: '',
  twitter: '',
  facebook: '',
  instagram: '',
  youtube: '',
  tiktok: '',
});

const profileFormFromUser = (user: ReturnType<typeof mapArtistToUserData>): ProfileForm => ({
  fullName: user.fullName,
  stageName: user.stageName,
  email: user.email,
  hometown: user.hometown || '',
  city: user.city || '',
  website: user.website || '',
  bio: user.bio || '',
  twitter: user.twitter || '',
  facebook: user.facebook || '',
  instagram: user.instagram || '',
  youtube: user.youtube || '',
  tiktok: user.tiktok || '',
});

const Settings = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [profileForm, setProfileForm] = useState<ProfileForm>(() =>
    user ? profileFormFromUser(user as ReturnType<typeof mapArtistToUserData>) : emptyProfileForm()
  );
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.getArtistMe();
        const artist = response.data?.artist;
        if (artist) {
          const userData = mapArtistToUserData(artist);
          updateUser(userData);
          setProfileForm(profileFormFromUser(userData));
        }
      } catch (error) {
        const errorMessage = error instanceof ApiError ? error.message : t('accountSettingsPage.profileUpdateFailedDescription');
        toast({
          title: t('accountSettingsPage.updateFailedTitle'),
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  const handleProfileChange = (field: keyof ProfileForm) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfileForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSavingProfile(true);
    const payload = {
      fullName: profileForm.fullName,
      stageName: profileForm.stageName,
      email: profileForm.email,
      country: CHAD_COUNTRY,
      hometown: profileForm.hometown,
      city: profileForm.city,
      website: profileForm.website,
      bio: profileForm.bio,
      twitter: profileForm.twitter,
      facebook: profileForm.facebook,
      instagram: profileForm.instagram,
      youtube: profileForm.youtube,
      tiktok: profileForm.tiktok,
    };
    try {
      const response = await api.updateArtistProfile(payload);
      const artist = response.data?.artist;
      if (artist) {
        const userData = mapArtistToUserData(artist);
        updateUser(userData);
        setProfileForm(profileFormFromUser(userData));
      }
      toast({
        title: t('accountSettingsPage.profileUpdatedTitle'),
        description: t('accountSettingsPage.profileUpdatedDescription'),
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : t('accountSettingsPage.profileUpdateFailedDescription');
      toast({
        title: t('accountSettingsPage.updateFailedTitle'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: t('accountSettingsPage.passwordsMismatchTitle'),
        description: t('accountSettingsPage.passwordsMismatchDescription'),
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: t('accountSettingsPage.passwordTooShortTitle'),
        description: t('accountSettingsPage.passwordTooShortDescription'),
        variant: "destructive",
      });
      return;
    }

    setIsSavingPassword(true);
    try {
      await api.changePassword({
        passwordCurrent: passwordForm.currentPassword,
        password: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast({
        title: t('accountSettingsPage.passwordChangedTitle'),
        description: t('accountSettingsPage.passwordChangedDescription'),
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : t('accountSettingsPage.passwordChangeFailedDescription');
      toast({
        title: t('accountSettingsPage.changeFailedTitle'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border bg-card px-6">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-foreground">{t('accountSettingsPage.pageTitle')}</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background max-w-3xl">
              {isLoadingProfile ? (
                <p className="text-sm text-muted-foreground">{t('accountSettingsPage.loadingProfile')}</p>
              ) : null}

              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">{t('accountSettingsPage.bannerTitle')}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {t('accountSettingsPage.bannerDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BannerImageUploader />
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">{t('accountSettingsPage.profilePhotoTitle')}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {t('accountSettingsPage.profilePhotoDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <ProfilePhotoUploader fallbackSrc={artistProfile} size="lg" />
                  <p className="text-sm text-muted-foreground">
                    {t('accountSettingsPage.profilePhotoInstructions')}
                  </p>
                </CardContent>
              </Card>

              <form onSubmit={handleProfileSubmit} className="space-y-4 sm:space-y-6">
                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground">{t('accountSettingsPage.accountInfoTitle')}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {t('accountSettingsPage.accountInfoDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t('accountSettingsPage.fullNameLabel')}</Label>
                      <Input
                        id="fullName"
                        value={profileForm.fullName}
                        onChange={handleProfileChange('fullName')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stageName">{t('accountSettingsPage.stageNameLabel')}</Label>
                      <Input
                        id="stageName"
                        value={profileForm.stageName}
                        onChange={handleProfileChange('stageName')}
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">{t('accountSettingsPage.emailLabel')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileChange('email')}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground">{t('accountSettingsPage.locationTitle')}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {t('accountSettingsPage.locationDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">{t('accountSettingsPage.countryLabel')}</Label>
                      <Input
                        id="country"
                        value={t('accountSettingsPage.countryValue')}
                        readOnly
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">{t('accountSettingsPage.cityLabel')}</Label>
                      <Select
                        value={profileForm.city}
                        onValueChange={(value) => setProfileForm((prev) => ({ ...prev, city: value }))}
                      >
                        <SelectTrigger id="city">
                          <SelectValue placeholder={t('accountSettingsPage.cityPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          {CHAD_CITIES.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="hometown">{t('accountSettingsPage.hometownLabel')}</Label>
                      <Input
                        id="hometown"
                        value={profileForm.hometown}
                        onChange={handleProfileChange('hometown')}
                        placeholder={t('accountSettingsPage.hometownPlaceholder')}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground">{t('accountSettingsPage.bioTitle')}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {t('accountSettingsPage.bioSectionDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bio">{t('accountSettingsPage.bioLabel')}</Label>
                      <Textarea
                        id="bio"
                        value={profileForm.bio}
                        onChange={handleProfileChange('bio')}
                        placeholder={t('accountSettingsPage.bioPlaceholder')}
                        rows={5}
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {profileForm.bio.length}/500
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">{t('accountSettingsPage.websiteLabel')}</Label>
                      <Input
                        id="website"
                        type="url"
                        value={profileForm.website}
                        onChange={handleProfileChange('website')}
                        placeholder={t('accountSettingsPage.websitePlaceholder')}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground">{t('accountSettingsPage.socialLinksTitle')}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {t('accountSettingsPage.socialLinksDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram">{t('accountSettingsPage.instagramLabel')}</Label>
                      <Input
                        id="instagram"
                        type="url"
                        value={profileForm.instagram}
                        onChange={handleProfileChange('instagram')}
                        placeholder={t('accountSettingsPage.instagramPlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facebook">{t('accountSettingsPage.facebookLabel')}</Label>
                      <Input
                        id="facebook"
                        type="url"
                        value={profileForm.facebook}
                        onChange={handleProfileChange('facebook')}
                        placeholder={t('accountSettingsPage.facebookPlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">{t('accountSettingsPage.twitterLabel')}</Label>
                      <Input
                        id="twitter"
                        type="url"
                        value={profileForm.twitter}
                        onChange={handleProfileChange('twitter')}
                        placeholder={t('accountSettingsPage.twitterPlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="youtube">{t('accountSettingsPage.youtubeLabel')}</Label>
                      <Input
                        id="youtube"
                        type="url"
                        value={profileForm.youtube}
                        onChange={handleProfileChange('youtube')}
                        placeholder={t('accountSettingsPage.youtubePlaceholder')}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="tiktok">{t('accountSettingsPage.tiktokLabel')}</Label>
                      <Input
                        id="tiktok"
                        type="url"
                        value={profileForm.tiktok}
                        onChange={handleProfileChange('tiktok')}
                        placeholder={t('accountSettingsPage.tiktokPlaceholder')}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSavingProfile || isLoadingProfile}
                    className="bg-primary hover:bg-primary-dark text-primary-foreground"
                  >
                    {isSavingProfile ? t('accountSettingsPage.saving') : t('accountSettingsPage.saveChanges')}
                  </Button>
                </div>
              </form>

              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">{t('accountSettingsPage.securityTitle')}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {t('accountSettingsPage.securityDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 gap-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">{t('accountSettingsPage.currentPasswordLabel')}</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t('accountSettingsPage.newPasswordLabel')}</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                        required
                        minLength={8}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t('accountSettingsPage.confirmPasswordLabel')}</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                        minLength={8}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSavingPassword} className="bg-primary hover:bg-primary-dark text-primary-foreground">
                        {isSavingPassword ? t('accountSettingsPage.changingPassword') : t('accountSettingsPage.changePassword')}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Settings;
