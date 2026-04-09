"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Search, Filter, FileText, Calendar, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Record as PrismaRecord } from "@prisma/client";

export default function RecordsPage() {
  const [records, setRecords] = useState<PrismaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/records");
      const data = await res.json();
      if (data.records) setRecords(data.records);
    } catch (err) {
      toast.error("Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await fetch(`/api/records/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Record deleted");
        setRecords(records.filter((r) => r.id !== id));
      } else {
        toast.error("Failed to delete record");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (record.doctor && record.doctor.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "All" || record.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Group by month/year for timeline
  const groupedRecords = filteredRecords.reduce((acc, record) => {
    const date = typeof record.date === 'string' ? parseISO(record.date) : new Date(record.date);
    const monthYear = format(date, "MMMM yyyy");
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(record);
    return acc;
  }, {} as Record<string, PrismaRecord[]>);

  const RecordCard = ({ record }: { record: PrismaRecord }) => (
    <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <Link href={`/dashboard/records/${record.id}`} className="hover:text-blue-600 transition-colors">
              <h3 className="font-semibold text-slate-900 text-lg">{record.title}</h3>
            </Link>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                {record.category}
              </span>
              <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" />{format(new Date(record.date), "MMM d, yyyy")}</span>
              {record.doctor && <span>Dr. {record.doctor}</span>}
            </div>
            {record.summary && <p className="text-sm text-slate-600 mt-2 line-clamp-2">{record.summary}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/dashboard/records/${record.id}`}>
            <Button variant="outline" size="sm">View</Button>
          </Link>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(record.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Records</h1>
          <p className="text-slate-500 mt-2">Manage and view your entire medical history.</p>
        </div>
        <Link href="/dashboard/upload">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by title or doctor..." 
            className="pl-9 bg-slate-50 border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val || "All")}>
            <SelectTrigger className="bg-slate-50 border-slate-200">
              <Filter className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Prescription">Prescription</SelectItem>
              <SelectItem value="Lab Report">Lab Report</SelectItem>
              <SelectItem value="Scan">Scan</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="mb-6 bg-slate-100/50 p-1 rounded-lg">
          <TabsTrigger value="timeline" className="rounded-md px-4">Timeline View</TabsTrigger>
          <TabsTrigger value="list" className="rounded-md px-4">List View</TabsTrigger>
        </TabsList>
        
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading records...</div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No records found</h3>
            <p className="text-slate-500">Try adjusting your search or upload a new record.</p>
          </div>
        ) : (
          <>
            <TabsContent value="timeline" className="space-y-8 mt-0 focus-visible:outline-none">
              <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6 space-y-10 pb-4">
                {Object.entries(groupedRecords).map(([monthYear, monthRecords]) => (
                  <div key={monthYear} className="relative">
                    <div className="flex items-center mb-6">
                      <div className="absolute -left-[31px] md:-left-[35px] bg-white p-1">
                        <div className="h-4 w-4 rounded-full border-4 border-blue-600 bg-white" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 ml-6 tracking-tight bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full inline-block text-sm">
                        {monthYear}
                      </h2>
                    </div>
                    <div className="ml-6 space-y-4">
                      {monthRecords.map((record) => (
                        <RecordCard key={record.id} record={record as any} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="space-y-4 mt-0 focus-visible:outline-none">
              <div className="grid gap-4">
                {filteredRecords.map((record) => (
                  <RecordCard key={record.id} record={record as any} />
                ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
