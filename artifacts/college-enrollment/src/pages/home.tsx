import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Show } from "@clerk/react";
import { ArrowRight, BookOpen, Download, GraduationCap, Users } from "lucide-react";
import { motion } from "framer-motion";

export function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center bg-primary overflow-hidden">
        {/* Abstract pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-primary to-primary"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center text-primary-foreground">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Shape Your Future at <br/>Westview University
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto mb-10"
          >
            Join a community of innovators, leaders, and creators. Admissions for Fall 2025 are now open.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/admission">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8">
                Apply Now
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Explore Programs
              </Button>
            </Link>
            <Show when="signed-in">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 bg-white/20 hover:bg-white/30 text-white border-0">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Show>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6"
          >
            <a href={`${import.meta.env.BASE_URL}app.apk`} download="WestviewUniversity.apk">
              <Button size="sm" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/50 hover:bg-primary-foreground/10 gap-2">
                <Download className="h-4 w-4" />
                Download Android App
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Westview?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide a transformative educational experience that prepares students for meaningful careers and lives of purpose.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Academic Excellence</h3>
              <p className="text-muted-foreground">
                Learn from world-class faculty in rigorous programs designed to challenge and inspire.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-slate-50 border transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovative Research</h3>
              <p className="text-muted-foreground">
                Participate in groundbreaking research across disciplines, from day one of your undergraduate journey.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Vibrant Community</h3>
              <p className="text-muted-foreground">
                Join a diverse and inclusive campus where lifelong friendships are forged and perspectives are broadened.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Ready to take the next step?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-lg">
            Our admissions team is here to help you navigate the application process. 
            Reach out with any questions or start your application today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Contact Admissions
              </Button>
            </Link>
            <Link href="/admission">
              <Button size="lg" className="w-full sm:w-auto">
                Start Application
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
