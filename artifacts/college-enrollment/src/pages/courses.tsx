import { useState } from "react";
import { useListCourses } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Clock, DollarSign, Users } from "lucide-react";
import { motion } from "framer-motion";

export function Courses() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");

  const { data: courses, isLoading } = useListCourses({ search, category: category || undefined });

  const categories = ["Engineering", "Business", "Arts", "Science", "Medicine", "Law", "Computing"];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Academic Programs</h1>
        <p className="text-lg text-muted-foreground">
          Explore our wide range of undergraduate and graduate programs designed to prepare you for the future.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search programs by name or description..." 
            className="pl-10 py-6 text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <Button 
            variant={category === "" ? "default" : "outline"} 
            onClick={() => setCategory("")}
            className="whitespace-nowrap"
          >
            All
          </Button>
          {categories.map((c) => (
            <Button 
              key={c}
              variant={category === c ? "default" : "outline"} 
              onClick={() => setCategory(c)}
              className="whitespace-nowrap"
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="flex flex-col">
              <CardHeader>
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent className="flex-1">
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : courses?.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border">
          <h3 className="text-xl font-semibold mb-2">No programs found</h3>
          <p className="text-muted-foreground mb-6">We couldn't find any programs matching your search criteria.</p>
          <Button variant="outline" onClick={() => { setSearch(""); setCategory(""); }}>Clear Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course, i) => (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{course.category}</Badge>
                  </div>
                  <CardTitle className="text-xl line-clamp-2">{course.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">
                    {course.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4" />
                      <span>${course.fees.toLocaleString()}/yr</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span>{course.seats} Seats</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                  <Link href={`/admission?courseId=${course.id}`} className="w-full">
                    <Button className="w-full">Apply for this Program</Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
