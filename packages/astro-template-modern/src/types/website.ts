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

export interface Feature {
  title: string;
  description: string;
  icon: string;
  image?: string;
  link?: string;
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

export interface Value {
  title: string;
  description: string;
  icon: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface About {
  title: string;
  subtitle: string;
  heroImage: string;
  mission: {
    title: string;
    description: string;
  };
  story: {
    title: string;
    content: string;
    image: string;
  };
  values: Value[];
  stats: Stat[];
}

export interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
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
  form: {
    title: string;
    fields: FormField[];
  };
}

export interface SiteConfig {
  name: string;
  description: string;
  defaultImage?: string;
  logo?: {
    src: string;
    alt: string;
  };
  navigation: {
    links: Array<{
      text: string;
      href: string;
    }>;
  };
  hero: {
    headline: string;
    subheadline: string;
    backgroundImage?: string;
    cta: {
      primary: {
        text: string;
        href: string;
      };
      secondary?: {
        text: string;
        href: string;
      };
    };
  };
  quote: Quote;
  features: Feature[];
  services: Service[];
  about: About;
  contact: Contact;
  footer: {
    businessInfo: {
      name: string;
      address: string;
      phone: string;
      email: string;
    };
    socialLinks: Array<{
      platform: string;
      url: string;
      icon: string;
    }>;
    quickLinks: Array<{
      text: string;
      href: string;
    }>;
  };
}

export interface WebsiteData {
  theme: ThemeConfig;
  site: SiteConfig;
} 