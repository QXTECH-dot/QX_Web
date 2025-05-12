import { Company } from "./company";

export interface Attendee {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  position: string;
  industry: string;
  businessSummary: string;
  tags: string[];
}

export interface EventSession {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  speaker?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string; // ISO date format
  location: {
    state: string; // NSW, ACT, etc.
    venue: string;
    address: string;
    city: string;
    postcode: string;
  };
  organizer: {
    id: string;
    name: string;
    logo: string;
    description: string;
  };
  theme: string;
  summary: string;
  description: string;
  schedule: EventSession[];
  attendees: Attendee[];
}
