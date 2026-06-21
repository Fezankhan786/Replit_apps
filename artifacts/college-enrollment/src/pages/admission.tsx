import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  useSubmitApplication, 
  useListCourses, 
  useGetProfile,
  getGetProfileQueryKey,
} from "@workspace/api-client-react";
import { useUser } from "@clerk/react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  dob: z.string().min(1, "Date of birth is required."),
  address: z.string().min(10, "Please enter your full address."),
  courseId: z.coerce.number().min(1, "Please select a course."),
  documentName: z.string().optional(),
});

export function Admission() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isSignedIn, user } = useUser();

  const { data: courses, isLoading: coursesLoading } = useListCourses({});
  const { data: profile } = useGetProfile({ query: { queryKey: getGetProfileQueryKey(), enabled: !!isSignedIn } });
  const submitApplication = useSubmitApplication();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      email: "",
      phone: "",
      dob: "",
      address: "",
      courseId: 0,
      documentName: "",
    },
  });

  // Pre-fill form if user is signed in and profile exists
  useEffect(() => {
    if (isSignedIn && user) {
      form.setValue("studentName", user.fullName || profile?.name || "");
      form.setValue("email", user.primaryEmailAddress?.emailAddress || profile?.email || "");
      
      if (profile?.phone) form.setValue("phone", profile.phone);
      if (profile?.dob) form.setValue("dob", profile.dob);
      if (profile?.address) form.setValue("address", profile.address);
    }
  }, [isSignedIn, user, profile, form]);

  // Pre-select course if passed in URL query
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("courseId");
    if (courseId) {
      form.setValue("courseId", parseInt(courseId, 10));
    }
  }, [form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    submitApplication.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({
            title: "Application Submitted",
            description: "Your application has been received successfully.",
          });
          if (isSignedIn) {
            setLocation("/dashboard");
          } else {
            form.reset();
            // Show success state on form
          }
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Submission Failed",
            description: error.message || "An error occurred while submitting your application.",
          });
        },
      }
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Admissions Application</h1>
          <p className="text-lg text-muted-foreground">
            Take the first step toward your future. Fill out the application form below to apply for admission to Westview University.
          </p>
          {!isSignedIn && (
            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20 text-sm">
              <strong>Already have an account?</strong> <Button variant="link" className="px-1 py-0 h-auto" onClick={() => setLocation("/sign-in")}>Sign in</Button> to auto-fill this form and track your application status.
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Applicant Information</CardTitle>
            <CardDescription>All fields are required unless marked as optional.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="studentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1 (555) 000-0000" {...field} />
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
                        <Textarea placeholder="123 Main St, City, State, Zip" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-6 pt-6 border-t">
                  <h3 className="text-lg font-medium">Academic Program</h3>
                  
                  <FormField
                    control={form.control}
                    name="courseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Program</FormLabel>
                        <Select 
                          onValueChange={(val) => field.onChange(parseInt(val, 10))} 
                          value={field.value ? field.value.toString() : ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a program to apply for" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {coursesLoading ? (
                              <div className="p-2 text-sm text-muted-foreground">Loading programs...</div>
                            ) : (
                              courses?.map((course) => (
                                <SelectItem key={course.id} value={course.id.toString()}>
                                  {course.name} ({course.category})
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="documentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supporting Documents (Optional)</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input type="file" className="cursor-pointer" onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                field.onChange(e.target.files[0].name);
                              }
                            }} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload transcripts, recommendation letters, or essays (PDF, max 5MB).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={submitApplication.isPending}>
                  {submitApplication.isPending ? "Submitting Application..." : "Submit Application"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
