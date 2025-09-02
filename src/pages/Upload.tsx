import React, { useState, useCallback } from 'react';
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, CheckCircle, XCircle, FileText } from "lucide-react";

interface UploadFormData {
  title: string;
  artist: string;
  album?: string;
  genre: string;
  releaseDate: string;
  description?: string;
}

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    artist: '',
    album: '',
    genre: '',
    releaseDate: '',
    description: '',
  });

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setUploadProgress(0);
      setUploadComplete(false);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
      setUploadProgress(0);
      setUploadComplete(false);
    }
  }, []);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((name: keyof UploadFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadComplete(true);
        alert("File uploaded successfully!");
        // Reset form and file for next upload
        setFile(null);
        setFormData({
          title: '',
          artist: '',
          album: '',
          genre: '',
          releaseDate: '',
          description: '',
        });
      }
    }, 200);
  }, [file, formData]);

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

              {/* Upload Area */}
              <Card className="bg-card border-border shadow-card animate-fade-in p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl font-bold text-foreground">Audio File Upload</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Drag & drop your audio file here, or click to browse. (e.g., MP3, WAV, FLAC)
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-10 text-center cursor-pointer hover:bg-accent/10 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('audio-file-input')?.click()}
                  >
                    {file ? (
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-primary mb-3" />
                        <p className="text-foreground font-medium">{file.name}</p>
                        <p className="text-muted-foreground text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
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
                        <p className="text-foreground font-medium">Drag & Drop or Click to Upload</p>
                        <p className="text-muted-foreground text-sm mt-1">Supported formats: MP3, WAV, FLAC</p>
                      </div>
                    )}
                    <input 
                      id="audio-file-input"
                      type="file" 
                      accept=".mp3,.wav,.flac" 
                      className="hidden" 
                      onChange={handleFileChange}
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
                      <Label htmlFor="artist">Artist Name</Label>
                      <Input id="artist" name="artist" value={formData.artist} onChange={handleFormChange} placeholder="Your Artist Name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="album">Album (Optional)</Label>
                      <Input id="album" name="album" value={formData.album} onChange={handleFormChange} placeholder="Album Title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="genre">Genre</Label>
                      <Select name="genre" value={formData.genre} onValueChange={(value) => handleSelectChange('genre', value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a genre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pop">Pop</SelectItem>
                          <SelectItem value="rock">Rock</SelectItem>
                          <SelectItem value="hip-hop">Hip Hop</SelectItem>
                          <SelectItem value="electronic">Electronic</SelectItem>
                          <SelectItem value="jazz">Jazz</SelectItem>
                          <SelectItem value="classical">Classical</SelectItem>
                          <SelectItem value="rnb">R&B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="releaseDate">Release Date</Label>
                      <Input id="releaseDate" name="releaseDate" type="date" value={formData.releaseDate} onChange={handleFormChange} required />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea id="description" name="description" value={formData.description} onChange={handleFormChange} placeholder="Tell us about your track" rows={4} />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button type="submit" disabled={!file || isUploading} className="bg-primary hover:bg-primary-dark text-primary-foreground flex items-center gap-2">
                        {isUploading ? 'Uploading...' : 'Submit Track'}
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

export default Upload;
