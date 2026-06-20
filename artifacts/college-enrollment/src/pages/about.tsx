import { Card, CardContent } from "@/components/ui/card";
import { Building, BookOpen, Users, Trophy } from "lucide-react";

export function About() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Westview University</h1>
          <p className="text-xl text-primary-foreground/80 leading-relaxed">
            Founded on the principle that education should be both rigorous and relevant, 
            Westview University has been shaping leaders since 1965.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-4xl font-bold text-foreground mb-2">1965</h3>
              <p className="text-muted-foreground font-medium">Founded</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-4xl font-bold text-foreground mb-2">5,000+</h3>
              <p className="text-muted-foreground font-medium">Alumni</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-4xl font-bold text-foreground mb-2">40+</h3>
              <p className="text-muted-foreground font-medium">Programs</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-4xl font-bold text-foreground mb-2">95%</h3>
              <p className="text-muted-foreground font-medium">Placement Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To discover, preserve, and disseminate knowledge; produce creative work; 
                and promote a culture of broad inquiry throughout and beyond the Westview community.
                We prepare students for lives of meaning, purpose, and professional success.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Westview University aspires to be a preeminent global institution 
                known for its commitment to academic excellence, innovative research, 
                and the development of ethical leaders who make a positive impact on society.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">A Legacy of Excellence</h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Westview University was established in 1965 by a group of visionary educators who believed 
              that higher education should be deeply connected to the needs of a rapidly changing world. 
              What began as a small liberal arts college with just 300 students has grown into a comprehensive 
              university recognized for its academic rigor and innovative spirit.
            </p>
            <p>
              Throughout our history, we have remained committed to our founding principles while 
              continuously evolving to meet the challenges of each new era. Today, our 5,000+ alumni 
              can be found leading organizations, driving scientific discovery, and enriching communities 
              across the globe.
            </p>
            <p>
              As we look to the future, Westview University continues to invest in cutting-edge facilities, 
              world-class faculty, and programs that prepare our students not just for their first job, 
              but for a lifetime of learning and leadership.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
