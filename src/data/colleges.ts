import { College } from '../types';

export const colleges: College[] = [
  {
    id: '1',
    name: 'Indian Institute of Technology Madras',
    location: 'Chennai',
    district: 'Chennai',
    type: 'Government',
    established: 1959,
    courses: [
      {
        name: 'Computer Science Engineering',
        duration: '4 years',
        seats: 120,
        cutoff: { general: 180, obc: 165, sc: 145, st: 140 },
        fees: 250000
      },
      {
        name: 'Electronics and Communication',
        duration: '4 years',
        seats: 100,
        cutoff: { general: 175, obc: 160, sc: 140, st: 135 },
        fees: 250000
      },
      {
        name: 'Mechanical Engineering',
        duration: '4 years',
        seats: 150,
        cutoff: { general: 170, obc: 155, sc: 135, st: 130 },
        fees: 250000
      }
    ],
    facilities: ['Hostel', 'Library', 'Labs', 'Sports Complex', 'Wi-Fi', 'Cafeteria'],
    placementRate: 95,
    averagePackage: 1800000,
    highestPackage: 5000000,
    nirf_ranking: 1,
    accreditation: ['NAAC A++', 'NBA'],
    website: 'https://www.iitm.ac.in',
    contact: {
      phone: '+91-44-2257-4802',
      email: 'dean.acad@iitm.ac.in',
      address: 'Sardar Patel Road, Adyar, Chennai - 600036'
    }
  },
  {
    id: '2',
    name: 'College of Engineering Guindy',
    location: 'Chennai',
    district: 'Chennai',
    type: 'Government',
    established: 1794,
    courses: [
      {
        name: 'Computer Science Engineering',
        duration: '4 years',
        seats: 180,
        cutoff: { general: 165, obc: 150, sc: 130, st: 125 },
        fees: 45000
      },
      {
        name: 'Information Technology',
        duration: '4 years',
        seats: 120,
        cutoff: { general: 160, obc: 145, sc: 125, st: 120 },
        fees: 45000
      },
      {
        name: 'Electrical Engineering',
        duration: '4 years',
        seats: 150,
        cutoff: { general: 155, obc: 140, sc: 120, st: 115 },
        fees: 45000
      }
    ],
    facilities: ['Hostel', 'Library', 'Research Labs', 'Sports', 'Placement Cell'],
    placementRate: 92,
    averagePackage: 800000,
    highestPackage: 2500000,
    nirf_ranking: 8,
    accreditation: ['NAAC A+', 'NBA'],
    website: 'https://www.ceg.ac.in',
    contact: {
      phone: '+91-44-2220-1234',
      email: 'principal@ceg.ac.in',
      address: 'Sardar Patel Road, Guindy, Chennai - 600025'
    }
  },
  {
    id: '3',
    name: 'PSG College of Technology',
    location: 'Coimbatore',
    district: 'Coimbatore',
    type: 'Private',
    established: 1951,
    courses: [
      {
        name: 'Computer Science Engineering',
        duration: '4 years',
        seats: 240,
        cutoff: { general: 150, obc: 135, sc: 115, st: 110 },
        fees: 185000
      },
      {
        name: 'Mechanical Engineering',
        duration: '4 years',
        seats: 180,
        cutoff: { general: 145, obc: 130, sc: 110, st: 105 },
        fees: 185000
      },
      {
        name: 'Civil Engineering',
        duration: '4 years',
        seats: 120,
        cutoff: { general: 140, obc: 125, sc: 105, st: 100 },
        fees: 185000
      }
    ],
    facilities: ['Hostel', 'Library', 'Industry Labs', 'Sports Complex', 'Innovation Hub'],
    placementRate: 88,
    averagePackage: 650000,
    highestPackage: 1800000,
    nirf_ranking: 15,
    accreditation: ['NAAC A+', 'NBA'],
    website: 'https://www.psgtech.edu',
    contact: {
      phone: '+91-422-257-4100',
      email: 'principal@psgtech.edu',
      address: 'Peelamedu, Coimbatore - 641004'
    }
  },
  {
    id: '4',
    name: 'Thiagarajar College of Engineering',
    location: 'Madurai',
    district: 'Madurai',
    type: 'Government',
    established: 1957,
    courses: [
      {
        name: 'Computer Science Engineering',
        duration: '4 years',
        seats: 120,
        cutoff: { general: 155, obc: 140, sc: 120, st: 115 },
        fees: 50000
      },
      {
        name: 'Electronics Engineering',
        duration: '4 years',
        seats: 100,
        cutoff: { general: 150, obc: 135, sc: 115, st: 110 },
        fees: 50000
      }
    ],
    facilities: ['Hostel', 'Library', 'Research Centers', 'Sports', 'Training Center'],
    placementRate: 85,
    averagePackage: 550000,
    highestPackage: 1200000,
    nirf_ranking: 25,
    accreditation: ['NAAC A', 'NBA'],
    website: 'https://www.tce.edu',
    contact: {
      phone: '+91-452-248-2240',
      email: 'principal@tce.edu',
      address: 'Thiruparankundram, Madurai - 625015'
    }
  },
  {
    id: '5',
    name: 'Government College of Technology',
    location: 'Coimbatore',
    district: 'Coimbatore',
    type: 'Government',
    established: 1945,
    courses: [
      {
        name: 'Computer Science Engineering',
        duration: '4 years',
        seats: 90,
        cutoff: { general: 160, obc: 145, sc: 125, st: 120 },
        fees: 45000
      },
      {
        name: 'Mechanical Engineering',
        duration: '4 years',
        seats: 120,
        cutoff: { general: 155, obc: 140, sc: 120, st: 115 },
        fees: 45000
      }
    ],
    facilities: ['Hostel', 'Library', 'Workshops', 'Sports Ground', 'Computer Center'],
    placementRate: 82,
    averagePackage: 480000,
    highestPackage: 1000000,
    nirf_ranking: 35,
    accreditation: ['NAAC A', 'NBA'],
    website: 'https://www.gct.ac.in',
    contact: {
      phone: '+91-422-260-0291',
      email: 'principal@gct.ac.in',
      address: 'Coimbatore - 641013'
    }
  },
  {
    id: '6',
    name: 'Karunya Institute of Technology',
    location: 'Coimbatore',
    district: 'Coimbatore',
    type: 'Private',
    established: 1986,
    courses: [
      {
        name: 'Computer Science Engineering',
        duration: '4 years',
        seats: 200,
        cutoff: { general: 135, obc: 120, sc: 100, st: 95 },
        fees: 220000
      },
      {
        name: 'Biotechnology',
        duration: '4 years',
        seats: 80,
        cutoff: { general: 130, obc: 115, sc: 95, st: 90 },
        fees: 220000
      }
    ],
    facilities: ['Hostel', 'Library', 'Research Labs', 'Hospital', 'Sports Complex'],
    placementRate: 78,
    averagePackage: 420000,
    highestPackage: 800000,
    nirf_ranking: 45,
    accreditation: ['NAAC A', 'NBA'],
    website: 'https://www.karunya.edu',
    contact: {
      phone: '+91-422-261-4301',
      email: 'info@karunya.edu',
      address: 'Karunya Nagar, Coimbatore - 641114'
    }
  },
  {
    id: '7',
    name: 'National Institute of Technology Tiruchirappalli',
    location: 'Tiruchirappalli',
    district: 'Tiruchirappalli',
    type: 'Government',
    established: 1964,
    courses: [
      {
        name: 'Computer Science Engineering',
        duration: '4 years',
        seats: 110,
        cutoff: { general: 175, obc: 160, sc: 140, st: 135 },
        fees: 160000
      },
      {
        name: 'Electronics Engineering',
        duration: '4 years',
        seats: 90,
        cutoff: { general: 170, obc: 155, sc: 135, st: 130 },
        fees: 160000
      }
    ],
    facilities: ['Hostel', 'Library', 'Research Centers', 'Sports Complex', 'Health Center'],
    placementRate: 94,
    averagePackage: 1200000,
    highestPackage: 3500000,
    nirf_ranking: 3,
    accreditation: ['NAAC A++', 'NBA'],
    website: 'https://www.nitt.edu',
    contact: {
      phone: '+91-431-250-3000',
      email: 'registrar@nitt.edu',
      address: 'Tiruchirappalli - 620015'
    }
  },
  {
    id: '8',
    name: 'Sastra Deemed University',
    location: 'Thanjavur',
    district: 'Thanjavur',
    type: 'Private',
    established: 1984,
    courses: [
      {
        name: 'Computer Science Engineering',
        duration: '4 years',
        seats: 180,
        cutoff: { general: 145, obc: 130, sc: 110, st: 105 },
        fees: 195000
      },
      {
        name: 'Information Technology',
        duration: '4 years',
        seats: 120,
        cutoff: { general: 140, obc: 125, sc: 105, st: 100 },
        fees: 195000
      }
    ],
    facilities: ['Hostel', 'Library', 'Tech Parks', 'Sports', 'Cultural Center'],
    placementRate: 86,
    averagePackage: 580000,
    highestPackage: 1500000,
    nirf_ranking: 20,
    accreditation: ['NAAC A++', 'NBA'],
    website: 'https://www.sastra.edu',
    contact: {
      phone: '+91-4362-264-101',
      email: 'info@sastra.edu',
      address: 'Tirumalaisamudram, Thanjavur - 613401'
    }
  }
];

export const districts = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli',
  'Thanjavur', 'Vellore', 'Erode', 'Tiruppur', 'Dindigul', 'Thoothukudi',
  'Kanchipuram', 'Cuddalore', 'Karur', 'Namakkal', 'Sivaganga', 'Ramanathapuram'
];

export const courses = [
  'Computer Science Engineering',
  'Information Technology',
  'Electronics and Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Chemical Engineering',
  'Biotechnology',
  'Aerospace Engineering',
  'Automobile Engineering'
];