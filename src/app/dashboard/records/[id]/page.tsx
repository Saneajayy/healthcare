"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Calendar, User, Tag, FileText, Trash2, BrainCircuit, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Record as PrismaRecord } from "@prisma/client";

export default function RecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [record, setRecord] = useState<PrismaRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await fetch(`/api/records/${id}`);
        if (!res.ok) throw new Error("Record not found");
        const data = await res.json();
        setRecord(data.record);
      } catch (err: any) {
        toast.error(err.message);
        router.push("/dashboard/records");
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this record automatically?")) return;
    try {
      const res = await fetch(`/api/records/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Record deleted");
        router.push("/dashboard/records");
      } else {
        toast.error("Failed to delete record");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading record details...</div>;
  if (!record) return <div className="p-10 text-center text-slate-500">Record not found</div>;

  const isPDF = record.fileUrl.toLowerCase().endsWith(".pdf");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/records">
          <Button variant="ghost" className="text-slate-500 hover:text-slate-900 -ml-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Records
          </Button>
        </Link>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Metadata & AI Summary */}
        <div className="space-y-6 lg:col-span-1">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{record.title}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                <Tag className="w-3 h-3 mr-1" />
                {record.category}
              </Badge>
              <Badge variant="outline" className="text-slate-600">
                <Calendar className="w-3 h-3 mr-1" />
                {format(new Date(record.date), "MMMM d, yyyy")}
              </Badge>
            </div>
          </div>

          <Card className="border-0 shadow-sm shadow-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2 text-slate-400" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {record.doctor && (
                <div>
                  <p className="text-sm text-slate-500 flex items-center">
                    <User className="w-4 h-4 mr-2" /> Referring Doctor
                  </p>
                  <p className="font-medium text-slate-900 ml-6">Dr. {record.doctor}</p>
                </div>
              )}
              {record.notes && (
                <div>
                  <p className="text-sm text-slate-500 mb-1">Additional Notes</p>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {record.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {record.summary ? (
            <Card className="border-0 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-sm shadow-indigo-100 border-indigo-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center text-indigo-900">
                  <BrainCircuit className="w-5 h-5 mr-2 text-indigo-600" />
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                  {record.summary}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-dashed border-slate-300 shadow-none bg-slate-50/50">
               <CardContent className="p-6 text-center text-slate-500 text-sm">
                 <BrainCircuit className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                 No AI summary available for this record.
               </CardContent>
            </Card>
          )}

          <div className="pt-4">
            <a href={record.fileUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open File in New Tab
              </Button>
            </a>
          </div>
        </div>

        {/* Right Column: File Preview */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-0 shadow-md shadow-slate-200/50 h-[calc(100vh-12rem)] overflow-hidden flex flex-col">
            <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50 flex-none">
              <CardTitle className="text-sm font-medium text-slate-600">Document Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative bg-slate-100/50 flex items-center justify-center">
              {isPDF ? (
                <iframe
                  src={record.fileUrl}
                  className="absolute inset-0 w-full h-full border-0"
                  title="PDF Preview"
                />
              ) : (
                <div className="relative w-full h-full p-4 flex items-center justify-center overflow-auto">
                  <img
                    src={record.fileUrl}
                    alt={record.title}
                    className="max-w-full max-h-full object-contain rounded drop-shadow-sm"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
