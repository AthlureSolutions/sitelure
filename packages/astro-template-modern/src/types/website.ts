export const placeholderImage = "https://freesvg.org/img/Placeholder.png";

// Theme and Styling
export interface ColorSet {
  default: string;
  light: string;
  dark: string;
}

export interface ThemeConfig {
  colors: {
    primary: ColorSet;
    secondary: ColorSet;
    accent: ColorSet;
    action: ColorSet;
  };
}

export interface Typography {
  heading: string;
  body: string;
}

// Common Components
export interface Link {
  text: string;
  href: string;
}

export interface Logo {
  src: string;
  alt: string;
}

export interface Navigation {
  links: Link[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface Footer {
  businessInfo: BusinessInfo;
  socialLinks: SocialLink[];
  quickLinks: Link[];
}

// Section Types
export interface HeroSection {
  headline: string;
  subheadline: string;
  backgroundImage?: string;
  cta: {
    primary: Link;
    secondary?: Link;
  };
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
  image?: string;
  link?: string;
}

export interface FeaturesSection {
  title?: string;
  subtitle?: string;
  learnMoreText?: string;
  items: Feature[];
}

export interface Quote {
  text: string;
  author: string;
  role?: string;
}

export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  icon: string;
  heroImage: string;
  features: Feature[];
  quote: Quote;
}

export interface ServicesSection {
  title: string;
  subtitle: string;
  learnMoreText: string;
  ctaText: string;
  ctaLink: string;
  items: Service[];
}

export interface Value {
  title: string;
  description: string;
  icon: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface StorySection {
  title: string;
  content: string;
  image: string;
  imageAlt: string;
  quote?: string;
}

export interface ValuesSection {
  title: string;
  subtitle: string;
  items: Value[];
}

export interface StatsSection {
  title: string;
  subtitle: string;
  items: Stat[];
}

export interface Mission {
  title: string;
  description: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea';
  required?: boolean;
  placeholder?: string;
}

export interface ContactForm {
  title: string;
  fields: FormField[];
  submitText?: string;
}

export interface Location {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapEmbed?: string;
}

export interface LocationsSection {
  title: string;
  subtitle?: string;
  items: Location[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
}

export interface TestimonialsSection {
  title: string;
  subtitle: string;
  items: Testimonial[];
}

// Page Types
export interface HomePage {
  hero: HeroSection;
  quote: Quote;
  features: FeaturesSection;
  services: ServicesSection;
  testimonials: TestimonialsSection;
}

export interface AboutPage {
  hero: HeroSection;
  mission: Mission;
  story: StorySection;
  values: ValuesSection;
  stats: StatsSection;
}

export interface ServicesPage {
  hero: HeroSection;
  services: ServicesSection;
}

export interface ServicePage {
  hero: HeroSection;
  features: FeaturesSection;
  quote: Quote;
}

export interface ContactPage {
  hero: HeroSection;
  form: ContactForm;
  locations: Location[];
}

// Site Configuration
export interface SiteConfig {
  name: string;
  description: string;
  defaultImage?: string;
  logo?: Logo;
  branding: {
    theme: ThemeConfig;
    typography: Typography;
  };
  navigation: Navigation;
  footer: Footer;
}

// Main Website Data Structure
export interface WebsiteData {
  site: SiteConfig;
  pages: {
    home: HomePage;
    about: AboutPage;
    services: ServicesPage;
    servicePages: {
      [id: string]: ServicePage;
    };
    contact: ContactPage;
  };
} 