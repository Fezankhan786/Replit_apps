import { useState } from "react";
import { 
  useGetAdminStats, 
  useListApplications, 
  useUpdateApplicationStatus,
  useListCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { getListApplicationsQueryKey, getGetAdminStatsQueryKey, getListCoursesQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Users, BookOpen, CheckCircle, XCircle, Clock, Trash2, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const courseSchema = z.object({
  name: z.string().min(2, "Name required"),
  description: z.string().min(10, "Description required"),
  duration: z.string().min(2, "Duration required"),
  fees: z.coerce.number().min(0, "Fees must be positive"),
  category: z.string().min(2, "Category required"),
  seats: z.coerce.number().min(1, "Seats must be at least 1"),
});

export function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: applications, isLoading: appsLoading } = useListApplications({});
  const { data: courses, isLoading: coursesLoading } = useListCourses({});
  
  const updateStatus = useUpdateApplicationStatus();
  const createCourse = useCreateCourse();
  const deleteCourse = useDeleteCourse();

  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<'accept' | 'reject' | null>(null);
  const [notes, setNotes] = useState("");
  
  const [courseDialog, setCourseDialog] = useState(false);

  const courseForm = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: { name: "", description: "", duration: "", fees: 0, category: "", seats: 0 },
  });

  const handleStatusUpdate = () => {
    if (!selectedApp || !actionDialog) return;
    updateStatus.mutate(
      { id: selectedApp.id, data: { status: actionDialog === 'accept' ? 'accepted' : 'rejected', notes: notes || undefined } },
      {
        onSuccess: () => {
          toast({ title: `Application ${actionDialog === 'accept' ? 'Accepted' : 'Rejected'}`, description: `Status updated for ${selectedApp.studentName}` });
          queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
          setActionDialog(null); setSelectedApp(null); setNotes("");
        },
        onError: (err: any) => { toast({ variant: "destructive", title: "Update Failed", description: err.message }); }
      }
    );
  };

  const handleCreateCourse = (data: z.infer<typeof courseSchema>) => {
    createCourse.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Course Created" });
        queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
        setCourseDialog(false);
        courseForm.reset();
      },
      onError: (err: any) => toast({ variant: "destructive", title: "Creation Failed", description: err.message })
    });
  };

  const handleDeleteCourse = (id: number) => {
    if(!confirm("Are you sure you want to delete this course?")) return;
    deleteCourse.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Course Deleted" });
        queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
      },
      onError: (err: any) => toast({ variant: "destructive", title: "Deletion Failed", description: err.message })
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted': return <Badge className="bg-emerald-500 hover:bg-emerald-600"><CheckCircle className="mr-1 h-3 w-3" /> Accepted</Badge>;
      case 'rejected': return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Rejected</Badge>;
      case 'pending': default: return <Badge className="bg-amber-500 hover:bg-amber-600 text-white"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage applications, courses, and view enrollment statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>{statsLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{stats?.totalApplications || 0}</div>}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>{statsLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{stats?.pendingApplications || 0}</div>}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>{statsLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{stats?.acceptedApplications || 0}</div>}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>{statsLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>}</CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications">
          <Card>
            <CardHeader><CardTitle>Recent Applications</CardTitle></CardHeader>
            <CardContent>
              {appsLoading ? (
                <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
              ) : applications && applications.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Applicant</TableHead><TableHead>Course</TableHead>
                        <TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell><div className="font-medium">{app.studentName}</div><div className="text-xs text-muted-foreground">{app.email}</div></TableCell>
                          <TableCell>{app.courseName || `Course #${app.courseId}`}</TableCell>
                          <TableCell>{format(new Date(app.createdAt), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>{getStatusBadge(app.status)}</TableCell>
                          <TableCell className="text-right"><Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>Review</Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : <div className="text-center py-10 text-muted-foreground">No applications found.</div>}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Manage Courses</CardTitle>
              <Button size="sm" onClick={() => setCourseDialog(true)}>Add New Course</Button>
            </CardHeader>
            <CardContent>
              {coursesLoading ? (
                <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
              ) : courses && courses.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Duration</TableHead>
                        <TableHead>Fees</TableHead><TableHead>Seats</TableHead><TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.name}</TableCell><TableCell>{course.category}</TableCell>
                          <TableCell>{course.duration}</TableCell><TableCell>${course.fees.toLocaleString()}</TableCell>
                          <TableCell>{course.seats}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteCourse(course.id)}><Trash2 className="h-4 w-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : <div className="text-center py-10 text-muted-foreground">No courses found.</div>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedApp && !actionDialog} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Review</DialogTitle>
            <DialogDescription>Reviewing application from {selectedApp?.studentName} for {selectedApp?.courseName}</DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="grid grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div><h4 className="text-sm font-medium text-muted-foreground">Contact Info</h4><p className="font-medium">{selectedApp.email}</p><p className="font-medium">{selectedApp.phone}</p></div>
                <div><h4 className="text-sm font-medium text-muted-foreground">Date of Birth</h4><p className="font-medium">{selectedApp.dob}</p></div>
                <div><h4 className="text-sm font-medium text-muted-foreground">Address</h4><p className="font-medium whitespace-pre-wrap">{selectedApp.address}</p></div>
              </div>
              <div className="space-y-4 bg-slate-50 p-4 rounded-lg border">
                <div><h4 className="text-sm font-medium text-muted-foreground">Current Status</h4><div className="mt-1">{getStatusBadge(selectedApp.status)}</div></div>
                <div><h4 className="text-sm font-medium text-muted-foreground">Submission Date</h4><p className="font-medium">{format(new Date(selectedApp.createdAt), 'MMMM dd, yyyy HH:mm')}</p></div>
                {selectedApp.notes && <div><h4 className="text-sm font-medium text-muted-foreground">Notes</h4><p className="font-medium">{selectedApp.notes}</p></div>}
              </div>
            </div>
          )}
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setSelectedApp(null)}>Close</Button>
            {selectedApp?.status === 'pending' && (
              <><Button variant="destructive" onClick={() => setActionDialog('reject')}>Reject Application</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setActionDialog('accept')}>Accept Application</Button></>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!actionDialog} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionDialog === 'accept' ? 'Accept Application' : 'Reject Application'}</DialogTitle>
            <DialogDescription>{actionDialog === 'accept' ? `You are about to accept ${selectedApp?.studentName}'s application. They will be notified.` : `You are about to reject ${selectedApp?.studentName}'s application. They will be notified.`}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Add a note (optional, visible to student)</label>
            <Textarea placeholder={actionDialog === 'accept' ? "Welcome to Westview University! Next steps..." : "Unfortunately, we cannot offer you admission at this time because..."} value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[100px]"/>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)} disabled={updateStatus.isPending}>Cancel</Button>
            <Button variant={actionDialog === 'accept' ? 'default' : 'destructive'} className={actionDialog === 'accept' ? 'bg-emerald-600 hover:bg-emerald-700' : ''} onClick={handleStatusUpdate} disabled={updateStatus.isPending}>
              {updateStatus.isPending ? "Processing..." : `Confirm ${actionDialog === 'accept' ? 'Acceptance' : 'Rejection'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={courseDialog} onOpenChange={setCourseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>Add a new academic program to the curriculum.</DialogDescription>
          </DialogHeader>
          <Form {...courseForm}>
            <form onSubmit={courseForm.handleSubmit(handleCreateCourse)} className="space-y-4">
              <FormField control={courseForm.control} name="name" render={({ field }) => <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={courseForm.control} name="category" render={({ field }) => <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={courseForm.control} name="duration" render={({ field }) => <FormItem><FormLabel>Duration</FormLabel><FormControl><Input placeholder="e.g. 4 Years" {...field} /></FormControl><FormMessage /></FormItem>} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={courseForm.control} name="fees" render={({ field }) => <FormItem><FormLabel>Fees ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={courseForm.control} name="seats" render={({ field }) => <FormItem><FormLabel>Seats</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
              </div>
              <FormField control={courseForm.control} name="description" render={({ field }) => <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
              <DialogFooter>
                <Button type="submit" disabled={createCourse.isPending}>{createCourse.isPending ? "Creating..." : "Create Course"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

    </div>
  );
}

