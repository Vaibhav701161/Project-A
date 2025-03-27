export interface Advertisement {
  id: string;
  title: string;
  description: string;
  budget: string;
  duration: string;
  requirements: string[];
  category: string;
  businessId: string;
  status: string;
  location: string;
  createdAt: any;
  businessName?: string;
  businessLogo?: string;
}