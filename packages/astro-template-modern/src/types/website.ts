export const placeholderImage = "https://freesvg.org/img/Placeholder.png";

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
  typography: {
    heading: string;
    body: string;
  };
}

export interface Link {
  text: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
  image?: string;
  link?: string;
}

export interface FeaturesSection {
  title: string;
  subtitle: string;
  learnMoreText: string;
  items: Feature[];
}

export interface Quote {
  text: string;
  author?: string;
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
  services: Service[];
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

export interface Mission {
  title: string;
  description: string;
}

export interface Story {
  title: string;
  content: string;
  image: string;
  imageAlt: string;
}

export interface About {
  title: string;
  subtitle: string;
  heroImage: string;
  ctaText: string;
  ctaLink: string;
  quote: string;
  mission: Mission;
  story: Story;
  values: Value[];
  stats: Stat[];
}

export interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: Array<{
    value: string;
    label: string;
  }>;
}

export interface ContactForm {
  title: string;
  submitText: string;
  fields: FormField[];
}

export interface Location {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapEmbed: string;
}

export interface Contact {
  title: string;
  subtitle: string;
  heroImage: string;
  description: string;
  locations: Location[];
  form: ContactForm;
}

export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Footer {
  businessInfo: BusinessInfo;
  socialLinks: SocialLink[];
  quickLinks: Link[];
}

export interface Hero {
  headline: string;
  subheadline: string;
  backgroundImage?: string;
  cta: {
    primary: Link;
    secondary?: Link;
  };
}

export interface Navigation {
  links: Link[];
}

export interface Logo {
  src: string;
  alt: string;
}

export interface SiteConfig {
  name: string;
  description: string;
  defaultImage?: string;
  logo?: Logo;
  navigation: Navigation;
  hero: Hero;
  features: FeaturesSection;
  quote: Quote;
  services: ServicesSection;
  about: About;
  contact: Contact;
  footer: Footer;
}

export interface WebsiteData {
  theme: ThemeConfig;
  site: SiteConfig;
} 