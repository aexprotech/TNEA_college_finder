export interface College {
  id: string;
  name: string;
  location: string;
  district: string;
  type: 'Government' | 'Private' | 'Aided' | 'Autonomous';
  established: number;
  courses: Course[];
  facilities: string[];
  placementRate: number;
  averagePackage: number;
  highestPackage: number;
  nirf_ranking?: number;
  accreditation: string[];
  website: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
}

export interface Course {
  name: string;
  duration: string;
  seats: number;
  cutoff: {
    general: number;
    obc: number;
    sc: number;
    st: number;
  };
  fees: number;
}

export interface SearchFilters {
  cutoff: string;
  category: 'General' | 'OBC' | 'SC' | 'ST' | '';
  location: string;
  course: string;
}

export interface StudentProfile {
  marks: number;
  category: 'General' | 'OBC' | 'SC' | 'ST';
  preferredLocation: string;
  preferredCourse: string;
  budget: number;
}

export interface CourseInsightsModel {
  aboutCareer: string;
  whatYouStudy: string[];
  skillsYouDevelop: string[];
  privateSectorJobs: string[];
  governmentSectorJobs: string[];
  marketAnalysis: string;
  courseFee: string; // e.g., '₹75,000'
  expectedSalary: string; // e.g., '₹6-10 LPA'
  futureHigherStudies: string[];
  currentMarketTrends: string;
  disclaimer: string;
}