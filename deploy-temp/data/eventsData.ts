import { Event } from "@/types/event";

// Mock data for events
export const eventsData: Event[] = [
  {
    id: "event-001",
    title: "Sydney Tech Summit 2025",
    date: "2025-04-15",
    location: {
      state: "NSW",
      venue: "International Convention Centre",
      address: "14 Darling Drive",
      city: "Sydney",
      postcode: "2000",
    },
    organizer: {
      id: "org-001",
      name: "TechSydney",
      logo: "https://ext.same-assets.com/1694792166/263645824.png",
      description: "TechSydney is a not-for-profit organization created to foster and grow the technology ecosystem in Sydney.",
    },
    theme: "Future of AI in Business",
    summary: "Join us for the premier tech event in Sydney focusing on AI implementation in businesses of all sizes.",
    description: "Sydney Tech Summit brings together the brightest minds in technology and business to discuss the latest trends and innovations in artificial intelligence. From startups to enterprise companies, learn how AI is transforming industries and how your business can leverage these technologies for growth and efficiency.",
    schedule: [
      {
        id: "session-001",
        title: "Opening Keynote: AI in 2025 and Beyond",
        startTime: "09:00",
        endTime: "10:00",
        description: "An overview of the current state of AI and predictions for the next decade.",
        speaker: "Dr. Sarah Chen, AI Research Director at Google Australia"
      },
      {
        id: "session-002",
        title: "Panel Discussion: Implementing AI in Small Businesses",
        startTime: "10:30",
        endTime: "11:45",
        description: "Learn from small business owners who have successfully integrated AI solutions.",
        speaker: "Various Industry Leaders"
      },
      {
        id: "session-003",
        title: "Lunch Break & Networking",
        startTime: "12:00",
        endTime: "13:30",
        description: "Enjoy lunch and connect with fellow attendees."
      },
      {
        id: "session-004",
        title: "Workshop: AI Tools for Daily Business Operations",
        startTime: "13:45",
        endTime: "15:15",
        description: "Hands-on workshop exploring practical AI tools for improving business operations.",
        speaker: "Michael Wong, CTO at AI Solutions Australia"
      },
      {
        id: "session-005",
        title: "Closing Remarks & Future Opportunities",
        startTime: "15:30",
        endTime: "16:30",
        description: "Summarizing key takeaways and discussing future opportunities in AI.",
        speaker: "James Taylor, Event Chair"
      }
    ],
    attendees: [
      {
        id: "attendee-001",
        name: "Jason Smith",
        companyId: "comp-001",
        companyName: "NetTech Solutions",
        companyLogo: "https://ext.same-assets.com/1694792166/138945825.png",
        position: "CTO",
        industry: "IT & Technology",
        businessSummary: "NetTech Solutions provides enterprise networking solutions for medium to large businesses.",
        tags: ["Technology Leader", "AI Enthusiast", "Networking Expert"]
      },
      {
        id: "attendee-002",
        name: "Sarah Wilson",
        companyId: "comp-002",
        companyName: "FinStart",
        companyLogo: "https://ext.same-assets.com/1694792166/987654321.png",
        position: "Founder & CEO",
        industry: "Finance",
        businessSummary: "FinStart is a fintech startup focused on democratizing financial planning through AI-powered tools.",
        tags: ["Startup Founder", "Seeking Investment", "Fintech Innovation"]
      },
      {
        id: "attendee-003",
        name: "Michael Johnson",
        companyId: "comp-003",
        companyName: "EDU Connect",
        companyLogo: "https://ext.same-assets.com/1694792166/123459876.png",
        position: "Education Director",
        industry: "Education",
        businessSummary: "EDU Connect develops AI-enhanced learning platforms for K-12 schools across Australia.",
        tags: ["EdTech Specialist", "Partnership Opportunities", "Education Innovation"]
      }
    ]
  },
  {
    id: "event-002",
    title: "Melbourne Business Forum",
    date: "2025-05-10",
    location: {
      state: "VIC",
      venue: "Melbourne Convention and Exhibition Centre",
      address: "1 Convention Centre Place",
      city: "Melbourne",
      postcode: "3006",
    },
    organizer: {
      id: "org-002",
      name: "Business Victoria",
      logo: "https://ext.same-assets.com/1694792166/456789123.png",
      description: "Business Victoria supports the growth and development of businesses throughout Victoria.",
    },
    theme: "Sustainable Business Practices",
    summary: "Learn how to implement sustainable practices in your business while maintaining profitability.",
    description: "The Melbourne Business Forum is a premier event for business owners and executives interested in sustainable business practices. Discover how leading companies are reducing their environmental impact while improving their bottom line. Network with sustainability experts and like-minded business leaders committed to making a positive change.",
    schedule: [
      {
        id: "session-101",
        title: "Welcome & Introduction",
        startTime: "09:30",
        endTime: "10:00",
        description: "Welcome address and overview of the day's schedule.",
        speaker: "Emma Roberts, CEO of Business Victoria"
      },
      {
        id: "session-102",
        title: "Keynote: The Business Case for Sustainability",
        startTime: "10:00",
        endTime: "11:00",
        description: "Exploring how sustainable practices can drive business growth and profitability.",
        speaker: "Daniel Chang, Sustainability Director at Green Business Australia"
      },
      {
        id: "session-103",
        title: "Panel: Sustainable Supply Chain Management",
        startTime: "11:15",
        endTime: "12:30",
        description: "Industry leaders discuss strategies for creating sustainable supply chains.",
        speaker: "Various Industry Experts"
      },
      {
        id: "session-104",
        title: "Networking Lunch",
        startTime: "12:30",
        endTime: "13:45",
        description: "Eco-friendly lunch and networking opportunity."
      },
      {
        id: "session-105",
        title: "Workshop: Measuring Your Environmental Impact",
        startTime: "14:00",
        endTime: "15:30",
        description: "Hands-on workshop on tools and methodologies for measuring environmental impact.",
        speaker: "Dr. Lisa Green, Environmental Consultant"
      },
      {
        id: "session-106",
        title: "Closing Session: Action Plans & Resources",
        startTime: "15:45",
        endTime: "16:30",
        description: "Practical action plans and resources for implementing sustainable business practices.",
        speaker: "James Wilson, Business Victoria"
      }
    ],
    attendees: [
      {
        id: "attendee-101",
        name: "Robert Chen",
        companyId: "comp-101",
        companyName: "EcoSupply",
        companyLogo: "https://ext.same-assets.com/1694792166/753951852.png",
        position: "Operations Manager",
        industry: "Manufacturing",
        businessSummary: "EcoSupply produces eco-friendly packaging solutions for businesses across Australia.",
        tags: ["Sustainability Champion", "Manufacturing", "B2B Services"]
      },
      {
        id: "attendee-102",
        name: "Jessica Taylor",
        companyId: "comp-102",
        companyName: "Green Finance",
        companyLogo: "https://ext.same-assets.com/1694792166/159357456.png",
        position: "Investment Advisor",
        industry: "Finance",
        businessSummary: "Green Finance specializes in investment portfolios focused on environmentally responsible companies.",
        tags: ["ESG Investing", "Financial Services", "Seeking Green Partners"]
      },
      {
        id: "attendee-103",
        name: "Andrew Thompson",
        companyId: "comp-103",
        companyName: "Sustainable Retail Group",
        companyLogo: "https://ext.same-assets.com/1694792166/258741369.png",
        position: "Retail Director",
        industry: "Retail",
        businessSummary: "Sustainable Retail Group operates a chain of eco-friendly retail stores across Victoria.",
        tags: ["Retail Innovation", "Looking for Suppliers", "Expanding Business"]
      }
    ]
  },
  {
    id: "event-003",
    title: "Brisbane Innovation Conference",
    date: "2025-06-20",
    location: {
      state: "QLD",
      venue: "Brisbane Convention & Exhibition Centre",
      address: "Merivale St & Glenelg Street",
      city: "Brisbane",
      postcode: "4101",
    },
    organizer: {
      id: "org-003",
      name: "Queensland Innovators",
      logo: "https://ext.same-assets.com/1694792166/654789321.png",
      description: "Queensland Innovators is dedicated to fostering innovation and entrepreneurship in Queensland.",
    },
    theme: "Disruptive Technologies",
    summary: "Explore how disruptive technologies are reshaping industries and creating new business opportunities.",
    description: "The Brisbane Innovation Conference brings together entrepreneurs, investors, and industry experts to explore the latest disruptive technologies and their potential impact on various industries. From blockchain to quantum computing, discover how emerging technologies are creating new business models and transforming existing ones.",
    schedule: [
      {
        id: "session-201",
        title: "Registration & Morning Coffee",
        startTime: "08:30",
        endTime: "09:15",
        description: "Check-in and networking opportunity with morning refreshments."
      },
      {
        id: "session-202",
        title: "Opening Keynote: The Innovation Mindset",
        startTime: "09:30",
        endTime: "10:30",
        description: "Exploring the mindset required for successful innovation in today's rapidly changing world.",
        speaker: "David Phillips, Innovation Strategist"
      },
      {
        id: "session-203",
        title: "Spotlight Sessions: Emerging Technologies",
        startTime: "10:45",
        endTime: "12:15",
        description: "Quick-fire presentations on blockchain, quantum computing, and other emerging technologies.",
        speaker: "Various Technology Experts"
      },
      {
        id: "session-204",
        title: "Networking Lunch & Innovation Showcase",
        startTime: "12:30",
        endTime: "14:00",
        description: "Enjoy lunch while exploring innovative products and services in the showcase area."
      },
      {
        id: "session-205",
        title: "Panel Discussion: Funding Innovation",
        startTime: "14:15",
        endTime: "15:30",
        description: "Investors and successful entrepreneurs discuss strategies for funding innovative ventures.",
        speaker: "Panel of Investors and Entrepreneurs"
      },
      {
        id: "session-206",
        title: "Closing Remarks & Networking Drinks",
        startTime: "15:45",
        endTime: "17:00",
        description: "Summary of key insights and informal networking over drinks."
      }
    ],
    attendees: [
      {
        id: "attendee-201",
        name: "Laura Thompson",
        companyId: "comp-201",
        companyName: "Quantum Solutions",
        companyLogo: "https://ext.same-assets.com/1694792166/753159852.png",
        position: "Research Director",
        industry: "Technology",
        businessSummary: "Quantum Solutions is pioneering practical applications of quantum computing for business use.",
        tags: ["Deep Tech", "R&D Partnerships", "Technology Pioneer"]
      },
      {
        id: "attendee-202",
        name: "Mark Davidson",
        companyId: "comp-202",
        companyName: "AgriTech Innovations",
        companyLogo: "https://ext.same-assets.com/1694792166/951753852.png",
        position: "Founder",
        industry: "Agriculture",
        businessSummary: "AgriTech Innovations develops technology solutions for modern agricultural challenges.",
        tags: ["AgTech", "Seeking Investment", "Rural Innovation"]
      },
      {
        id: "attendee-203",
        name: "Samantha Lee",
        companyId: "comp-203",
        companyName: "HealthSync",
        companyLogo: "https://ext.same-assets.com/1694792166/357159852.png",
        position: "CEO",
        industry: "Healthcare",
        businessSummary: "HealthSync creates digital platforms connecting patients with healthcare providers.",
        tags: ["Healthcare Innovation", "Digital Transformation", "Looking for Technical Talent"]
      }
    ]
  },
  {
    id: "event-004",
    title: "Canberra Government & Technology Summit",
    date: "2025-07-12",
    location: {
      state: "ACT",
      venue: "National Convention Centre",
      address: "31 Constitution Ave",
      city: "Canberra",
      postcode: "2601",
    },
    organizer: {
      id: "org-004",
      name: "GovTech Australia",
      logo: "https://ext.same-assets.com/1694792166/159357456.png",
      description: "GovTech Australia focuses on bringing innovative technology solutions to government departments and agencies.",
    },
    theme: "Digital Transformation in Government",
    summary: "Explore how technology is transforming government services and operations in Australia.",
    description: "The Canberra Government & Technology Summit brings together government officials, technology providers, and policy experts to discuss the digital transformation of government services and operations. Learn about successful case studies, policy frameworks, and emerging technologies that are shaping the future of government in Australia.",
    schedule: [
      {
        id: "session-301",
        title: "Welcome Address",
        startTime: "09:00",
        endTime: "09:30",
        description: "Opening remarks and overview of the government's digital transformation strategy.",
        speaker: "Hon. Michelle Carter, Minister for Digital Government"
      },
      {
        id: "session-302",
        title: "Keynote: Citizen-Centric Digital Services",
        startTime: "09:45",
        endTime: "10:45",
        description: "Exploring how digital services can better meet the needs of citizens.",
        speaker: "Thomas Wilson, Digital Transformation Agency"
      },
      {
        id: "session-303",
        title: "Case Studies: Successful Digital Initiatives",
        startTime: "11:00",
        endTime: "12:15",
        description: "Presentations of successful digital transformation initiatives in various government departments.",
        speaker: "Various Government Department Representatives"
      },
      {
        id: "session-304",
        title: "Networking Lunch",
        startTime: "12:30",
        endTime: "13:45",
        description: "Lunch and networking opportunity."
      },
      {
        id: "session-305",
        title: "Panel: Cybersecurity in Government",
        startTime: "14:00",
        endTime: "15:15",
        description: "Expert panel discussing cybersecurity challenges and solutions for government systems.",
        speaker: "Cybersecurity Experts"
      },
      {
        id: "session-306",
        title: "Workshop: Procurement of Digital Solutions",
        startTime: "15:30",
        endTime: "16:45",
        description: "Practical workshop on effective procurement processes for digital solutions.",
        speaker: "Sarah Johnson, Government Procurement Specialist"
      }
    ],
    attendees: [
      {
        id: "attendee-301",
        name: "Richard Thompson",
        companyId: "comp-301",
        companyName: "SecureGov",
        companyLogo: "https://ext.same-assets.com/1694792166/456789012.png",
        position: "Security Director",
        industry: "Cybersecurity",
        businessSummary: "SecureGov provides cybersecurity solutions specifically designed for government agencies.",
        tags: ["Cybersecurity Expert", "Government Contracts", "Critical Infrastructure"]
      },
      {
        id: "attendee-302",
        name: "Helen Clark",
        companyId: "comp-302",
        companyName: "Digital Citizens",
        companyLogo: "https://ext.same-assets.com/1694792166/789012345.png",
        position: "UX Research Lead",
        industry: "Digital Services",
        businessSummary: "Digital Citizens specializes in user experience research and design for government digital services.",
        tags: ["UX Design", "Citizen Engagement", "Digital Accessibility"]
      },
      {
        id: "attendee-303",
        name: "James Wilson",
        companyId: "comp-303",
        companyName: "Policy Tech",
        companyLogo: "https://ext.same-assets.com/1694792166/012345678.png",
        position: "Co-founder",
        industry: "GovTech",
        businessSummary: "Policy Tech creates software solutions for policy development and implementation.",
        tags: ["Policy Innovation", "Government Software", "Looking for Government Partners"]
      }
    ]
  }
];

// Helper function to get events by month
export const getEventsByMonth = (month: number, year: number = 2025): Event[] => {
  return eventsData.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === month && eventDate.getFullYear() === year;
  });
};

// Helper function to get events by day
export const getEventsByDay = (day: number, month: number, year: number = 2025): Event[] => {
  return eventsData.filter(event => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === day &&
      eventDate.getMonth() === month &&
      eventDate.getFullYear() === year
    );
  });
};

// Helper function to get an event by ID
export const getEventById = (id: string): Event | undefined => {
  return eventsData.find(event => event.id === id);
};

// Helper function to get upcoming events (from today forward)
export const getUpcomingEvents = (): Event[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return eventsData
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Helper function to get past events
export const getPastEvents = (): Event[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return eventsData
    .filter(event => new Date(event.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
