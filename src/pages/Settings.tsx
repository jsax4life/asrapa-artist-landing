import React, { useState } from 'react';
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
import { COUNTRIES, CHAD_CITIES } from "@/lib/countries";
import artistProfile from "@/assets/images/artist-profile.jpg";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    stageName: user?.stageName || '',
    email: user?.email || '',
    country: user?.country || '',
    city: user?.city || '',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [bio, setBio] = useState(user?.bio || '');
  const [isSavingBio, setIsSavingBio] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleProfileChange = (field: keyof typeof profileForm) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfileForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSavingProfile(true);
    const payload = {
      ...profileForm,
      ...(profileForm.country === 'Tchad' ? {} : { city: '' }),
    };
    try {
      await api.updateArtistProfile(payload);
      updateUser(payload);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées.",
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : "Impossible de mettre à jour le profil.";
      toast({
        title: "Échec de la mise à jour",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleBioSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSavingBio(true);
    try {
      await api.updateArtistProfile({ bio });
      updateUser({ bio });
      toast({
        title: "Biographie mise à jour",
        description: "Votre biographie a été enregistrée.",
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : "Impossible de mettre à jour la biographie.";
      toast({
        title: "Échec de la mise à jour",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSavingBio(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Les mots de passe ne correspondent pas",
        description: "Vérifiez la confirmation de votre nouveau mot de passe.",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Mot de passe trop court",
        description: "Le nouveau mot de passe doit contenir au moins 8 caractères.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingPassword(true);
    try {
      await api.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès.",
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : "Impossible de modifier le mot de passe.";
      toast({
        title: "Échec de la modification",
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
            <h2 className="text-lg font-semibold text-foreground">Paramètres</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background max-w-3xl">

              {/* Bannière de profil */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Bannière de profil</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Affichée en haut de votre profil public, derrière votre photo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BannerImageUploader />
                </CardContent>
              </Card>

              {/* Photo de profil */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Photo de profil</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Visible par vos fans et sur votre tableau de bord.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <ProfilePhotoUploader fallbackSrc={artistProfile} size="lg" />
                  <p className="text-sm text-muted-foreground">
                    Cliquez sur l'icône appareil photo pour changer votre photo. Formats acceptés : JPEG, PNG, WebP.
                  </p>
                </CardContent>
              </Card>

              {/* Informations du compte */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Informations du compte</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Votre identité publique et vos coordonnées.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nom complet</Label>
                      <Input
                        id="fullName"
                        value={profileForm.fullName}
                        onChange={handleProfileChange('fullName')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stageName">Nom de scène</Label>
                      <Input
                        id="stageName"
                        value={profileForm.stageName}
                        onChange={handleProfileChange('stageName')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileChange('email')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Pays</Label>
                      <Select
                        value={profileForm.country}
                        onValueChange={(value) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            country: value,
                            city: value === 'Tchad' ? prev.city : '',
                          }))
                        }
                      >
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Sélectionnez votre pays" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {profileForm.country === 'Tchad' && (
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville</Label>
                        <Select
                          value={profileForm.city}
                          onValueChange={(value) => setProfileForm((prev) => ({ ...prev, city: value }))}
                        >
                          <SelectTrigger id="city">
                            <SelectValue placeholder="Sélectionnez votre ville" />
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
                    )}
                    <div className="md:col-span-2 flex justify-end">
                      <Button type="submit" disabled={isSavingProfile} className="bg-primary hover:bg-primary-dark text-primary-foreground">
                        {isSavingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Biographie */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Biographie</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Présentez-vous à vos fans. Visible sur votre profil public.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBioSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bio">Votre biographie</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Parlez de votre parcours, votre style musical, vos influences..."
                        rows={5}
                        maxLength={1000}
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {bio.length}/1000
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSavingBio} className="bg-primary hover:bg-primary-dark text-primary-foreground">
                        {isSavingBio ? 'Enregistrement...' : 'Enregistrer la biographie'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Sécurité */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Sécurité</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Changez votre mot de passe régulièrement pour protéger votre compte.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 gap-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
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
                      <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
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
                        {isSavingPassword ? 'Modification...' : 'Changer le mot de passe'}
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
