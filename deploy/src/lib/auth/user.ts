// Mock users database for demonstration - in a real app, this would be a database
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'company' | 'admin';
  companyProfile?: CompanyProfile;
}

export interface CompanyProfile {
  id: string;
  name: string;
  abn: string;
  website: string;
  logo: string;
  description: string;
  services: string[];
  claimed: boolean;
  ownerId?: string | null;
  location?: string;
  foundedYear?: number;
  employeeCount?: string;
  contactEmail?: string;
  contactPhone?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "company",
    companyProfile: {
      id: "c1",
      name: "Tech Solutions Inc",
      abn: "12345678901",
      website: "https://techsolutions.example.com",
      logo: "https://ext.same-assets.com/3273624843/3218314263.png",
      description: "We provide innovative tech solutions",
      services: ["Web Development", "App Development", "UX/UI Design"],
      claimed: true,
      ownerId: "1",
      location: "Sydney, Australia",
      foundedYear: 2015,
      employeeCount: "50-100",
      contactEmail: "contact@techsolutions.example.com",
      contactPhone: "+61 2 1234 5678"
    }
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "user",
  },
];

// Company profiles database - some may not be claimed yet
export const companyProfiles: CompanyProfile[] = [
  {
    id: "c1",
    name: "Tech Solutions Inc",
    abn: "12345678901",
    website: "https://techsolutions.example.com",
    logo: "https://ext.same-assets.com/3273624843/3218314263.png",
    description: "We provide innovative tech solutions",
    services: ["Web Development", "App Development", "UX/UI Design"],
    claimed: true,
    ownerId: "1",
    location: "Sydney, Australia",
    foundedYear: 2015,
    employeeCount: "50-100",
    contactEmail: "contact@techsolutions.example.com",
    contactPhone: "+61 2 1234 5678"
  },
  {
    id: "c2",
    name: "Digital Innovations Ltd",
    abn: "98765432109",
    website: "https://digitalinnovations.example.com",
    logo: "https://ext.same-assets.com/3273624843/1822484193.png",
    description: "Leading digital innovation company",
    services: ["Digital Marketing", "SEO", "Content Strategy"],
    claimed: false,
    ownerId: null,
    location: "Melbourne, Australia",
    foundedYear: 2018,
    employeeCount: "10-50",
    contactEmail: "info@digitalinnovations.example.com",
    contactPhone: "+61 3 9876 5432"
  },
];

export const getUserByEmail = (email: string): User | null => {
  return users.find(user => user.email === email) || null;
};

export const getUserById = (id: string): User | null => {
  return users.find(user => user.id === id) || null;
};

export const getCompanyByABN = (abn: string): CompanyProfile | null => {
  return companyProfiles.find(company => company.abn === abn) || null;
};

export const getCompanyById = (id: string): CompanyProfile | null => {
  return companyProfiles.find(company => company.id === id) || null;
};

export const createUser = (user: Omit<User, 'id'>): User => {
  const newUser: User = {
    ...user,
    id: `user_${Date.now().toString()}`
  };
  users.push(newUser);
  return newUser;
};

export const updateCompanyProfile = (companyId: string, updates: Partial<CompanyProfile>): CompanyProfile | null => {
  const index = companyProfiles.findIndex(c => c.id === companyId);
  if (index === -1) return null;

  companyProfiles[index] = {
    ...companyProfiles[index],
    ...updates
  };

  // Also update the user's company profile if it exists
  const userIndex = users.findIndex(u => u.companyProfile?.id === companyId);
  if (userIndex !== -1 && users[userIndex].companyProfile) {
    users[userIndex].companyProfile = {
      ...users[userIndex].companyProfile!,
      ...updates
    };
  }

  return companyProfiles[index];
};

export const claimCompany = (companyId: string, userId: string): CompanyProfile | null => {
  const company = getCompanyById(companyId);
  if (!company || company.claimed) return null;

  const user = getUserById(userId);
  if (!user) return null;

  const updatedCompany = updateCompanyProfile(companyId, {
    claimed: true,
    ownerId: userId
  });

  if (updatedCompany) {
    // Update user with company profile
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].companyProfile = updatedCompany;
      users[userIndex].role = 'company';
    }
  }

  return updatedCompany;
};
