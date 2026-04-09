"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, UploadCloud, FileType2 } from "lucide-react";
import { toast } from "sonner";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [doctor, setDoctor] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload File
      setStatusText("Uploading file...");
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("File upload failed");
      const { fileUrl } = await uploadRes.json();

      // 2. Generate AI Summary (Optional/Silent fail if Error)
      setStatusText("Generating AI Summary...");
      let summary = "";
      try {
        const aiRes = await fetch("/api/ai/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileUrl }),
        });
        if (aiRes.ok) {
          const aiData = await aiRes.json();
          summary = aiData.summary;
        }
      } catch (err) {
        console.warn("AI summary generation failed", err);
      }

      // 3. Save Record to Database
      setStatusText("Saving record...");
      const saveRes = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          date,
          doctor,
          notes,
          fileUrl,
          summary,
        }),
      });

      if (!saveRes.ok) throw new Error("Failed to save record");

      toast.success("Record uploaded successfully!");
      router.push("/dashboard/records");
      router.refresh();

    } catch (error: any) {
      toast.error(error.message || "An error occurred during upload");
      setLoading(false);
      setStatusText("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Upload Record</h1>
        <p className="text-slate-500 mt-2">Add a new medical document to your secure vault.</p>
      </div>

      <Card className="border-0 shadow-xl shadow-slate-200/50">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Document Details</CardTitle>
            <CardDescription>Upload a PDF or Image of your medical report.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* File Upload Area */}
            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-slate-400'}`}>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
              />
              <Label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                {file ? (
                  <>
                    <FileType2 className="h-10 w-10 text-blue-500 mb-2" />
                    <span className="font-medium text-slate-900">{file.name}</span>
                    <span className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
                    <span className="font-medium text-blue-600">Click to upload</span>
                    <span className="text-sm text-slate-500 mt-1">or drag and drop</span>
                    <span className="text-xs text-slate-400 mt-2">PDF, PNG, JPG (max. 10MB)</span>
                  </>
                )}
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title *</Label>
                <Input
                  id="title"
                  required
                  placeholder="e.g., Blood Test Results"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={(val) => setCategory(val || "")}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prescription">Prescription</SelectItem>
                    <SelectItem value="Lab Report">Lab Report</SelectItem>
                    <SelectItem value="Scan">Scan</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date of Record *</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor Name <span className="text-slate-400">(Optional)</span></Label>
                <Input
                  id="doctor"
                  placeholder="Dr. Smith"
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes <span className="text-slate-400">(Optional)</span></Label>
              <Textarea
                id="notes"
                placeholder="Any personal notes about this record..."
                className="resize-none h-24"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
          
          <CardFooter className="bg-slate-50 border-t border-slate-100 rounded-b-xl flex justify-end">
            <Button type="button" variant="ghost" className="mr-2" onClick={() => router.back()} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-32" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {statusText || "Saving"}
                </>
              ) : (
                "Save Record"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
