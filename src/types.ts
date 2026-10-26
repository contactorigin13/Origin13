export type ActivePage = 'home' | 'about' | 'services' | 'portfolio' | 'contact';
export type PageId = ActivePage;

export type PortfolioCategory = 'all' | 'documentary' | 'stills';
export type StoryItem = DocumentaryStill;


export interface DocumentaryStill {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  partner?: string;
  category: 'documentary' | 'stills';
  aspectRatio: string;
  palette: 'monochrome' | 'cinematic-warm' | 'deep-blue' | 'dusk-sepia';
  imageUrl?: string;
  synopsis: string;
  fieldNotes: string;
  quote?: string;
}

export interface ServiceOffering {
  id: string;
  number: string;
  title: string;
  summary: string;
  details: string[];
  equipmentFocus?: string;
}

export interface InstitutionalPartner {
  name: string;
  shortName: string;
  type: string;
  focus: string;
}

export interface InquiryFormState {
  fullName: string;
  organization: string;
  email: string;
  projectType: string;
  message: string;
}
