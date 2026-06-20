import { useEffect } from "react";
import { useGetMyApplications, useGetProfile, useUpdateProfile } from "@workspace/api-client-react";
import { useUser } from "@clerk/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().optional(),
  dob: z.string().optional(),
  address: z.string().optional(),
});

export function Dashboard() {
  const { user } = useUser();
  const { toast } = useToast();
  
  const { data: applications, isLoading: appsLoading } = useGetMyApplications();
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useGetProfile();
  const updateProfile = useUpdateProfile();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      dob: "",
      address: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || user?.fullName || "",
        phone: profile.phone || "",
        dob: profile.dob || "",
        address: profile.address || "",
      });
    } else if (user) {
      form.reset({
        name: user.fullName || "",
        phone: "",
        dob: "",
        address: "",
      });
    }
  }, [profile, user, form]);

  function onSubmit(values: z.infer<typeof profileSchema>) {
    updateProfile.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({
            title: "Profile Updated",
            description: "Your profile information has been saved successfully.",
          });
          refetchProfile();
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "Failed to update profile.",
          });
        },
      }
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600"><CheckCircle className="mr-1 h-3 w-3" /> Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back, {user?.firstName || 'Student'}. Manage your applications and profile here.</p>
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Application History</CardTitle>
              <CardDescription>Track the status of your university applications.</CardDescription>
            </CardHeader>
            <CardContent>
              {appsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : applications && applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-slate-50/50">
                      <div className="flex items-start gap-4 mb-4 sm:mb-0">
                        <div className="p-2 bg-primary/10 rounded-full mt-1">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{app.courseName || `Course #${app.courseId}`}</h4>
                          <p className="text-sm text-muted-foreground">
                            Applied on {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                          </p>
                          {app.notes && (
                            <div className="mt-2 text-sm p-3 bg-white border rounded-md">
                              <strong>Note from Admissions:</strong> {app.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center self-start sm:self-center">
                        {getStatusBadge(app.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-6">You haven't submitted any applications to Westview University.</p>
                  <Button onClick={() => window.location.href = '/courses'}>Explore Programs</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your contact details and address. This information will be used for auto-filling future applications.</CardDescription>
            </CardHeader>
            <CardContent>
              {profileLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input value={user?.primaryEmailAddress?.emailAddress || ""} disabled />
                        </FormControl>
                        <FormDescription>Email is managed via Clerk authentication.</FormDescription>
                      </FormItem>

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mailing Address</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={updateProfile.isPending}>
                      {updateProfile.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
