import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface MockCampaign {
  title: string;
  description: string;
  requirements: string;
  budget: number;
  location: string;
  category: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid';
  influencerId?: string;
  influencerName?: string;
  influencerEmail?: string;
  startDate?: Date;
  endDate?: Date;
}

export const mockCampaigns: MockCampaign[] = [
  {
    title: 'Summer Coffee Shop Promotion',
    description: 'We are looking for local influencers to promote our new summer drinks menu with creative, authentic content.',
    requirements: 'At least 2 Instagram posts and 3 stories featuring our drinks and location. Must tag our official account and use provided hashtags.',
    budget: 150,
    location: 'New York, NY',
    category: 'food',
    status: 'active',
    paymentStatus: 'pending',
    influencerId: 'test-influencer-123',
    influencerName: 'Sarah Johnson',
    influencerEmail: 'sarah@example.com',
    startDate: new Date(2023, 5, 15),
    endDate: new Date(2023, 6, 15)
  },
  {
    title: 'Fitness Studio Grand Opening',
    description: 'We\'re launching a new fitness studio and need local fitness influencers to attend our grand opening event and create buzz.',
    requirements: 'Attend the 2-hour opening event, create at least 1 post and 5 stories about the experience, and share a personal review.',
    budget: 200,
    location: 'Los Angeles, CA',
    category: 'fitness',
    status: 'active',
    paymentStatus: 'pending',
    influencerId: 'test-influencer-456',
    influencerName: 'Mike Thompson',
    influencerEmail: 'mike@example.com',
    startDate: new Date(2023, 6, 1),
    endDate: new Date(2023, 6, 10)
  },
  {
    title: 'Local Boutique Fashion Showcase',
    description: 'Our boutique is launching a new summer collection and we need fashion influencers to create content featuring our pieces.',
    requirements: 'Select 3 items from our collection, create 2 styled posts for Instagram, and provide us with the usage rights.',
    budget: 175,
    location: 'Chicago, IL',
    category: 'fashion',
    status: 'active',
    paymentStatus: 'pending',
    influencerId: 'test-influencer-789',
    influencerName: 'Emily Davis',
    influencerEmail: 'emily@example.com',
    startDate: new Date(2023, 5, 20),
    endDate: new Date(2023, 7, 1)
  }
];

// Function to seed sample data to Firestore
export const seedMockCampaigns = async (): Promise<void> => {
  try {
    const campaignsRef = collection(db, 'campaigns');
    
    for (const campaign of mockCampaigns) {
      await addDoc(campaignsRef, {
        ...campaign,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        startDate: campaign.startDate || null,
        endDate: campaign.endDate || null
      });
    }
    
    console.log('Mock campaigns seeded successfully!');
  } catch (error) {
    console.error('Error seeding mock campaigns:', error);
  }
}; 