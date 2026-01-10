/**
 * College constants (mock data for prototype)
 * In production, this would come from AWS DynamoDB
 */

import { College } from '@types/user.types';

export const COLLEGES: College[] = [
  {
    id: 'iit-delhi',
    name: 'Indian Institute of Technology Delhi',
    shortName: 'IIT Delhi',
    city: 'New Delhi',
    state: 'Delhi',
  },
  {
    id: 'iit-bombay',
    name: 'Indian Institute of Technology Bombay',
    shortName: 'IIT Bombay',
    city: 'Mumbai',
    state: 'Maharashtra',
  },
  {
    id: 'iit-madras',
    name: 'Indian Institute of Technology Madras',
    shortName: 'IIT Madras',
    city: 'Chennai',
    state: 'Tamil Nadu',
  },
  {
    id: 'iit-kanpur',
    name: 'Indian Institute of Technology Kanpur',
    shortName: 'IIT Kanpur',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
  },
  {
    id: 'bits-pilani',
    name: 'Birla Institute of Technology and Science',
    shortName: 'BITS Pilani',
    city: 'Pilani',
    state: 'Rajasthan',
  },
  {
    id: 'nit-trichy',
    name: 'National Institute of Technology Tiruchirappalli',
    shortName: 'NIT Trichy',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
  },
  {
    id: 'vit-vellore',
    name: 'Vellore Institute of Technology',
    shortName: 'VIT Vellore',
    city: 'Vellore',
    state: 'Tamil Nadu',
  },
  {
    id: 'srm-chennai',
    name: 'SRM Institute of Science and Technology',
    shortName: 'SRM Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
  },
  {
    id: 'manipal',
    name: 'Manipal Institute of Technology',
    shortName: 'MIT Manipal',
    city: 'Manipal',
    state: 'Karnataka',
  },
  {
    id: 'du-delhi',
    name: 'University of Delhi',
    shortName: 'DU',
    city: 'New Delhi',
    state: 'Delhi',
  },
];

export const getCollegeById = (id: string): College | undefined => {
  return COLLEGES.find(c => c.id === id);
};

export const getCollegeName = (id: string): string => {
  const college = getCollegeById(id);
  return college?.shortName || college?.name || 'Unknown College';
};

export const searchColleges = (query: string): College[] => {
  const lowerQuery = query.toLowerCase();
  return COLLEGES.filter(
    c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.shortName.toLowerCase().includes(lowerQuery) ||
      c.city.toLowerCase().includes(lowerQuery)
  );
};
