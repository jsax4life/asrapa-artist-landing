import React, { useState, useCallback, useEffect } from 'react';
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { UploadCloud, CheckCircle, XCircle, FileText, ChevronDown, X, Music, Disc } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"; // Added useToast
import { api, ApiError, Artist, Genre } from "@/lib/api"; // Import api, ApiError, Artist, and Genre
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth to get current user

interface UploadFormData {
  title: string;
  duration: number;
  albumId?: string;
  genreId: string;
  collaborators: string[]; // Array of artist IDs
  isExplicit: boolean;
  lyrics?: string;
}

interface AlbumFormData {
  title: string;
  releaseDate: string;
  explicit: boolean;
  genreId: string;
  caption?: string;
  existingSongIds?: string; // Comma-separated string of existing song IDs
  newSongs: Array<{
    title: string;
    duration: number;
    collaborators?: string[];
    isExplicit: boolean;
    lyrics?: string;
  }>;
}

type UploadType = 'single' | 'album';


const dummyAlbums = [
  { id: "66e84ba1a215fec521fab949", title: "My First Album" },
  { id: "66e84ba1a215fec521fab950", title: "Summer Hits EP" },
];

const Upload = () => {
  const [uploadType, setUploadType] = useState<UploadType>('single');
  const [songFile, setSongFile] = useState<File | null>(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [albumCoverPhotoFile, setAlbumCoverPhotoFile] = useState<File | null>(null);
  const [newSongFiles, setNewSongFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [genreOpen, setGenreOpen] = useState(false);
  const [collaboratorsOpen, setCollaboratorsOpen] = useState(false);
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    duration: 0,
    genreId: '',
    isExplicit: false,
    collaborators: [],
    lyrics: '',
  });
  const [albumFormData, setAlbumFormData] = useState<AlbumFormData>({
    title: '',
    releaseDate: '',
    explicit: false,
    genreId: '',
    caption: '',
    existingSongIds: '',
    newSongs: [],
  });
  const { toast } = useToast(); // Added useToast
  const { user } = useAuth(); // Get current user data

  // Fetch artists and genres on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [artistsResponse, genresResponse] = await Promise.all([
          api.getAllArtists(),
          api.getAllGenres()
        ]);
        
        if (artistsResponse.status === 'success' && artistsResponse.data) {
          setArtists(artistsResponse.data.artists);
        }
        
        if (genresResponse.status === 'success' && genresResponse.data) {
          setGenres(genresResponse.data.genres);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error Loading Data",
          description: "Failed to load artists and genres. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleSongFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an audio file (MP3, WAV, FLAC).",
          variant: "destructive",
        });
        setSongFile(null);
        return;
      }
      setSongFile(file);
      setUploadProgress(0);
      setUploadComplete(false);
    }
  }, [toast]);

  const handleCoverPhotoChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (JPEG, PNG, WebP).",
          variant: "destructive",
        });
        setCoverPhotoFile(null);
        return;
      }
      setCoverPhotoFile(file);
    }
  }, [toast]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile.type.startsWith('audio/')) {
        setSongFile(droppedFile);
        setUploadProgress(0);
        setUploadComplete(false);
      } else if (droppedFile.type.startsWith('image/')) {
        setCoverPhotoFile(droppedFile);
      } else {
        toast({
          title: "Unsupported File Type",
          description: "Please drag and drop an audio or image file.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'duration' ? Number(value) : value }));
  }, []);

  const handleSelectChange = useCallback((name: keyof UploadFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!songFile) {
      toast({
        title: "Missing Audio File",
        description: "Please select an audio file to upload.",
        variant: "destructive",
      });
      return;
    }
    if (!coverPhotoFile) {
      toast({
        title: "Missing Cover Photo",
        description: "Please select a cover photo for your song.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('duration', formData.duration.toString());
    formDataToSend.append('genreId', formData.genreId);
    formDataToSend.append('isExplicit', formData.isExplicit.toString());
    if (formData.albumId) formDataToSend.append('albumId', formData.albumId);
    if (formData.collaborators.length > 0) formDataToSend.append('collaborators', JSON.stringify(formData.collaborators));
    if (formData.lyrics) formDataToSend.append('lyrics', formData.lyrics);
    formDataToSend.append('songFile', songFile);
    formDataToSend.append('coverPhoto', coverPhotoFile);

    try {
      await api.uploadSingleSong(formDataToSend);
      setUploadComplete(true);
      toast({
        title: "Upload Successful",
        description: "Your song has been uploaded successfully!",
      });
      // Reset form and files for next upload
      setSongFile(null);
      setCoverPhotoFile(null);
      setFormData({
        title: '',
        duration: 0,
        genreId: '',
        isExplicit: false,
        collaborators: [],
        lyrics: '',
      });
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof ApiError ? error.message : "An unexpected error occurred during upload.";
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0); // Reset progress on completion or error
    }
  }, [songFile, coverPhotoFile, formData, toast]);

  const handleAlbumSubmit = useCallback(async () => {
    if (!albumCoverPhotoFile) {
      toast({
        title: "Missing Album Cover",
        description: "Please select a cover photo for your album.",
        variant: "destructive",
      });
      return;
    }

    if (!albumFormData.title || !albumFormData.releaseDate || !albumFormData.genreId) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields (title, release date, genre).",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formDataToSend = new FormData();
    formDataToSend.append('title', albumFormData.title);
    formDataToSend.append('releaseDate', albumFormData.releaseDate);
    formDataToSend.append('explicit', albumFormData.explicit.toString());
    formDataToSend.append('genreId', albumFormData.genreId);
    if (albumFormData.caption) formDataToSend.append('caption', albumFormData.caption);
    if (albumFormData.existingSongIds) formDataToSend.append('existingSongIds', albumFormData.existingSongIds);
    
    // Add new songs metadata as JSON
    if (newSongFiles.length > 0) {
      const newSongsMetadata = newSongFiles.map((file, index) => ({
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        duration: 0, // This would need to be calculated or provided by user
        collaborators: [],
        isExplicit: albumFormData.explicit,
        lyrics: ""
      }));
      formDataToSend.append('newSongs', JSON.stringify(newSongsMetadata));
    }
    
    formDataToSend.append('coverPhoto', albumCoverPhotoFile);
    
    // Add new song files
    newSongFiles.forEach((file, index) => {
      formDataToSend.append(`songFile${index}`, file);
    });

    try {
      await api.uploadAlbum(formDataToSend);
      setUploadComplete(true);
      toast({
        title: "Album Created Successfully",
        description: "Your album has been created and is pending review!",
      });
      
      // Reset form and files for next upload
      setAlbumCoverPhotoFile(null);
      setNewSongFiles([]);
      setAlbumFormData({
        title: '',
        releaseDate: '',
        explicit: false,
        genreId: '',
        caption: '',
        existingSongIds: '',
        newSongs: [],
      });
    } catch (error) {
      console.error("Album upload error:", error);
      const errorMessage = error instanceof ApiError ? error.message : "An unexpected error occurred during album creation.";
      toast({
        title: "Album Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [albumCoverPhotoFile, albumFormData, newSongFiles, toast]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border bg-card px-6">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-foreground">Upload New Music</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background">

              {/* Upload Type Selection */}
              <Card className="bg-card border-border shadow-card animate-fade-in p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl font-bold text-foreground">Upload Type</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Choose whether you want to upload a single song or create an album
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant={uploadType === 'single' ? 'default' : 'outline'}
                      className={`h-20 flex flex-col items-center justify-center gap-2 ${
                        uploadType === 'single' ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      onClick={() => setUploadType('single')}
                    >
                      <Music className="h-6 w-6" />
                      <span className="font-medium">Single Upload</span>
                      <span className="text-xs opacity-80">Upload one song</span>
                    </Button>
                    <Button
                      variant={uploadType === 'album' ? 'default' : 'outline'}
                      className={`h-20 flex flex-col items-center justify-center gap-2 ${
                        uploadType === 'album' ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      onClick={() => setUploadType('album')}
                    >
                      <Disc className="h-6 w-6" />
                      <span className="font-medium">Album Upload</span>
                      <span className="text-xs opacity-80">Create an album with multiple songs</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Single Upload Form */}
              {uploadType === 'single' && (
                <>
                  {/* Audio File Upload Area */}
                  <Card className="bg-card border-border shadow-card animate-fade-in p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl font-bold text-foreground">Audio File Upload</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Drag & drop your audio file here, or click to browse. Supported formats: MP3, WAV, FLAC (Max size: 50MB)
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-10 text-center cursor-pointer hover:bg-accent/10 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('song-file-input')?.click()}
                  >
                    {songFile ? (
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-primary mb-3" />
                        <p className="text-foreground font-medium">{songFile.name}</p>
                        <p className="text-muted-foreground text-sm">{(songFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        {isUploading && (
                          <div className="w-full mt-4">
                            <Progress value={uploadProgress} className="w-full" />
                            <p className="text-sm text-muted-foreground mt-2">Uploading... {uploadProgress}%</p>
                          </div>
                        )}
                        {uploadComplete && (
                          <p className="text-green-500 text-sm mt-2 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" /> Upload Complete!
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <UploadCloud className="h-12 w-12 text-muted-foreground mb-3" />
                        <p className="text-foreground font-medium">Drag & Drop Song File or Click to Upload</p>
                        <p className="text-muted-foreground text-sm mt-1">Supported formats: MP3, WAV, FLAC</p>
                      </div>
                    )}
                    <input 
                      id="song-file-input"
                      type="file" 
                      accept=".mp3,.wav,.flac" 
                      className="hidden" 
                      onChange={handleSongFileChange}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Cover Photo Upload Area */}
              <Card className="bg-card border-border shadow-card animate-fade-in p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl font-bold text-foreground">Cover Photo Upload</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Drag & drop your cover photo here, or click to browse. Supported formats: JPEG, PNG, WebP (Max size: 5MB)
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-10 text-center cursor-pointer hover:bg-accent/10 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('cover-photo-input')?.click()}
                  >
                    {coverPhotoFile ? (
                      <div className="flex flex-col items-center">
                        <img src={URL.createObjectURL(coverPhotoFile)} alt="Cover Preview" className="h-24 w-24 object-cover rounded-md mb-3" />
                        <p className="text-foreground font-medium">{coverPhotoFile.name}</p>
                        <p className="text-muted-foreground text-sm">{(coverPhotoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <UploadCloud className="h-12 w-12 text-muted-foreground mb-3" />
                        <p className="text-foreground font-medium">Drag & Drop Cover Photo or Click to Upload</p>
                        <p className="text-muted-foreground text-sm mt-1">Supported formats: JPEG, PNG, WebP</p>
                      </div>
                    )}
                    <input 
                      id="cover-photo-input"
                      type="file" 
                      accept=".jpeg,.jpg,.png,.webp" 
                      className="hidden" 
                      onChange={handleCoverPhotoChange}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Metadata Form */}
              <Card className="bg-card border-border shadow-card animate-fade-in p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl font-bold text-foreground">Track Details</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Provide information about your track. This helps listeners find your music.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" value={formData.title} onChange={handleFormChange} placeholder="Track Title" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (seconds)</Label>
                      <Input id="duration" name="duration" type="number" value={formData.duration === 0 ? '' : formData.duration} onChange={handleFormChange} placeholder="e.g., 233" required min="1" max="3600" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="albumId">Album (Optional)</Label>
                      <Select name="albumId" value={formData.albumId || ''} onValueChange={(value) => handleSelectChange('albumId', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an album" />
                        </SelectTrigger>
                        <SelectContent>
                          {dummyAlbums.map((album) => (
                            <SelectItem key={album.id} value={album.id}>{album.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="genreId">Genre</Label>
                      <Popover open={genreOpen} onOpenChange={setGenreOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={genreOpen}
                            className="w-full justify-between"
                            disabled={isLoadingData}
                          >
                            {formData.genreId
                              ? genres.find((genre) => genre._id === formData.genreId)?.name
                              : "Select genre..."}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search genres..." />
                            <CommandList>
                              <CommandEmpty>No genre found.</CommandEmpty>
                              <CommandGroup>
                                {genres.map((genre) => (
                                  <CommandItem
                                    key={genre._id}
                                    value={genre.name}
                                    onSelect={() => {
                                      setFormData(prev => ({ ...prev, genreId: genre._id }));
                                      setGenreOpen(false);
                                    }}
                                  >
                                    {genre.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="collaborators">Collaborators (Optional)</Label>
                      <Popover open={collaboratorsOpen} onOpenChange={setCollaboratorsOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={collaboratorsOpen}
                            className="w-full justify-between"
                            disabled={isLoadingData}
                          >
                            {formData.collaborators.length > 0 
                              ? `${formData.collaborators.length} collaborator(s) selected`
                              : "Select collaborators..."}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search artists..." />
                            <CommandList>
                              <CommandEmpty>No artist found.</CommandEmpty>
                              <CommandGroup>
                                {artists
                                  .filter((artist) => artist._id !== user?.id) // Filter out current user
                                  .map((artist) => {
                                    const isSelected = formData.collaborators.includes(artist._id);
                                    return (
                                      <CommandItem
                                        key={artist._id}
                                        value={`${artist.stageName} ${artist.bio}`}
                                        onSelect={() => {
                                          setFormData(prev => ({
                                            ...prev,
                                            collaborators: isSelected
                                              ? prev.collaborators.filter(id => id !== artist._id)
                                              : [...prev.collaborators, artist._id]
                                          }));
                                        }}
                                      >
                                        <div className="flex items-center justify-between w-full">
                                          <div>
                                            <div className="font-medium">{artist.stageName}</div>
                                            <div className="text-sm text-muted-foreground">{artist.bio}</div>
                                          </div>
                                          {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                                        </div>
                                      </CommandItem>
                                    );
                                  })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {formData.collaborators.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.collaborators.map((collaboratorId) => {
                            const artist = artists.find(a => a._id === collaboratorId);
                            return artist ? (
                              <div key={collaboratorId} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                                {artist.fullName}
                                <X 
                                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      collaborators: prev.collaborators.filter(id => id !== collaboratorId)
                                    }));
                                  }}
                                />
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 flex items-center gap-2">
                      <Input 
                        id="isExplicit" 
                        name="isExplicit" 
                        type="checkbox" 
                        checked={formData.isExplicit}
                        onChange={(e) => handleSelectChange('isExplicit', e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="isExplicit">Explicit Content</Label>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="lyrics">Lyrics (Optional, Max 10,000 characters)</Label>
                      <Textarea 
                        id="lyrics" 
                        name="lyrics" 
                        value={formData.lyrics || ''} 
                        onChange={handleFormChange} 
                        placeholder="Enter song lyrics here..." 
                        rows={6} 
                        maxLength={10000}
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button type="submit" disabled={!songFile || !coverPhotoFile || isUploading} className="bg-primary hover:bg-primary-dark text-primary-foreground flex items-center gap-2">
                        {isUploading ? 'Uploading...' : 'Submit Track'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
                </>
              )}

              {/* Album Upload Form */}
              {uploadType === 'album' && (
                <>
                  {/* Album Cover Photo Upload */}
                  <Card className="bg-card border-border shadow-card animate-fade-in p-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-xl font-bold text-foreground">Album Cover Photo</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Upload a cover photo for your album. Supported formats: JPEG, PNG, WebP (Max size: 5MB)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                      <div 
                        className="border-2 border-dashed border-border rounded-lg p-10 text-center cursor-pointer hover:bg-accent/10 transition-colors"
                        onClick={() => document.getElementById('album-cover-input')?.click()}
                      >
                        {albumCoverPhotoFile ? (
                          <div className="flex flex-col items-center">
                            <img src={URL.createObjectURL(albumCoverPhotoFile)} alt="Album Cover Preview" className="h-24 w-24 object-cover rounded-md mb-3" />
                            <p className="text-foreground font-medium">{albumCoverPhotoFile.name}</p>
                            <p className="text-muted-foreground text-sm">{(albumCoverPhotoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <UploadCloud className="h-12 w-12 text-muted-foreground mb-3" />
                            <p className="text-foreground font-medium">Click to Upload Album Cover</p>
                            <p className="text-muted-foreground text-sm mt-1">Supported formats: JPEG, PNG, WebP</p>
                          </div>
                        )}
                        <input 
                          id="album-cover-input"
                          type="file" 
                          accept=".jpeg,.jpg,.png,.webp" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              if (!file.type.startsWith('image/')) {
                                toast({
                                  title: "Invalid File Type",
                                  description: "Please select an image file (JPEG, PNG, WebP).",
                                  variant: "destructive",
                                });
                                return;
                              }
                              setAlbumCoverPhotoFile(file);
                            }
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Album Details Form */}
                  <Card className="bg-card border-border shadow-card animate-fade-in p-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-xl font-bold text-foreground">Album Details</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Provide information about your album
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="album-title">Album Title</Label>
                          <Input 
                            id="album-title" 
                            value={albumFormData.title} 
                            onChange={(e) => setAlbumFormData(prev => ({ ...prev, title: e.target.value }))} 
                            placeholder="Album Title" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="release-date">Release Date</Label>
                          <Input 
                            id="release-date" 
                            type="date" 
                            value={albumFormData.releaseDate} 
                            onChange={(e) => setAlbumFormData(prev => ({ ...prev, releaseDate: e.target.value }))} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="album-genre">Genre</Label>
                          <Popover open={genreOpen} onOpenChange={setGenreOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={genreOpen}
                                className="w-full justify-between"
                                disabled={isLoadingData}
                              >
                                {albumFormData.genreId
                                  ? genres.find((genre) => genre._id === albumFormData.genreId)?.name
                                  : "Select genre..."}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Search genres..." />
                                <CommandList>
                                  <CommandEmpty>No genre found.</CommandEmpty>
                                  <CommandGroup>
                                    {genres.map((genre) => (
                                      <CommandItem
                                        key={genre._id}
                                        value={genre.name}
                                        onSelect={() => {
                                          setAlbumFormData(prev => ({ ...prev, genreId: genre._id }));
                                          setGenreOpen(false);
                                        }}
                                      >
                                        {genre.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2 flex items-center gap-2">
                          <Input 
                            id="album-explicit" 
                            type="checkbox" 
                            checked={albumFormData.explicit}
                            onChange={(e) => setAlbumFormData(prev => ({ ...prev, explicit: e.target.checked }))}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="album-explicit">Explicit Content</Label>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="album-caption">Caption (Optional)</Label>
                          <Textarea 
                            id="album-caption" 
                            value={albumFormData.caption || ''} 
                            onChange={(e) => setAlbumFormData(prev => ({ ...prev, caption: e.target.value }))} 
                            placeholder="Describe your album..." 
                            rows={3} 
                            maxLength={500}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="existing-songs">Existing Songs (Optional)</Label>
                          <Input 
                            id="existing-songs" 
                            value={albumFormData.existingSongIds || ''} 
                            onChange={(e) => setAlbumFormData(prev => ({ ...prev, existingSongIds: e.target.value }))} 
                            placeholder="Comma-separated song IDs (e.g., 68afb9446a763e7b7e5ed716, 68afdfd76a763e7b7e5ed90d)"
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter the IDs of songs you've already uploaded that you want to include in this album
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* New Songs Upload */}
                  <Card className="bg-card border-border shadow-card animate-fade-in p-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-xl font-bold text-foreground">New Songs</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Upload new songs for your album. You can upload multiple audio files at once.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                      <div 
                        className="border-2 border-dashed border-border rounded-lg p-10 text-center cursor-pointer hover:bg-accent/10 transition-colors"
                        onClick={() => document.getElementById('new-songs-input')?.click()}
                      >
                        {newSongFiles.length > 0 ? (
                          <div className="flex flex-col items-center">
                            <FileText className="h-12 w-12 text-primary mb-3" />
                            <p className="text-foreground font-medium">{newSongFiles.length} song(s) selected</p>
                            <div className="mt-2 space-y-1">
                              {newSongFiles.map((file, index) => (
                                <p key={index} className="text-sm text-muted-foreground">{file.name}</p>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <UploadCloud className="h-12 w-12 text-muted-foreground mb-3" />
                            <p className="text-foreground font-medium">Click to Upload New Songs</p>
                            <p className="text-muted-foreground text-sm mt-1">Supported formats: MP3, WAV, FLAC</p>
                          </div>
                        )}
                        <input 
                          id="new-songs-input"
                          type="file" 
                          accept=".mp3,.wav,.flac" 
                          multiple
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files) {
                              const files = Array.from(e.target.files);
                              const validFiles = files.filter(file => file.type.startsWith('audio/'));
                              if (validFiles.length !== files.length) {
                                toast({
                                  title: "Invalid File Type",
                                  description: "Some files were not audio files and were skipped.",
                                  variant: "destructive",
                                });
                              }
                              setNewSongFiles(validFiles);
                            }
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Album Submit Button */}
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleAlbumSubmit}
                      disabled={!albumCoverPhotoFile || !albumFormData.title || !albumFormData.releaseDate || !albumFormData.genreId || isUploading}
                      className="bg-primary hover:bg-primary-dark text-primary-foreground flex items-center gap-2"
                    >
                      {isUploading ? 'Creating Album...' : 'Create Album'}
                    </Button>
                  </div>
                </>
              )}

            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Upload;
