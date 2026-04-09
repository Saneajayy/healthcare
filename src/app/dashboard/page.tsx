import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) return null;

  const totalRecords = await prisma.record.count({
    where: { userId: session.user.id }
  });

  const recentRecords = await prisma.record.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const categoryCounts = await prisma.record.groupBy({
    by: ['category'],
    where: { userId: session.user.id },
    _count: true
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-2">Welcome back, {session.user.name}</p>
        </div>
        <Link href="/dashboard/upload">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Upload className="mr-2 h-4 w-4" />
            Upload New Record
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-sm shadow-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalRecords}</div>
          </CardContent>
        </Card>
        
        {categoryCounts.map((cat) => (
          <Card key={cat.category} className="border-0 shadow-sm shadow-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{cat.category}s</CardTitle>
              <FileText className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{cat._count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm shadow-slate-200 border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-blue-600" />
            Recent Uploads
          </h2>
          <Link href="/dashboard/records" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View All
          </Link>
        </div>
        
        {recentRecords.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <Upload className="h-12 w-12 text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-900">No records yet</p>
            <p className="mb-4">Upload your first medical record to get started.</p>
            <Link href="/dashboard/upload">
              <Button variant="outline">Upload Record</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentRecords.map((record) => (
              <div key={record.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-900">{record.title}</h3>
                  <div className="flex items-center text-sm text-slate-500 mt-1 space-x-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {record.category}
                    </span>
                    <span>•</span>
                    <span>{format(new Date(record.date), "MMM d, yyyy")}</span>
                    {record.doctor && (
                      <>
                        <span>•</span>
                        <span>Dr. {record.doctor}</span>
                      </>
                    )}
                  </div>
                </div>
                <Link href={`/dashboard/records/${record.id}`}>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    View
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
