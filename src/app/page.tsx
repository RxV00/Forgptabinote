// src/app/page.tsx
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from '@/components/theme-toggle';
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 lg:px-8 h-16 flex items-center border-b sticky top-0 backdrop-blur-sm bg-background/90 z-10">
        <Link href="/" className="flex items-center justify-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Abinote</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="/features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
          <ThemeToggle />
        </nav>
      </header>

      {/* Hero section */}
      <main className="flex-1">
        <section className="py-24 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="block">Willkommen bei</span>
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Abinote</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Von Schülern für Schüler - Die moderne Plattform für deine Bildungsreise. Organisiere deine Notizen, arbeite zusammen und verbessere deine schulischen Leistungen.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/auth/signup">
                    <Button size="lg" className="rounded-full">Jetzt starten</Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="outline" size="lg" className="rounded-full">Anmelden</Button>
                  </Link>
                </div>
              </div>
              <div className="flex-1 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-1">
                <div className="bg-card rounded-lg shadow-xl h-80 w-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-20 bg-muted/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Warum Abinote?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Entdecke die Vorteile einer speziell für Schüler entwickelten Plattform</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Organisierte Notizen",
                  description: "Alle deine Notizen und Materialien an einem Ort - übersichtlich und leicht zugänglich."
                },
                {
                  title: "Zusammenarbeit",
                  description: "Arbeite nahtlos mit Klassenkameraden zusammen und teile wichtige Informationen."
                },
                {
                  title: "Lernfortschritt",
                  description: "Verfolge deinen Lernfortschritt und verbessere deine Leistungen gezielt."
                },
                {
                  title: "Kalenderfunktion",
                  description: "Behalte den Überblick über Hausaufgaben, Prüfungen und wichtige Termine."
                },
                {
                  title: "Ressourcenbibliothek",
                  description: "Zugriff auf hilfreiche Lernmaterialien und strukturierte Inhalte."
                },
                {
                  title: "Mobile Nutzung",
                  description: "Greife von überall und jedem Gerät auf deine Inhalte zu - auch unterwegs."
                }
              ].map((feature, index) => (
                <Card key={index} className="p-6 hover:shadow-md transition-shadow border-primary/10 hover:border-primary/30">
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Was Schüler über uns sagen</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Erfahrungen von Schülern, die bereits mit Abinote lernen</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote: "Abinote hat mir geholfen, endlich Ordnung in meine Notizen zu bringen. Meine Noten haben sich deutlich verbessert!",
                  author: "Lisa, 16 Jahre"
                },
                {
                  quote: "Die Zusammenarbeitsfunktion ist genial. Unsere Gruppenarbeit ist jetzt viel effizienter und macht mehr Spaß.",
                  author: "Maximilian, 17 Jahre"
                },
                {
                  quote: "Ich kann meine Aufgaben viel besser planen und verpasse keine wichtigen Termine mehr. Absolut empfehlenswert!",
                  author: "Sophie, 15 Jahre"
                }
              ].map((testimonial, index) => (
                <Card key={index} className="p-6 hover:shadow-md transition-shadow border-primary/10 hover:border-primary/30">
                  <div className="space-y-4">
                    <p className="italic text-foreground">"{testimonial.quote}"</p>
                    <p className="font-medium text-primary">{testimonial.author}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-6">Bereit, deine Schulerfahrung zu verbessern?</h2>
            <p className="text-lg mb-8 text-muted-foreground">Melde dich jetzt an und entdecke, wie Abinote deinen Schulalltag organisierter und erfolgreicher machen kann.</p>
            <Link href="/auth/signup">
              <Button size="lg" className="rounded-full px-8">Kostenlos starten</Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-4 max-w-xs">
              <h3 className="text-xl font-bold">Abinote</h3>
              <p className="text-sm text-muted-foreground">Die moderne Lernplattform für Schüler. Organisiere, lerne und verbessere deine schulischen Leistungen.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Produkt</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Preise</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Unternehmen</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Über uns</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Kontakt</Link></li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Rechtliches</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Datenschutz</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">AGB</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Impressum</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Abinote - Alle Rechte vorbehalten.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Instagram</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Twitter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">GitHub</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}