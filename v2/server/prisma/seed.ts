import { PrismaClient, social_platform } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function hash(password: string) {
  return bcrypt.hash(password, 10);
}

// ─── Raw Data ─────────────────────────────────────────────────────────────────

const COMPANY_DATA = [
  {
    owner: { first_name: 'Marcus',   last_name: 'Rivera',   email: 'owner@techcorp.com' },
    info:  { company_name: 'TechCorp Inc.',         industry: 'Information Technology',    about: 'TechCorp is a leading software development company delivering cutting-edge solutions for enterprises worldwide.',     company_size: '201-500', foundation_year: 2012, website: 'https://techcorp.example.com' },
    contact: { email: 'hr@techcorp.example.com',       phone: '+63 2 8888 0001' },
    socials: [{ platform: social_platform.LINKEDIN, url: 'https://linkedin.com/company/techcorp' }, { platform: social_platform.TWITTER, url: 'https://twitter.com/techcorp' }],
    hq: { address: '10F Cybergate Tower 1', city: 'Cebu City',    state: 'Cebu',         country: 'Philippines', postal_code: '6000', is_headquarter: true },
  },
  {
    owner: { first_name: 'Sophia',   last_name: 'Chen',     email: 'owner@creativestudio.com' },
    info:  { company_name: 'Creative Studio Co.',    industry: 'Design & Creative Services', about: 'A full-service creative agency specializing in branding, UI/UX, and digital marketing.',                          company_size: '51-200',  foundation_year: 2017, website: 'https://creativestudio.example.com' },
    contact: { email: 'talent@creativestudio.example.com', phone: '+63 32 412 0002' },
    socials: [{ platform: social_platform.LINKEDIN, url: 'https://linkedin.com/company/creativestudio' }, { platform: social_platform.INSTAGRAM, url: 'https://instagram.com/creativestudio' }],
    hq: { address: '5F One Padgett Place',          city: 'Cebu City',    state: 'Cebu',         country: 'Philippines', postal_code: '6000', is_headquarter: true },
  },
  {
    owner: { first_name: 'Daniel',   last_name: 'Santos',   email: 'owner@finvault.com' },
    info:  { company_name: 'FinVault',               industry: 'Financial Technology',      about: 'FinVault builds next-generation digital banking and payment infrastructure for Southeast Asian markets.',           company_size: '51-200',  foundation_year: 2020, website: 'https://finvault.example.com' },
    contact: { email: 'careers@finvault.example.com',     phone: '+63 2 7777 0003' },
    socials: [{ platform: social_platform.LINKEDIN, url: 'https://linkedin.com/company/finvault' }, { platform: social_platform.FACEBOOK, url: 'https://facebook.com/finvault' }],
    hq: { address: '20F BGC Corporate Center',      city: 'Taguig City',  state: 'Metro Manila', country: 'Philippines', postal_code: '1634', is_headquarter: true },
  },
  {
    owner: { first_name: 'Angela',   last_name: 'Lim',      email: 'owner@healthsync.com' },
    info:  { company_name: 'HealthSync Philippines', industry: 'Healthcare Technology',     about: 'HealthSync digitizes patient records and clinic operations for hospitals and clinics across the Philippines.',        company_size: '51-200',  foundation_year: 2019, website: 'https://healthsync.example.com' },
    contact: { email: 'jobs@healthsync.example.com',       phone: '+63 2 6666 0004' },
    socials: [{ platform: social_platform.LINKEDIN, url: 'https://linkedin.com/company/healthsync' }],
    hq: { address: '8F Robinsons Cybergate',        city: 'Mandaluyong',  state: 'Metro Manila', country: 'Philippines', postal_code: '1552', is_headquarter: true },
  },
  {
    owner: { first_name: 'Patrick',  last_name: 'Tan',      email: 'owner@edulearn.com' },
    info:  { company_name: 'EduLearn PH',            industry: 'Education Technology',      about: 'EduLearn PH provides interactive e-learning platforms for K-12 and higher education institutions.',                 company_size: '11-50',   foundation_year: 2021, website: 'https://edulearn.example.com' },
    contact: { email: 'hiring@edulearn.example.com',       phone: '+63 32 520 0005' },
    socials: [{ platform: social_platform.LINKEDIN, url: 'https://linkedin.com/company/edulearn-ph' }, { platform: social_platform.FACEBOOK, url: 'https://facebook.com/edulearnph' }],
    hq: { address: '3F i1 Building, UP-Ayala Technohub', city: 'Quezon City', state: 'Metro Manila', country: 'Philippines', postal_code: '1101', is_headquarter: true },
  },
  {
    owner: { first_name: 'Raymond',  last_name: 'Go',       email: 'owner@logitrack.com' },
    info:  { company_name: 'LogiTrack',              industry: 'Logistics & Supply Chain',  about: 'LogiTrack provides real-time fleet management and last-mile delivery solutions for Philippine businesses.',          company_size: '201-500', foundation_year: 2016, website: 'https://logitrack.example.com' },
    contact: { email: 'careers@logitrack.example.com',     phone: '+63 2 5555 0006' },
    socials: [{ platform: social_platform.LINKEDIN, url: 'https://linkedin.com/company/logitrack' }],
    hq: { address: '12F Peza IT Park',              city: 'Cebu City',    state: 'Cebu',         country: 'Philippines', postal_code: '6000', is_headquarter: true },
  },
  {
    owner: { first_name: 'Christine', last_name: 'Uy',      email: 'owner@retailpro.com' },
    info:  { company_name: 'RetailPro',              industry: 'Retail & E-Commerce',       about: 'RetailPro powers omnichannel retail operations for mid-market and enterprise retailers across Southeast Asia.',       company_size: '201-500', foundation_year: 2014, website: 'https://retailpro.example.com' },
    contact: { email: 'jobs@retailpro.example.com',         phone: '+63 2 4444 0007' },
    socials: [{ platform: social_platform.LINKEDIN, url: 'https://linkedin.com/company/retailpro' }, { platform: social_platform.INSTAGRAM, url: 'https://instagram.com/retailpro' }],
    hq: { address: '15F SM Aura Premier',           city: 'Taguig City',  state: 'Metro Manila', country: 'Philippines', postal_code: '1634', is_headquarter: true },
  },
  {
    owner: { first_name: 'Bernard',  last_name: 'Cruz',     email: 'owner@greenbuild.com' },
    info:  { company_name: 'GreenBuild Corp.',       industry: 'Construction & Real Estate', about: 'GreenBuild develops sustainable commercial and residential properties integrating smart building technology.',       company_size: '501-1000', foundation_year: 2010, website: 'https://greenbuild.example.com' },
    contact: { email: 'hr@greenbuild.example.com',          phone: '+63 2 3333 0008' },
    socials: [{ platform: social_platform.LINKEDIN, url: 'https://linkedin.com/company/greenbuild' }, { platform: social_platform.FACEBOOK, url: 'https://facebook.com/greenbuildcorp' }],
    hq: { address: '30F GT Tower International',   city: 'Makati City',  state: 'Metro Manila', country: 'Philippines', postal_code: '1226', is_headquarter: true },
  },
  {
    owner: { first_name: 'Rina',     last_name: 'Villanueva', email: 'owner@mediapulse.com' },
    info:  { company_name: 'MediaPulse',             industry: 'Media & Communications',    about: 'MediaPulse is a digital media company producing content, podcasts, and online campaigns for brands and creators.',  company_size: '11-50',   foundation_year: 2018, website: 'https://mediapulse.example.com' },
    contact: { email: 'talent@mediapulse.example.com',     phone: '+63 32 410 0009' },
    socials: [{ platform: social_platform.LINKEDIN, url: 'https://linkedin.com/company/mediapulse' }, { platform: social_platform.TWITTER, url: 'https://twitter.com/mediapulse' }, { platform: social_platform.INSTAGRAM, url: 'https://instagram.com/mediapulse' }],
    hq: { address: '4F Keppel Center',              city: 'Cebu City',    state: 'Cebu',         country: 'Philippines', postal_code: '6000', is_headquarter: true },
  },
  {
    owner: { first_name: 'Kevin',    last_name: 'Reyes',    email: 'owner@cybershield.com' },
    info:  { company_name: 'CyberShield PH',         industry: 'Cybersecurity',             about: 'CyberShield provides managed security services, penetration testing, and compliance consulting for PH enterprises.', company_size: '51-200',  foundation_year: 2015, website: 'https://cybershield.example.com' },
    contact: { email: 'jobs@cybershield.example.com',       phone: '+63 2 2222 0010' },
    socials: [{ platform: social_platform.LINKEDIN, url: 'https://linkedin.com/company/cybershield-ph' }, { platform: social_platform.TWITTER, url: 'https://twitter.com/cybershieldph' }],
    hq: { address: '18F Zuellig Building',          city: 'Makati City',  state: 'Metro Manila', country: 'Philippines', postal_code: '1226', is_headquarter: true },
  },
];

type LocationType = 'ONSITE' | 'HYBRID' | 'REMOTE';
type JobStatus = 'OPEN' | 'CLOSED' | 'PAUSED';

interface JobTemplate {
  title: string;
  department: string;
  location: string;
  location_type: LocationType;
  employment_type: string;
  minimum_salary: string;
  maximum_salary: string;
  currency: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  status: JobStatus;
}

// 5 jobs per company = 50 total
const JOB_DATA: JobTemplate[][] = [
  // TechCorp Inc.
  [
    { title: 'Senior Software Engineer',    department: 'Engineering',         location: 'Cebu City, Philippines',    location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '80000', maximum_salary: '120000', currency: 'PHP', status: 'OPEN',   description: 'Build scalable backend systems for our enterprise SaaS platform.',        responsibilities: ['Design and implement microservices', 'Lead code reviews', 'Mentor junior engineers', 'Collaborate with product teams'],                    qualifications: ['5+ years in backend development', 'Strong Node.js/Go skills', 'PostgreSQL and Redis experience', "BS Computer Science"],             benefits: ['HMO (employee + 2 dependents)', '13th month pay', 'Hybrid work', 'Annual bonus'] },
    { title: 'DevOps Engineer',             department: 'Engineering',         location: 'Cebu City, Philippines',    location_type: 'REMOTE',  employment_type: 'Full-time', minimum_salary: '70000', maximum_salary: '100000', currency: 'PHP', status: 'OPEN',   description: 'Manage cloud infrastructure and CI/CD pipelines for our platform.',       responsibilities: ['Manage AWS infrastructure', 'Build CI/CD pipelines', 'Implement monitoring', 'Automate deployments'],                                   qualifications: ['3+ years in DevOps/SRE', 'Docker and Kubernetes expertise', 'Terraform experience', 'AWS certification a plus'],                      benefits: ['Fully remote', 'HMO coverage', 'Home office allowance', 'Learning budget'] },
    { title: 'Product Manager',             department: 'Product',             location: 'Cebu City, Philippines',    location_type: 'ONSITE',  employment_type: 'Full-time', minimum_salary: '75000', maximum_salary: '110000', currency: 'PHP', status: 'OPEN',   description: 'Drive the roadmap for our B2B SaaS platform.',                           responsibilities: ['Define product roadmap', 'Write product requirements', 'Coordinate cross-functional teams', 'Analyze metrics'],                        qualifications: ['4+ years in product management', 'Agile methodology experience', 'Strong analytical skills', 'Technical background preferred'],       benefits: ['HMO coverage', 'Stock option plan', 'Annual retreat', 'Flexible hours'] },
    { title: 'QA Engineer',                 department: 'Engineering',         location: 'Cebu City, Philippines',    location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '45000', maximum_salary: '70000',  currency: 'PHP', status: 'OPEN',   description: 'Ensure software quality through manual and automated testing.',           responsibilities: ['Develop test plans', 'Write automated tests', 'File and track bugs', 'Participate in sprint reviews'],                                  qualifications: ['2+ years in QA', 'Cypress or Playwright experience', 'API testing knowledge', 'Detail-oriented'],                                      benefits: ['HMO coverage', '13th month pay', 'Hybrid setup', 'Team activities'] },
    { title: 'Frontend Engineer',           department: 'Engineering',         location: 'Cebu City, Philippines',    location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '60000', maximum_salary: '90000',  currency: 'PHP', status: 'OPEN',   description: 'Build modern, responsive web interfaces for our product suite.',          responsibilities: ['Develop React/Next.js applications', 'Optimize web performance', 'Collaborate with designers', 'Write unit tests'],                    qualifications: ['3+ years in frontend development', 'React and TypeScript proficiency', 'CSS and accessibility knowledge', 'Strong portfolio'],         benefits: ['HMO coverage', 'Hybrid work', 'Tech allowance', '13th month pay'] },
  ],
  // Creative Studio Co.
  [
    { title: 'Senior UI/UX Designer',       department: 'Design',              location: 'Cebu City, Philippines',    location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '60000', maximum_salary: '90000',  currency: 'PHP', status: 'OPEN',   description: 'Lead design for client projects from research to high-fidelity prototypes.', responsibilities: ['Create wireframes and mockups', 'Conduct user research', 'Collaborate with developers', 'Present to clients'],                         qualifications: ['4+ years in UI/UX', 'Figma proficiency', 'Strong portfolio', 'Design systems experience'],                                             benefits: ['HMO coverage', 'Creative tools stipend', 'Flexible hours', 'Portfolio projects'] },
    { title: 'Brand Strategist',            department: 'Marketing',           location: 'Cebu City, Philippines',    location_type: 'ONSITE',  employment_type: 'Full-time', minimum_salary: '50000', maximum_salary: '75000',  currency: 'PHP', status: 'OPEN',   description: 'Develop brand strategies for our diverse portfolio of clients.',          responsibilities: ['Conduct brand audits', 'Develop brand positioning', 'Oversee visual identity', 'Present to stakeholders'],                             qualifications: ['3+ years in brand management', 'Excellent communication skills', 'Agency experience', 'Strong presentation skills'],                  benefits: ['HMO coverage', '13th month pay', 'Paid training', 'Creative environment'] },
    { title: 'Motion Graphics Designer',    department: 'Design',              location: 'Cebu City, Philippines',    location_type: 'REMOTE',  employment_type: 'Full-time', minimum_salary: '40000', maximum_salary: '65000',  currency: 'PHP', status: 'OPEN',   description: 'Create compelling motion graphics for digital campaigns.',               responsibilities: ['Design and animate motion graphics', 'Create explainer videos', 'Collaborate with creative team', 'Maintain brand consistency'],      qualifications: ['2+ years in motion graphics', 'After Effects and Premiere Pro', 'Strong visual storytelling', 'Portfolio required'],                  benefits: ['Fully remote', 'Equipment stipend', 'Flexible schedule', 'Annual bonus'] },
    { title: 'Copywriter',                  department: 'Marketing',           location: 'Cebu City, Philippines',    location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '35000', maximum_salary: '55000',  currency: 'PHP', status: 'OPEN',   description: 'Craft compelling copy for websites, social media, and campaigns.',       responsibilities: ['Write web and social copy', 'Develop brand voice guidelines', 'Edit and proofread content', 'Collaborate with designers'],             qualifications: ['2+ years in copywriting or content writing', 'Strong command of English', 'Portfolio of work', 'SEO knowledge a plus'],               benefits: ['HMO coverage', 'Hybrid work', 'Creativity-focused culture', '13th month'] },
    { title: 'Creative Director',           department: 'Design',              location: 'Cebu City, Philippines',    location_type: 'ONSITE',  employment_type: 'Full-time', minimum_salary: '90000', maximum_salary: '130000', currency: 'PHP', status: 'OPEN',   description: 'Lead the creative vision and output of the agency across all projects.', responsibilities: ['Set creative direction for campaigns', 'Manage the design team', 'Present concepts to clients', 'Ensure quality standards'],            qualifications: ['8+ years in design or advertising', 'Strong leadership skills', 'Diverse portfolio', 'Experience managing creatives'],                 benefits: ['HMO (employee + family)', 'Executive package', 'Annual bonus', 'Company car allowance'] },
  ],
  // FinVault
  [
    { title: 'Backend Engineer (Fintech)',  department: 'Engineering',         location: 'Taguig City, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '90000', maximum_salary: '140000', currency: 'PHP', status: 'OPEN',   description: 'Build core payment processing and banking infrastructure.',              responsibilities: ['Develop payment APIs', 'Implement security best practices', 'Integrate with banking providers', 'On-call rotation'],                   qualifications: ['4+ years in backend engineering', 'Fintech/payments experience', 'Security and compliance knowledge', 'Java, Go, or Node.js'],         benefits: ['Competitive salary + equity', 'HMO (employee + 3 dependents)', 'Annual salary review', 'Hybrid work'] },
    { title: 'Data Analyst',               department: 'Data & Analytics',    location: 'Taguig City, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '55000', maximum_salary: '80000',  currency: 'PHP', status: 'OPEN',   description: 'Analyze financial transaction data to drive product and business decisions.', responsibilities: ['Build dashboards in Tableau/Looker', 'Write complex SQL queries', 'Collaborate with product teams', 'Present to management'],        qualifications: ['2+ years in data analysis', 'Advanced SQL skills', 'Python for data analysis', 'Strong visualization skills'],                        benefits: ['HMO coverage', '13th month pay', 'Learning budget', 'Hybrid setup'] },
    { title: 'Compliance Officer',         department: 'Legal & Compliance',  location: 'Taguig City, Philippines',  location_type: 'ONSITE',  employment_type: 'Full-time', minimum_salary: '70000', maximum_salary: '100000', currency: 'PHP', status: 'OPEN',   description: "Ensure FinVault's operations comply with BSP regulations.",              responsibilities: ['Monitor regulatory changes', 'Develop compliance policies', 'Conduct internal audits', 'Liaise with regulators'],                      qualifications: ['Law, Finance, or related degree', '3+ years in financial compliance', 'BSP/AML/KYC knowledge', 'Strong communication skills'],         benefits: ['HMO coverage', 'Annual performance bonus', 'Cert support', 'BGC location'] },
    { title: 'Mobile Engineer (React Native)', department: 'Engineering',      location: 'Taguig City, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '75000', maximum_salary: '110000', currency: 'PHP', status: 'OPEN',   description: 'Build and maintain the FinVault mobile app for iOS and Android.',        responsibilities: ['Develop React Native features', 'Optimize app performance', 'Collaborate with design and backend teams', 'Write unit tests'],          qualifications: ['3+ years in mobile development', 'React Native proficiency', 'Published apps in store', 'REST API integration experience'],           benefits: ['Equity participation', 'HMO coverage', 'Hybrid work', 'Annual learning budget'] },
    { title: 'Risk Analyst',               department: 'Risk Management',     location: 'Taguig City, Philippines',  location_type: 'ONSITE',  employment_type: 'Full-time', minimum_salary: '60000', maximum_salary: '90000',  currency: 'PHP', status: 'OPEN',   description: 'Assess and mitigate financial and operational risks across FinVault.',    responsibilities: ['Perform risk assessments', 'Develop risk mitigation strategies', 'Monitor risk indicators', 'Prepare risk reports'],                   qualifications: ['Finance, Math, or Statistics degree', '2+ years in risk management', 'Knowledge of financial risk frameworks', 'Excel/Python skills'], benefits: ['HMO coverage', 'Performance bonus', 'Professional development', 'BGC office'] },
  ],
  // HealthSync Philippines
  [
    { title: 'Full Stack Developer',       department: 'Engineering',         location: 'Mandaluyong, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '65000', maximum_salary: '95000',  currency: 'PHP', status: 'OPEN',   description: 'Build features for our electronic health records (EHR) platform.',       responsibilities: ['Develop frontend and backend features', 'Integrate with hospital systems', 'Ensure HIPAA-level data security', 'Write tests'],          qualifications: ['4+ years in full stack development', 'React and Node.js skills', 'Healthcare domain knowledge a plus', 'REST API experience'],        benefits: ['HMO (employee + 2 dependents)', 'Hybrid work', '13th month', 'Annual bonus'] },
    { title: 'Healthcare IT Specialist',   department: 'IT Operations',       location: 'Mandaluyong, Philippines',  location_type: 'ONSITE',  employment_type: 'Full-time', minimum_salary: '45000', maximum_salary: '65000',  currency: 'PHP', status: 'OPEN',   description: 'Support the deployment and maintenance of HealthSync systems in clinics.', responsibilities: ['Install and configure software', 'Train clinic staff', 'Troubleshoot technical issues', 'Maintain system documentation'],               qualifications: ['IT or Computer Science degree', '2+ years in IT support', 'Network and hardware knowledge', 'Patient and service-oriented'],           benefits: ['HMO coverage', 'Field work allowance', '13th month pay', 'Training support'] },
    { title: 'UX Researcher',              department: 'Design',              location: 'Mandaluyong, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '50000', maximum_salary: '75000',  currency: 'PHP', status: 'OPEN',   description: 'Conduct user research to improve the experience of healthcare professionals.', responsibilities: ['Plan and conduct user interviews', 'Synthesize research insights', 'Create personas and journey maps', 'Present findings to product teams'], qualifications: ['3+ years in UX research', 'Proficiency in research methodologies', 'Healthcare or enterprise software experience a plus', 'Figma skills'], benefits: ['HMO coverage', 'Hybrid work', 'Conference attendance', 'Research tools budget'] },
    { title: 'Product Analyst',            department: 'Product',             location: 'Mandaluyong, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '50000', maximum_salary: '70000',  currency: 'PHP', status: 'OPEN',   description: 'Analyze product usage data to guide feature decisions for our EHR platform.', responsibilities: ['Track product KPIs and metrics', 'Perform A/B testing analysis', 'Write product specs', 'Collaborate with PM and engineering'],      qualifications: ['2+ years in product or data analysis', 'SQL proficiency', 'Experience with analytics tools', 'Strong written communication'],         benefits: ['HMO coverage', 'Hybrid setup', 'Stock options', 'Learning allowance'] },
    { title: 'Cloud Infrastructure Engineer', department: 'Engineering',      location: 'Mandaluyong, Philippines',  location_type: 'REMOTE',  employment_type: 'Full-time', minimum_salary: '80000', maximum_salary: '120000', currency: 'PHP', status: 'OPEN',   description: 'Design and operate the cloud infrastructure powering our healthcare platform.', responsibilities: ['Manage GCP/AWS infrastructure', 'Implement disaster recovery', 'Enforce compliance standards', 'Automate infrastructure tasks'], qualifications: ['4+ years in cloud engineering', 'GCP or AWS expertise', 'Experience with healthcare data compliance', 'Terraform and Ansible'],       benefits: ['Fully remote', 'HMO coverage', 'Home office stipend', 'Annual bonus'] },
  ],
  // EduLearn PH
  [
    { title: 'Instructional Designer',     department: 'Content & Curriculum', location: 'Quezon City, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '40000', maximum_salary: '60000',  currency: 'PHP', status: 'OPEN',   description: 'Design and develop engaging e-learning courses for K-12 and higher education.', responsibilities: ['Develop course structures and learning objectives', 'Create storyboards and scripts', 'Collaborate with subject matter experts', 'Use LMS tools'], qualifications: ['Education or Communications degree', '2+ years in instructional design', 'Experience with e-learning tools like Articulate', 'Excellent writing skills'], benefits: ['HMO coverage', 'Hybrid work', 'Learning tools access', '13th month'] },
    { title: 'Backend Developer',          department: 'Engineering',         location: 'Quezon City, Philippines',  location_type: 'REMOTE',  employment_type: 'Full-time', minimum_salary: '55000', maximum_salary: '80000',  currency: 'PHP', status: 'OPEN',   description: 'Build and maintain the APIs and services powering our LMS platform.',    responsibilities: ['Develop RESTful APIs', 'Optimize database queries', 'Integrate with third-party EdTech tools', 'Participate in code reviews'],         qualifications: ['3+ years in backend development', 'Node.js or Python skills', 'PostgreSQL experience', 'Experience with video streaming a plus'],     benefits: ['Fully remote', 'HMO coverage', 'Equipment stipend', 'Flexible schedule'] },
    { title: 'Growth Marketing Manager',   department: 'Marketing',           location: 'Quezon City, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '55000', maximum_salary: '80000',  currency: 'PHP', status: 'OPEN',   description: 'Drive user acquisition and retention for EduLearn across digital channels.',  responsibilities: ['Run paid and organic campaigns', 'Manage SEO and SEM strategy', 'Analyze funnel metrics', 'Oversee email marketing'],               qualifications: ['3+ years in digital marketing', 'Google Ads and Meta Ads experience', 'Strong analytical skills', 'EdTech or SaaS background a plus'], benefits: ['HMO coverage', 'Hybrid work', 'Marketing tools budget', 'Performance bonus'] },
    { title: 'Customer Success Manager',   department: 'Customer Success',    location: 'Quezon City, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '45000', maximum_salary: '65000',  currency: 'PHP', status: 'OPEN',   description: 'Onboard and support schools and universities using the EduLearn platform.',  responsibilities: ['Onboard new institution clients', 'Conduct training sessions', 'Monitor account health', 'Gather feedback for product team'],           qualifications: ['2+ years in customer success or account management', 'Excellent communication skills', 'EdTech background preferred', 'Patient and proactive'], benefits: ['HMO coverage', 'Hybrid work', 'Training support', '13th month'] },
    { title: 'iOS Developer',              department: 'Engineering',         location: 'Quezon City, Philippines',  location_type: 'REMOTE',  employment_type: 'Full-time', minimum_salary: '65000', maximum_salary: '95000',  currency: 'PHP', status: 'OPEN',   description: 'Build and maintain the EduLearn iOS app used by thousands of students.',  responsibilities: ['Develop Swift/SwiftUI features', 'Optimize app performance', 'Collaborate with backend and design', 'Handle App Store submissions'],   qualifications: ['3+ years in iOS development', 'Swift and SwiftUI proficiency', 'Published iOS apps', 'Clean code practices'],                          benefits: ['Fully remote', 'HMO coverage', 'MacBook provided', 'Annual bonus'] },
  ],
  // LogiTrack
  [
    { title: 'Software Engineer (Logistics)', department: 'Engineering',       location: 'Cebu City, Philippines',    location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '60000', maximum_salary: '90000',  currency: 'PHP', status: 'OPEN',   description: 'Build the fleet management and dispatch systems at the core of LogiTrack.',  responsibilities: ['Develop real-time tracking features', 'Integrate with GPS providers', 'Build dispatch optimization algorithms', 'Maintain APIs'],     qualifications: ['3+ years in software engineering', 'Experience with geospatial data', 'Node.js or Python skills', 'PostgreSQL proficiency'],           benefits: ['HMO coverage', 'Hybrid work', '13th month', 'Annual bonus'] },
    { title: 'Operations Analyst',          department: 'Operations',          location: 'Cebu City, Philippines',    location_type: 'ONSITE',  employment_type: 'Full-time', minimum_salary: '35000', maximum_salary: '55000',  currency: 'PHP', status: 'OPEN',   description: 'Analyze logistics operations data to improve efficiency and reduce costs.', responsibilities: ['Monitor KPIs and SLAs', 'Identify operational bottlenecks', 'Prepare performance reports', 'Support route optimization projects'],     qualifications: ['Business, IE, or related degree', '2+ years in logistics or operations', 'SQL and Excel proficiency', 'Strong analytical mindset'],    benefits: ['HMO coverage', 'Shuttle service', '13th month', 'Team events'] },
    { title: 'Mobile Developer (Android)',  department: 'Engineering',         location: 'Cebu City, Philippines',    location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '55000', maximum_salary: '80000',  currency: 'PHP', status: 'OPEN',   description: 'Build the Android app used by our delivery drivers and dispatchers.',      responsibilities: ['Develop Kotlin/Jetpack Compose features', 'Integrate with REST APIs', 'Optimize offline functionality', 'Test on various devices'],   qualifications: ['3+ years in Android development', 'Kotlin proficiency', 'Published Android apps', 'Experience with location services'],                benefits: ['HMO coverage', 'Hybrid work', 'Device allowance', '13th month'] },
    { title: 'Business Development Manager', department: 'Sales',              location: 'Cebu City, Philippines',    location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '55000', maximum_salary: '85000',  currency: 'PHP', status: 'OPEN',   description: 'Grow LogiTrack\'s client base by acquiring new enterprise and SME accounts.',  responsibilities: ['Prospect and qualify leads', 'Conduct sales presentations', 'Negotiate contracts', 'Meet quarterly revenue targets'],                qualifications: ['3+ years in B2B sales or BDM roles', 'Logistics industry knowledge a plus', 'Strong negotiation skills', 'Proven track record'],       benefits: ['Base salary + commission', 'HMO coverage', 'Car plan', 'Incentive trips'] },
    { title: 'UI/UX Designer',             department: 'Design',              location: 'Cebu City, Philippines',    location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '40000', maximum_salary: '60000',  currency: 'PHP', status: 'OPEN',   description: 'Design intuitive interfaces for our driver and dispatcher applications.',    responsibilities: ['Create wireframes and prototypes', 'Conduct usability testing', 'Build and maintain design system', 'Collaborate with engineering'],   qualifications: ['2+ years in UI/UX design', 'Figma proficiency', 'Mobile design experience', 'Portfolio required'],                                    benefits: ['HMO coverage', 'Hybrid setup', 'Tools stipend', '13th month'] },
  ],
  // RetailPro
  [
    { title: 'E-Commerce Manager',          department: 'E-Commerce',          location: 'Taguig City, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '60000', maximum_salary: '90000',  currency: 'PHP', status: 'OPEN',   description: 'Manage RetailPro\'s own e-commerce channels and support client storefronts.', responsibilities: ['Manage product listings and campaigns', 'Analyze conversion metrics', 'Coordinate with logistics for fulfillment', 'Improve checkout experience'], qualifications: ['3+ years in e-commerce management', 'Shopify or WooCommerce experience', 'Data-driven mindset', 'Strong project management'],           benefits: ['HMO coverage', 'Hybrid work', 'Performance incentive', '13th month'] },
    { title: 'Data Engineer',               department: 'Data & Analytics',    location: 'Taguig City, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '70000', maximum_salary: '100000', currency: 'PHP', status: 'OPEN',   description: 'Build and maintain the data pipelines that power RetailPro\'s analytics.',  responsibilities: ['Design and build ETL pipelines', 'Maintain data warehouse', 'Ensure data quality', 'Collaborate with analysts and engineers'],         qualifications: ['3+ years in data engineering', 'Spark or Airflow experience', 'SQL and Python proficiency', 'Cloud data platform experience'],         benefits: ['HMO coverage', 'Hybrid work', 'Annual learning budget', '13th month'] },
    { title: 'Software Engineer (.NET)',    department: 'Engineering',         location: 'Taguig City, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '65000', maximum_salary: '95000',  currency: 'PHP', status: 'OPEN',   description: 'Develop and maintain the core POS and inventory management modules.',      responsibilities: ['Build features in .NET/C#', 'Optimize database performance', 'Integrate with payment gateways', 'Write unit and integration tests'],  qualifications: ['4+ years in .NET development', 'C# proficiency', 'SQL Server experience', 'POS or ERP background a plus'],                             benefits: ['HMO coverage', 'Hybrid work', '13th month', 'Team events'] },
    { title: 'Project Manager',            department: 'Project Management',  location: 'Taguig City, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '60000', maximum_salary: '90000',  currency: 'PHP', status: 'OPEN',   description: 'Lead implementation projects for enterprise retail clients.',             responsibilities: ['Manage project scope, timeline, and budget', 'Coordinate internal and client teams', 'Identify and resolve project risks', 'Run status meetings'], qualifications: ['PMP or equivalent certification', '4+ years in IT project management', 'Retail or ERP implementation experience', 'Strong stakeholder management'], benefits: ['HMO coverage', 'Hybrid work', 'Annual bonus', 'Professional development'] },
    { title: 'Support Engineer',           department: 'Customer Support',    location: 'Taguig City, Philippines',  location_type: 'ONSITE',  employment_type: 'Full-time', minimum_salary: '35000', maximum_salary: '50000',  currency: 'PHP', status: 'OPEN',   description: 'Provide technical support for RetailPro clients using our POS and analytics software.', responsibilities: ['Resolve L1/L2 support tickets', 'Diagnose technical issues', 'Escalate complex bugs to engineering', 'Maintain support documentation'], qualifications: ['IT or CS degree', '1+ year in tech support', 'SQL basic knowledge', 'Customer-oriented attitude'],                                      benefits: ['HMO coverage', 'Shift allowance', '13th month', 'Career growth path'] },
  ],
  // GreenBuild Corp.
  [
    { title: 'BIM Engineer',               department: 'Engineering',         location: 'Makati City, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '55000', maximum_salary: '80000',  currency: 'PHP', status: 'OPEN',   description: 'Lead Building Information Modeling for our commercial construction projects.', responsibilities: ['Create and manage BIM models in Revit', 'Coordinate with structural and MEP teams', 'Conduct clash detection', 'Ensure BIM standards compliance'], qualifications: ['Civil or Architecture degree', '3+ years in BIM', 'Autodesk Revit proficiency', 'Experience with large commercial projects'],             benefits: ['HMO coverage', 'Hybrid work', 'Project completion bonus', '13th month'] },
    { title: 'Smart Building IoT Developer', department: 'Engineering',        location: 'Makati City, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '65000', maximum_salary: '95000',  currency: 'PHP', status: 'OPEN',   description: 'Develop IoT integrations for smart building automation and energy management.', responsibilities: ['Develop IoT firmware and backend services', 'Integrate HVAC, lighting, and access systems', 'Build monitoring dashboards', 'Ensure cybersecurity compliance'], qualifications: ['3+ years in IoT or embedded development', 'MQTT and REST API experience', 'Python or C experience', 'Smart building protocols knowledge'], benefits: ['HMO coverage', 'Hybrid work', 'Innovation bonus', 'Annual salary review'] },
    { title: 'Sustainability Consultant',  department: 'Sustainability',      location: 'Makati City, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '60000', maximum_salary: '85000',  currency: 'PHP', status: 'OPEN',   description: 'Guide GreenBuild projects toward LEED and BERDE certification standards.',  responsibilities: ['Conduct sustainability assessments', 'Advise on green building materials', 'Prepare LEED documentation', 'Train construction teams'],   qualifications: ['Architecture or Environmental Science degree', 'LEED AP certification', '3+ years in sustainable construction', 'Knowledge of PH green building standards'], benefits: ['HMO coverage', 'Certification support', 'Hybrid work', 'Annual bonus'] },
    { title: 'HR Manager',                 department: 'Human Resources',     location: 'Makati City, Philippines',  location_type: 'ONSITE',  employment_type: 'Full-time', minimum_salary: '55000', maximum_salary: '80000',  currency: 'PHP', status: 'OPEN',   description: 'Manage HR operations for a 600+ person construction and technology workforce.', responsibilities: ['Oversee recruitment and onboarding', 'Manage compensation and benefits', 'Ensure labor law compliance', 'Drive employee engagement programs'], qualifications: ['HR Management degree', '5+ years in HR', 'Construction or real estate industry experience a plus', 'CHRP certification preferred'], benefits: ['HMO (employee + family)', 'Company car', 'Executive package', 'Annual bonus'] },
    { title: 'Financial Analyst',          department: 'Finance',             location: 'Makati City, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '55000', maximum_salary: '80000',  currency: 'PHP', status: 'OPEN',   description: 'Perform financial analysis and modeling for GreenBuild\'s project pipeline.',  responsibilities: ['Build financial models for projects', 'Prepare budget vs. actuals reports', 'Conduct variance analysis', 'Support investor reporting'],  qualifications: ['Finance or Accounting degree', '3+ years in financial analysis', 'Advanced Excel and PowerPoint', 'CPA or CFA a plus'],                  benefits: ['HMO coverage', 'Hybrid work', 'Annual bonus', 'Performance incentive'] },
  ],
  // MediaPulse
  [
    { title: 'Video Producer',             department: 'Content',             location: 'Cebu City, Philippines',    location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '40000', maximum_salary: '60000',  currency: 'PHP', status: 'OPEN',   description: 'Produce high-quality video content for brands and MediaPulse\'s own channels.', responsibilities: ['Plan and execute video shoots', 'Direct talent and crew', 'Edit video content in Premiere Pro', 'Manage content calendars'],            qualifications: ['2+ years in video production', 'Adobe Premiere Pro proficiency', 'Strong storytelling instincts', 'Portfolio of produced work'],          benefits: ['HMO coverage', 'Equipment provided', 'Hybrid work', '13th month'] },
    { title: 'Podcast Producer',           department: 'Content',             location: 'Cebu City, Philippines',    location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '35000', maximum_salary: '55000',  currency: 'PHP', status: 'OPEN',   description: 'Produce and grow podcast shows for MediaPulse and its brand clients.',     responsibilities: ['Develop show concepts and episode structures', 'Book and interview guests', 'Edit audio in Adobe Audition', 'Manage podcast distribution'], qualifications: ['1+ year in podcast or radio production', 'Audio editing skills', 'Excellent on-air presence', 'Passion for storytelling'],               benefits: ['Hybrid work', 'HMO coverage', 'Creative environment', '13th month'] },
    { title: 'Digital Marketing Specialist', department: 'Marketing',         location: 'Cebu City, Philippines',    location_type: 'REMOTE',  employment_type: 'Full-time', minimum_salary: '40000', maximum_salary: '60000',  currency: 'PHP', status: 'OPEN',   description: 'Manage digital campaigns across social media and search for MediaPulse and its clients.', responsibilities: ['Plan and execute Meta and Google Ads campaigns', 'Manage social media accounts', 'Track and report campaign performance', 'Optimize ad spend'], qualifications: ['2+ years in digital marketing', 'Meta Ads and Google Ads certification', 'Strong analytical skills', 'Content creation experience'],    benefits: ['Fully remote', 'HMO coverage', 'Tools budget', 'Performance bonus'] },
    { title: 'Social Media Manager',       department: 'Marketing',           location: 'Cebu City, Philippines',    location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '35000', maximum_salary: '55000',  currency: 'PHP', status: 'OPEN',   description: 'Build and manage social media presence for MediaPulse and its brand partners.', responsibilities: ['Create and schedule content', 'Engage with audiences', 'Monitor social trends', 'Report on growth metrics'],                           qualifications: ['2+ years in social media management', 'Proficiency in Canva or Adobe', 'Strong written voice', 'Data-driven approach'],                benefits: ['HMO coverage', 'Hybrid work', 'Flexible hours', '13th month'] },
    { title: 'Full Stack Developer',       department: 'Engineering',         location: 'Cebu City, Philippines',    location_type: 'REMOTE',  employment_type: 'Full-time', minimum_salary: '60000', maximum_salary: '90000',  currency: 'PHP', status: 'OPEN',   description: 'Build and maintain the MediaPulse content management and distribution platform.', responsibilities: ['Develop CMS features', 'Build API integrations with streaming platforms', 'Optimize media delivery performance', 'Write tests'],     qualifications: ['3+ years in full stack development', 'React and Node.js skills', 'Experience with media or streaming platforms a plus', 'PostgreSQL skills'], benefits: ['Fully remote', 'HMO coverage', 'Home office allowance', '13th month'] },
  ],
  // CyberShield PH
  [
    { title: 'Penetration Tester',         department: 'Security Operations', location: 'Makati City, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '80000', maximum_salary: '120000', currency: 'PHP', status: 'OPEN',   description: 'Perform authorized penetration tests on client networks, apps, and systems.', responsibilities: ['Conduct network and web app pentests', 'Write detailed vulnerability reports', 'Recommend remediation strategies', 'Stay current on CVEs'], qualifications: ['3+ years in penetration testing', 'OSCP or CEH certification', 'Knowledge of OWASP Top 10', 'Scripting in Python or Bash'],               benefits: ['HMO coverage', 'Certification budget', 'Hybrid work', 'Project completion bonuses'] },
    { title: 'Security Operations Analyst', department: 'Security Operations', location: 'Makati City, Philippines', location_type: 'ONSITE',  employment_type: 'Full-time', minimum_salary: '55000', maximum_salary: '80000',  currency: 'PHP', status: 'OPEN',   description: 'Monitor client environments for threats and respond to security incidents.',  responsibilities: ['Monitor SIEM alerts', 'Triage and respond to incidents', 'Perform threat hunting', 'Document incidents and response procedures'],       qualifications: ['2+ years in SOC or cybersecurity', 'SIEM tools experience (Splunk, QRadar)', 'Knowledge of MITRE ATT&CK', 'Security+ or equivalent'],   benefits: ['HMO coverage', 'Shift allowance', '13th month', 'Certification support'] },
    { title: 'Cloud Security Engineer',    department: 'Engineering',         location: 'Makati City, Philippines',  location_type: 'REMOTE',  employment_type: 'Full-time', minimum_salary: '90000', maximum_salary: '130000', currency: 'PHP', status: 'OPEN',   description: 'Design and implement security controls for client cloud environments.',      responsibilities: ['Assess cloud security posture', 'Implement IAM and network security controls', 'Configure CSPM tools', 'Conduct cloud security audits'], qualifications: ['4+ years in cloud security', 'AWS/GCP/Azure security expertise', 'CCSP or AWS Security specialty cert', 'IaC experience (Terraform)'],    benefits: ['Fully remote', 'HMO coverage', 'Premium certification budget', 'Equity plan'] },
    { title: 'Compliance Consultant (ISO 27001)', department: 'Consulting',   location: 'Makati City, Philippines',  location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '70000', maximum_salary: '100000', currency: 'PHP', status: 'OPEN',   description: 'Guide enterprise clients through ISO 27001 and NPC compliance programs.',   responsibilities: ['Conduct gap assessments', 'Develop ISMS documentation', 'Facilitate client workshops', 'Support audit preparation'],                   qualifications: ['ISO 27001 Lead Auditor certification', '3+ years in compliance consulting', 'Strong documentation skills', 'Excellent client-facing skills'], benefits: ['HMO coverage', 'Hybrid work', 'Consulting bonus', 'Annual certification renewal'] },
    { title: 'Security Awareness Trainer', department: 'Training & Education', location: 'Makati City, Philippines', location_type: 'HYBRID',  employment_type: 'Full-time', minimum_salary: '50000', maximum_salary: '70000',  currency: 'PHP', status: 'OPEN',   description: 'Develop and deliver cybersecurity awareness programs for enterprise clients.', responsibilities: ['Design training modules and phishing simulations', 'Deliver workshops and webinars', 'Measure training effectiveness', 'Create awareness content'], qualifications: ['2+ years in cybersecurity training or education', 'Strong public speaking skills', 'Security background required', 'Instructional design experience a plus'], benefits: ['HMO coverage', 'Hybrid work', 'Training materials budget', '13th month'] },
  ],
];

type CareerStatus = 'ACTIVELY_LOOKING' | 'OPEN_TO_OPPORTUNITIES' | 'EMPLOYED_NOT_LOOKING' | 'NOT_LOOKING';
type Proficiency = 'BASIC' | 'CONVERSATIONAL' | 'FLUENT' | 'NATIVE';

interface ApplicantTemplate {
  first_name: string; last_name: string; email: string;
  age: number; gender: string; desired_position: string;
  location: string; phone_number: string;
  career_status: CareerStatus;
  skills: string[];
  languages: { language_name: string; proficiency_level: Proficiency }[];
  education: { institution_name: string; field_of_study: string; start_year: number; end_year: number | null };
  experience: { company_name: string; position: string; start_date: Date; is_current: boolean; end_date: Date | null };
}

const APPLICANTS: ApplicantTemplate[] = [
  { first_name: 'Juan',      last_name: 'Dela Cruz',   email: 'juan.delacruz@gmail.com',    age: 27, gender: 'Male',   desired_position: 'Senior Software Engineer',  location: 'Cebu City, Philippines',    phone_number: '+63 912 345 6789', career_status: 'ACTIVELY_LOOKING',       skills: ['Node.js','TypeScript','PostgreSQL','React','Docker'],                                  languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'University of San Carlos',            field_of_study:'Computer Science',          start_year:2015, end_year:2019}, experience: {company_name:'Accenture Philippines',    position:'Software Engineer',         start_date:new Date('2019-07-01'), is_current:false, end_date:new Date('2022-03-31')} },
  { first_name: 'Maria',     last_name: 'Santos',      email: 'maria.santos@gmail.com',     age: 25, gender: 'Female', desired_position: 'Senior UI/UX Designer',     location: 'Cebu City, Philippines',    phone_number: '+63 917 654 3210', career_status: 'OPEN_TO_OPPORTUNITIES',  skills: ['Figma','Adobe XD','Prototyping','User Research','Design Systems'],                    languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'CIT University',                      field_of_study:'Information Technology',    start_year:2017, end_year:2021}, experience: {company_name:'Pointwest Innovations',    position:'UI/UX Designer',            start_date:new Date('2021-06-01'), is_current:true,  end_date:null} },
  { first_name: 'Carlo',     last_name: 'Reyes',       email: 'carlo.reyes@gmail.com',      age: 29, gender: 'Male',   desired_position: 'DevOps Engineer',           location: 'Makati City, Philippines',  phone_number: '+63 920 111 2233', career_status: 'ACTIVELY_LOOKING',       skills: ['Kubernetes','Docker','Terraform','AWS','CI/CD'],                                      languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'},{language_name:'Japanese',proficiency_level:'BASIC'}], education: {institution_name:'De La Salle University',              field_of_study:'Computer Engineering',      start_year:2013, end_year:2017}, experience: {company_name:'Sprout Solutions',          position:'DevOps Engineer',           start_date:new Date('2020-06-01'), is_current:true,  end_date:null} },
  { first_name: 'Ana',       last_name: 'Garcia',      email: 'ana.garcia@gmail.com',       age: 24, gender: 'Female', desired_position: 'Data Analyst',              location: 'Taguig City, Philippines',  phone_number: '+63 905 876 5432', career_status: 'OPEN_TO_OPPORTUNITIES',  skills: ['SQL','Python','Tableau','Excel','Data Visualization'],                               languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'UP Diliman',                          field_of_study:'Statistics',                start_year:2018, end_year:2022}, experience: {company_name:'GCash',                     position:'Junior Data Analyst',       start_date:new Date('2022-09-01'), is_current:true,  end_date:null} },
  { first_name: 'Rico',      last_name: 'Mendoza',     email: 'rico.mendoza@gmail.com',     age: 26, gender: 'Male',   desired_position: 'Brand Strategist',          location: 'Cebu City, Philippines',    phone_number: '+63 933 456 7890', career_status: 'ACTIVELY_LOOKING',       skills: ['Brand Strategy','Content Marketing','Social Media','Copywriting','Adobe Illustrator'], languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'},{language_name:'Spanish',proficiency_level:'CONVERSATIONAL'}], education: {institution_name:'University of Cebu',                  field_of_study:'Marketing Management',      start_year:2016, end_year:2020}, experience: {company_name:'BBDO Guerrero',              position:'Brand Executive',           start_date:new Date('2020-10-01'), is_current:true,  end_date:null} },
  { first_name: 'Lea',       last_name: 'Flores',      email: 'lea.flores@gmail.com',       age: 28, gender: 'Female', desired_position: 'Product Manager',           location: 'Quezon City, Philippines',  phone_number: '+63 908 321 4567', career_status: 'ACTIVELY_LOOKING',       skills: ['Product Roadmapping','Agile','JIRA','Data Analysis','Stakeholder Management'],        languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'Ateneo de Manila University',         field_of_study:'Management Information Systems',start_year:2014, end_year:2018}, experience: {company_name:'Shopee Philippines',         position:'Associate Product Manager', start_date:new Date('2018-09-01'), is_current:false, end_date:new Date('2022-12-31')} },
  { first_name: 'Rommel',    last_name: 'Bautista',    email: 'rommel.bautista@gmail.com',  age: 31, gender: 'Male',   desired_position: 'Backend Engineer',          location: 'Makati City, Philippines',  phone_number: '+63 919 876 1234', career_status: 'OPEN_TO_OPPORTUNITIES',  skills: ['Java','Spring Boot','PostgreSQL','Microservices','Redis'],                            languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'Mapua University',                    field_of_study:'Computer Science',          start_year:2011, end_year:2015}, experience: {company_name:'UnionBank Philippines',     position:'Senior Software Engineer',  start_date:new Date('2018-03-01'), is_current:true,  end_date:null} },
  { first_name: 'Claire',    last_name: 'Ocampo',      email: 'claire.ocampo@gmail.com',    age: 26, gender: 'Female', desired_position: 'UX Researcher',             location: 'Mandaluyong, Philippines',  phone_number: '+63 916 543 2109', career_status: 'ACTIVELY_LOOKING',       skills: ['User Interviews','Usability Testing','Figma','Persona Creation','Journey Mapping'],   languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'},{language_name:'Korean',proficiency_level:'BASIC'}],   education: {institution_name:'University of Santo Tomas',           field_of_study:'Psychology',                start_year:2016, end_year:2020}, experience: {company_name:'Globe Telecom',              position:'UX Researcher',             start_date:new Date('2020-08-01'), is_current:true,  end_date:null} },
  { first_name: 'Dante',     last_name: 'Villanueva',  email: 'dante.villanueva@gmail.com', age: 33, gender: 'Male',   desired_position: 'Cloud Infrastructure Engineer', location: 'Pasig City, Philippines', phone_number: '+63 921 765 4321', career_status: 'EMPLOYED_NOT_LOOKING',   skills: ['AWS','GCP','Kubernetes','Terraform','Ansible'],                                       languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'PLM Manila',                          field_of_study:'Electronics Engineering',   start_year:2009, end_year:2013}, experience: {company_name:'Telus International Philippines', position:'Cloud Operations Lead', start_date:new Date('2017-01-01'), is_current:true, end_date:null} },
  { first_name: 'Jasmine',   last_name: 'Lim',         email: 'jasmine.lim@gmail.com',      age: 24, gender: 'Female', desired_position: 'Motion Graphics Designer',  location: 'Cebu City, Philippines',    phone_number: '+63 907 234 5678', career_status: 'ACTIVELY_LOOKING',       skills: ['After Effects','Premiere Pro','Illustrator','Animation','Cinema 4D'],                 languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'},{language_name:'Mandarin',proficiency_level:'CONVERSATIONAL'}], education: {institution_name:'University of the Visayas',           field_of_study:'Multimedia Arts',           start_year:2018, end_year:2022}, experience: {company_name:'Freelance',                  position:'Motion Designer',           start_date:new Date('2022-06-01'), is_current:true,  end_date:null} },
  { first_name: 'Nathan',    last_name: 'Cruz',        email: 'nathan.cruz@gmail.com',      age: 27, gender: 'Male',   desired_position: 'QA Engineer',               location: 'Cebu City, Philippines',    phone_number: '+63 922 111 3344', career_status: 'ACTIVELY_LOOKING',       skills: ['Cypress','Playwright','Postman','JIRA','Selenium'],                                   languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'Southwestern University PHINMA',      field_of_study:'Information Technology',    start_year:2015, end_year:2019}, experience: {company_name:'Cebuana Lhuillier',          position:'QA Analyst',                start_date:new Date('2019-10-01'), is_current:true,  end_date:null} },
  { first_name: 'Patricia',  last_name: 'Tan',         email: 'patricia.tan@gmail.com',     age: 30, gender: 'Female', desired_position: 'HR Manager',                location: 'Makati City, Philippines',  phone_number: '+63 932 998 7654', career_status: 'OPEN_TO_OPPORTUNITIES',  skills: ['Recruitment','HRIS','Labor Law','Compensation & Benefits','Employee Relations'],      languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'Far Eastern University',              field_of_study:'Human Resource Management', start_year:2012, end_year:2016}, experience: {company_name:'Robinsons Land Corporation', position:'HR Supervisor',             start_date:new Date('2019-05-01'), is_current:true,  end_date:null} },
  { first_name: 'Gerald',    last_name: 'Ramos',       email: 'gerald.ramos@gmail.com',     age: 28, gender: 'Male',   desired_position: 'Penetration Tester',        location: 'Makati City, Philippines',  phone_number: '+63 915 678 9012', career_status: 'ACTIVELY_LOOKING',       skills: ['Kali Linux','Metasploit','Burp Suite','OSCP','Python'],                               languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'National University Manila',          field_of_study:'Cybersecurity',             start_year:2014, end_year:2018}, experience: {company_name:'Trend Micro Philippines',   position:'Security Analyst',          start_date:new Date('2018-08-01'), is_current:false, end_date:new Date('2022-07-31')} },
  { first_name: 'Bianca',    last_name: 'Herrera',     email: 'bianca.herrera@gmail.com',   age: 25, gender: 'Female', desired_position: 'Copywriter',                location: 'Cebu City, Philippines',    phone_number: '+63 910 234 5670', career_status: 'ACTIVELY_LOOKING',       skills: ['Copywriting','SEO Writing','Content Strategy','Blogging','Social Media Copy'],        languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'},{language_name:'French',proficiency_level:'BASIC'}],   education: {institution_name:'University of San Jose - Recoletos',  field_of_study:'Communication Arts',        start_year:2017, end_year:2021}, experience: {company_name:'Sitel Philippines',          position:'Content Writer',            start_date:new Date('2021-07-01'), is_current:true,  end_date:null} },
  { first_name: 'Arvin',     last_name: 'Dela Torre',  email: 'arvin.delatorre@gmail.com',  age: 32, gender: 'Male',   desired_position: 'Data Engineer',             location: 'Taguig City, Philippines',  phone_number: '+63 929 345 6781', career_status: 'EMPLOYED_NOT_LOOKING',   skills: ['Apache Spark','Airflow','dbt','BigQuery','Python'],                                   languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'Ateneo de Manila University',         field_of_study:'Computer Science',          start_year:2009, end_year:2013}, experience: {company_name:'Lazada Philippines',         position:'Senior Data Engineer',      start_date:new Date('2019-04-01'), is_current:true,  end_date:null} },
  { first_name: 'Sheila',    last_name: 'Magno',       email: 'sheila.magno@gmail.com',     age: 27, gender: 'Female', desired_position: 'Customer Success Manager',  location: 'Quezon City, Philippines',  phone_number: '+63 928 456 7892', career_status: 'ACTIVELY_LOOKING',       skills: ['Account Management','CRM','Onboarding','Customer Retention','Communication'],         languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'University of the East',              field_of_study:'Business Administration',   start_year:2015, end_year:2019}, experience: {company_name:'Kalibrr',                   position:'Customer Success Associate',start_date:new Date('2019-11-01'), is_current:true,  end_date:null} },
  { first_name: 'Erwin',     last_name: 'Castro',      email: 'erwin.castro@gmail.com',     age: 30, gender: 'Male',   desired_position: 'Financial Analyst',         location: 'Makati City, Philippines',  phone_number: '+63 911 567 8903', career_status: 'OPEN_TO_OPPORTUNITIES',  skills: ['Financial Modeling','Excel','PowerBI','Variance Analysis','Bloomberg'],               languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'Ateneo de Manila University',         field_of_study:'Management Engineering',    start_year:2012, end_year:2016}, experience: {company_name:'BDO Unibank',                position:'Financial Analyst',          start_date:new Date('2016-07-01'), is_current:false, end_date:new Date('2021-12-31')} },
  { first_name: 'Hazel',     last_name: 'Navarro',     email: 'hazel.navarro@gmail.com',    age: 26, gender: 'Female', desired_position: 'Digital Marketing Specialist', location: 'Cebu City, Philippines',  phone_number: '+63 927 678 9014', career_status: 'ACTIVELY_LOOKING',       skills: ['Google Ads','Meta Ads','SEO','Email Marketing','Analytics'],                          languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'University of Cebu',                  field_of_study:'Marketing',                 start_year:2016, end_year:2020}, experience: {company_name:'iManila',                   position:'Digital Marketing Specialist',start_date:new Date('2020-07-01'), is_current:true,  end_date:null} },
  { first_name: 'Mark',      last_name: 'Soriano',     email: 'mark.soriano@gmail.com',     age: 29, gender: 'Male',   desired_position: 'Mobile Engineer (React Native)', location: 'Taguig City, Philippines', phone_number: '+63 926 789 0125', career_status: 'ACTIVELY_LOOKING',      skills: ['React Native','TypeScript','Redux','REST APIs','Jest'],                               languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'FEU Tech',                            field_of_study:'Computer Science',          start_year:2013, end_year:2017}, experience: {company_name:'Paymongo',                  position:'Mobile Developer',          start_date:new Date('2021-03-01'), is_current:true,  end_date:null} },
  { first_name: 'Gina',      last_name: 'Pascual',     email: 'gina.pascual@gmail.com',     age: 28, gender: 'Female', desired_position: 'Compliance Officer',        location: 'Taguig City, Philippines',  phone_number: '+63 925 890 1236', career_status: 'OPEN_TO_OPPORTUNITIES',  skills: ['AML','KYC','BSP Regulations','Policy Writing','Internal Audit'],                      languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'San Beda University',                 field_of_study:'Law',                       start_year:2014, end_year:2019}, experience: {company_name:'Metrobank',                  position:'Compliance Analyst',        start_date:new Date('2019-06-01'), is_current:true,  end_date:null} },
  { first_name: 'Benedict',  last_name: 'Ong',         email: 'benedict.ong@gmail.com',     age: 25, gender: 'Male',   desired_position: 'Frontend Engineer',         location: 'Cebu City, Philippines',    phone_number: '+63 924 901 2347', career_status: 'ACTIVELY_LOOKING',       skills: ['React','Next.js','TypeScript','Tailwind CSS','Storybook'],                            languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'University of San Carlos',            field_of_study:'Computer Science',          start_year:2018, end_year:2022}, experience: {company_name:'SureSmart PH',               position:'Frontend Developer',        start_date:new Date('2022-08-01'), is_current:true,  end_date:null} },
  { first_name: 'Irene',     last_name: 'Diaz',        email: 'irene.diaz@gmail.com',       age: 27, gender: 'Female', desired_position: 'Video Producer',            location: 'Cebu City, Philippines',    phone_number: '+63 923 012 3458', career_status: 'ACTIVELY_LOOKING',       skills: ['Premiere Pro','After Effects','DaVinci Resolve','Cinematography','Color Grading'],    languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'CIIT Philippines',                    field_of_study:'Film and Broadcast Arts',   start_year:2015, end_year:2019}, experience: {company_name:'ABS-CBN Regional',           position:'Video Editor',              start_date:new Date('2019-06-01'), is_current:false, end_date:new Date('2023-01-31')} },
  { first_name: 'Aldrin',    last_name: 'Tolentino',   email: 'aldrin.tolentino@gmail.com', age: 31, gender: 'Male',   desired_position: 'Security Operations Analyst', location: 'Makati City, Philippines', phone_number: '+63 918 123 4569', career_status: 'EMPLOYED_NOT_LOOKING',   skills: ['Splunk','QRadar','Incident Response','MITRE ATT&CK','Threat Hunting'],               languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'Pamantasan ng Lungsod ng Maynila',    field_of_study:'Computer Engineering',      start_year:2011, end_year:2015}, experience: {company_name:'Palo Alto Networks PH',     position:'SOC Analyst',               start_date:new Date('2018-01-01'), is_current:true,  end_date:null} },
  { first_name: 'Lourdes',   last_name: 'Cabrera',     email: 'lourdes.cabrera@gmail.com',  age: 29, gender: 'Female', desired_position: 'Growth Marketing Manager',  location: 'Quezon City, Philippines',  phone_number: '+63 934 234 5680', career_status: 'ACTIVELY_LOOKING',       skills: ['Growth Hacking','CRO','Email Marketing','SEM','Analytics'],                          languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'UP Diliman',                          field_of_study:'Communication',             start_year:2013, end_year:2017}, experience: {company_name:'Zalora Philippines',         position:'Marketing Manager',         start_date:new Date('2020-03-01'), is_current:true,  end_date:null} },
  { first_name: 'Oscar',     last_name: 'Ferrer',      email: 'oscar.ferrer@gmail.com',     age: 26, gender: 'Male',   desired_position: 'iOS Developer',             location: 'Quezon City, Philippines',  phone_number: '+63 935 345 6791', career_status: 'ACTIVELY_LOOKING',       skills: ['Swift','SwiftUI','Xcode','Core Data','REST APIs'],                                    languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'Mapua University',                    field_of_study:'Computer Science',          start_year:2016, end_year:2020}, experience: {company_name:'Ayala Land',                 position:'Junior iOS Developer',      start_date:new Date('2020-10-01'), is_current:true,  end_date:null} },
  { first_name: 'Yvonne',    last_name: 'Espiritu',    email: 'yvonne.espiritu@gmail.com',  age: 30, gender: 'Female', desired_position: 'Project Manager',           location: 'Taguig City, Philippines',  phone_number: '+63 936 456 7802', career_status: 'OPEN_TO_OPPORTUNITIES',  skills: ['PMP','MS Project','Risk Management','Agile','Scrum'],                                 languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'Ateneo de Manila University',         field_of_study:'Industrial Engineering',    start_year:2012, end_year:2016}, experience: {company_name:'Accenture Philippines',     position:'Project Manager',           start_date:new Date('2019-09-01'), is_current:true,  end_date:null} },
  { first_name: 'Rodel',     last_name: 'Aguilar',     email: 'rodel.aguilar@gmail.com',    age: 33, gender: 'Male',   desired_position: 'BIM Engineer',              location: 'Makati City, Philippines',  phone_number: '+63 937 567 8913', career_status: 'ACTIVELY_LOOKING',       skills: ['Autodesk Revit','Navisworks','AutoCAD','BIM 360','Clash Detection'],                  languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'Mapua University',                    field_of_study:'Civil Engineering',         start_year:2009, end_year:2013}, experience: {company_name:'DMCI Homes',                 position:'BIM Coordinator',           start_date:new Date('2016-04-01'), is_current:false, end_date:new Date('2023-06-30')} },
  { first_name: 'Kristine',  last_name: 'Villarin',    email: 'kristine.villarin@gmail.com', age: 24, gender: 'Female', desired_position: 'Instructional Designer',   location: 'Quezon City, Philippines',  phone_number: '+63 938 678 9024', career_status: 'ACTIVELY_LOOKING',       skills: ['Articulate Storyline','Moodle','Course Design','LMS','Adobe Captivate'],              languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'Philippine Normal University',        field_of_study:'Education Technology',      start_year:2018, end_year:2022}, experience: {company_name:'Courseworks PH',             position:'Junior Instructional Designer',start_date:new Date('2022-07-01'), is_current:true, end_date:null} },
  { first_name: 'Emmanuel',  last_name: 'Aquino',      email: 'emmanuel.aquino@gmail.com',  age: 28, gender: 'Male',   desired_position: 'Operations Analyst',        location: 'Cebu City, Philippines',    phone_number: '+63 939 789 0135', career_status: 'ACTIVELY_LOOKING',       skills: ['Process Improvement','SQL','Excel','Logistics','Data Reporting'],                     languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'University of San Carlos',            field_of_study:'Industrial Engineering',    start_year:2014, end_year:2018}, experience: {company_name:'LBC Express',                position:'Operations Analyst',        start_date:new Date('2018-08-01'), is_current:true,  end_date:null} },
  { first_name: 'Luisa',     last_name: 'Reyes',       email: 'luisa.reyes@gmail.com',      age: 26, gender: 'Female', desired_position: 'Social Media Manager',      location: 'Cebu City, Philippines',    phone_number: '+63 940 890 1246', career_status: 'ACTIVELY_LOOKING',       skills: ['Social Media Strategy','Canva','Content Planning','Community Management','Analytics'], languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'University of San Jose - Recoletos',  field_of_study:'Mass Communication',        start_year:2016, end_year:2020}, experience: {company_name:'Smart Communications',      position:'Social Media Specialist',   start_date:new Date('2020-09-01'), is_current:true,  end_date:null} },
  { first_name: 'Kenneth',   last_name: 'Jimenez',     email: 'kenneth.jimenez@gmail.com',  age: 29, gender: 'Male',   desired_position: 'Cloud Security Engineer',   location: 'Makati City, Philippines',  phone_number: '+63 941 901 2357', career_status: 'EMPLOYED_NOT_LOOKING',   skills: ['AWS Security','IAM','GuardDuty','Terraform','CSPM'],                                  languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'Adamson University',                  field_of_study:'Computer Science',          start_year:2013, end_year:2017}, experience: {company_name:'Globe Telecom',              position:'Cloud Security Engineer',   start_date:new Date('2020-02-01'), is_current:true,  end_date:null} },
  { first_name: 'Rowena',    last_name: 'Baltazar',    email: 'rowena.baltazar@gmail.com',  age: 27, gender: 'Female', desired_position: 'Product Analyst',           location: 'Mandaluyong, Philippines',  phone_number: '+63 942 012 3468', career_status: 'OPEN_TO_OPPORTUNITIES',  skills: ['Product Analytics','Mixpanel','SQL','A/B Testing','Google Analytics'],               languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'Ateneo de Davao University',          field_of_study:'Information Systems',       start_year:2015, end_year:2019}, experience: {company_name:'Grab Philippines',           position:'Product Analyst',           start_date:new Date('2019-08-01'), is_current:true,  end_date:null} },
  { first_name: 'Alfredo',   last_name: 'Pineda',      email: 'alfredo.pineda@gmail.com',   age: 35, gender: 'Male',   desired_position: 'Creative Director',         location: 'Cebu City, Philippines',    phone_number: '+63 943 123 4579', career_status: 'EMPLOYED_NOT_LOOKING',   skills: ['Creative Direction','Brand Development','Team Leadership','Figma','Adobe Creative Suite'], languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                education: {institution_name:'CIIT Philippines',                    field_of_study:'Graphic Design',            start_year:2006, end_year:2010}, experience: {company_name:'McCann Worldgroup Philippines', position:'Creative Director',       start_date:new Date('2018-06-01'), is_current:true, end_date:null} },
  { first_name: 'Theresa',   last_name: 'Gomez',       email: 'theresa.gomez@gmail.com',    age: 25, gender: 'Female', desired_position: 'Healthcare IT Specialist',  location: 'Mandaluyong, Philippines',  phone_number: '+63 944 234 5690', career_status: 'ACTIVELY_LOOKING',       skills: ['IT Support','EHR Systems','Networking','Windows Server','Troubleshooting'],           languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'AMA Computer University',             field_of_study:'Information Technology',    start_year:2018, end_year:2022}, experience: {company_name:'St. Luke\'s Medical Center',  position:'IT Support Specialist', start_date:new Date('2022-07-01'), is_current:true, end_date:null} },
  { first_name: 'Victor',    last_name: 'Domingo',     email: 'victor.domingo@gmail.com',   age: 30, gender: 'Male',   desired_position: 'E-Commerce Manager',        location: 'Taguig City, Philippines',  phone_number: '+63 945 345 6801', career_status: 'ACTIVELY_LOOKING',       skills: ['Shopify','WooCommerce','Google Analytics','Facebook Ads','CRO'],                      languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'De La Salle University',              field_of_study:'Marketing',                 start_year:2012, end_year:2016}, experience: {company_name:'Rustan\'s',                  position:'E-Commerce Specialist',     start_date:new Date('2019-03-01'), is_current:true,  end_date:null} },
  { first_name: 'Corazon',   last_name: 'Miranda',     email: 'corazon.miranda@gmail.com',  age: 28, gender: 'Female', desired_position: 'Sustainability Consultant', location: 'Makati City, Philippines',  phone_number: '+63 946 456 7812', career_status: 'ACTIVELY_LOOKING',       skills: ['LEED','BERDE','Environmental Assessment','Green Building','Sustainability Reporting'], languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'},{language_name:'German',proficiency_level:'BASIC'}],    education: {institution_name:'UP Diliman',                          field_of_study:'Environmental Science',     start_year:2014, end_year:2018}, experience: {company_name:'AECOM Philippines',          position:'Sustainability Analyst',    start_date:new Date('2018-10-01'), is_current:true,  end_date:null} },
  { first_name: 'Dennis',    last_name: 'Velarde',     email: 'dennis.velarde@gmail.com',   age: 26, gender: 'Male',   desired_position: 'Android Developer',         location: 'Cebu City, Philippines',    phone_number: '+63 947 567 8923', career_status: 'ACTIVELY_LOOKING',       skills: ['Kotlin','Jetpack Compose','MVVM','Retrofit','Firebase'],                              languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'CIT University',                      field_of_study:'Computer Engineering',      start_year:2016, end_year:2020}, experience: {company_name:'Exist Software Labs',       position:'Android Developer',         start_date:new Date('2020-08-01'), is_current:true,  end_date:null} },
  { first_name: 'Marisol',   last_name: 'Fuentes',     email: 'marisol.fuentes@gmail.com',  age: 29, gender: 'Female', desired_position: 'Risk Analyst',              location: 'Taguig City, Philippines',  phone_number: '+63 948 678 9034', career_status: 'OPEN_TO_OPPORTUNITIES',  skills: ['Risk Assessment','Basel III','VaR','SQL','Excel'],                                    languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'Ateneo de Manila University',         field_of_study:'Mathematics',               start_year:2013, end_year:2017}, experience: {company_name:'BPI',                        position:'Risk Management Analyst',   start_date:new Date('2017-07-01'), is_current:true,  end_date:null} },
  { first_name: 'Arnold',    last_name: 'Padilla',     email: 'arnold.padilla@gmail.com',   age: 31, gender: 'Male',   desired_position: 'Full Stack Developer',      location: 'Mandaluyong, Philippines',  phone_number: '+63 949 789 0145', career_status: 'ACTIVELY_LOOKING',       skills: ['React','Node.js','PostgreSQL','Docker','GraphQL'],                                    languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'PLM Manila',                          field_of_study:'Computer Science',          start_year:2010, end_year:2014}, experience: {company_name:'Thinking Machines Data Science', position:'Full Stack Developer', start_date:new Date('2018-05-01'), is_current:false, end_date:new Date('2023-03-31')} },
  { first_name: 'Rowena',    last_name: 'Dela Fuente', email: 'rowena.delafuente@gmail.com', age: 26, gender: 'Female', desired_position: 'Podcast Producer',         location: 'Cebu City, Philippines',    phone_number: '+63 950 890 1256', career_status: 'ACTIVELY_LOOKING',       skills: ['Adobe Audition','Podcast Editing','Scriptwriting','Guest Booking','RSS Management'],   languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'University of the Visayas',           field_of_study:'Communication Arts',        start_year:2016, end_year:2020}, experience: {company_name:'Radyo Mo Network',           position:'Radio Producer',            start_date:new Date('2020-06-01'), is_current:true,  end_date:null} },
  { first_name: 'Florencio', last_name: 'Ibarra',      email: 'florencio.ibarra@gmail.com', age: 32, gender: 'Male',   desired_position: 'Software Engineer (.NET)',  location: 'Taguig City, Philippines',  phone_number: '+63 951 901 2367', career_status: 'EMPLOYED_NOT_LOOKING',   skills: ['.NET','C#','SQL Server','Entity Framework','Azure'],                                  languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'Mapua University',                    field_of_study:'Information Technology',    start_year:2010, end_year:2014}, experience: {company_name:'Mynt (GCash)',               position:'Senior .NET Developer',     start_date:new Date('2019-07-01'), is_current:true,  end_date:null} },
  { first_name: 'Gemma',     last_name: 'Ocampo',      email: 'gemma.ocampo@gmail.com',     age: 27, gender: 'Female', desired_position: 'Business Development Manager', location: 'Cebu City, Philippines',  phone_number: '+63 952 012 3478', career_status: 'ACTIVELY_LOOKING',       skills: ['B2B Sales','Cold Outreach','CRM','Negotiation','Logistics'],                          languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'University of San Carlos',            field_of_study:'Business Administration',   start_year:2015, end_year:2019}, experience: {company_name:'2GO Group',                  position:'Business Development Associate', start_date:new Date('2019-09-01'), is_current:true, end_date:null} },
  { first_name: 'Marcos',    last_name: 'Beltran',     email: 'marcos.beltran@gmail.com',   age: 24, gender: 'Male',   desired_position: 'Support Engineer',          location: 'Taguig City, Philippines',  phone_number: '+63 953 123 4589', career_status: 'ACTIVELY_LOOKING',       skills: ['Technical Support','SQL','API Debugging','Zendesk','Linux'],                          languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'FEU Tech',                            field_of_study:'Information Technology',    start_year:2019, end_year:2023}, experience: {company_name:'Globe Business',             position:'Technical Support Analyst', start_date:new Date('2023-04-01'), is_current:true,  end_date:null} },
  { first_name: 'Nathalie',  last_name: 'Marquez',     email: 'nathalie.marquez@gmail.com', age: 25, gender: 'Female', desired_position: 'ISO 27001 Compliance Consultant', location: 'Makati City, Philippines', phone_number: '+63 954 234 5690', career_status: 'ACTIVELY_LOOKING',   skills: ['ISO 27001','ISMS','Gap Assessment','Risk Register','Policy Writing'],                languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'De La Salle University',              field_of_study:'Information Systems',       start_year:2018, end_year:2022}, experience: {company_name:'PwC Philippines',            position:'IT Risk and Compliance Analyst', start_date:new Date('2022-07-01'), is_current:true, end_date:null} },
  { first_name: 'Roderick',  last_name: 'Bañares',     email: 'roderick.banares@gmail.com', age: 34, gender: 'Male',   desired_position: 'Backend Engineer (Fintech)', location: 'Taguig City, Philippines',  phone_number: '+63 955 345 6801', career_status: 'ACTIVELY_LOOKING',       skills: ['Java','Spring Boot','Kafka','PostgreSQL','Payment Systems'],                          languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'De La Salle University',              field_of_study:'Computer Science',          start_year:2008, end_year:2012}, experience: {company_name:'PayMaya Philippines',        position:'Senior Backend Engineer',   start_date:new Date('2017-05-01'), is_current:false, end_date:new Date('2023-05-31')} },
  { first_name: 'Melissa',   last_name: 'Cagayan',     email: 'melissa.cagayan@gmail.com',  age: 28, gender: 'Female', desired_position: 'UX Designer',               location: 'Cebu City, Philippines',    phone_number: '+63 956 456 7812', career_status: 'OPEN_TO_OPPORTUNITIES',  skills: ['Figma','Prototyping','Usability Testing','Design Systems','Sketch'],                 languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'University of San Carlos',            field_of_study:'Computer Science',          start_year:2014, end_year:2018}, experience: {company_name:'Exist Software Labs',       position:'UX Designer',               start_date:new Date('2018-09-01'), is_current:true,  end_date:null} },
  { first_name: 'Lorenzo',   last_name: 'Sta. Maria',  email: 'lorenzo.stamaria@gmail.com', age: 27, gender: 'Male',   desired_position: 'Security Awareness Trainer', location: 'Makati City, Philippines',  phone_number: '+63 957 567 8923', career_status: 'ACTIVELY_LOOKING',       skills: ['Cybersecurity Training','Phishing Simulation','Public Speaking','LMS','Content Design'], languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                  education: {institution_name:'National University Manila',          field_of_study:'Cybersecurity',             start_year:2015, end_year:2019}, experience: {company_name:'Cyberspace PH',              position:'Cybersecurity Educator',    start_date:new Date('2019-10-01'), is_current:true,  end_date:null} },
  { first_name: 'Kathleen',  last_name: 'Reyes',       email: 'kathleen.reyes@gmail.com',   age: 28, gender: 'Female', desired_position: 'BI Developer',              location: 'Taguig City, Philippines',  phone_number: '+63 958 678 9034', career_status: 'ACTIVELY_LOOKING',       skills: ['Power BI','DAX','SQL','Azure Synapse','Data Modeling'],                               languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'De La Salle University',              field_of_study:'Information Technology',    start_year:2014, end_year:2018}, experience: {company_name:'Accenture Philippines',     position:'BI Analyst',                start_date:new Date('2018-10-01'), is_current:true,  end_date:null} },
  { first_name: 'Renaldo',   last_name: 'Corpus',      email: 'renaldo.corpus@gmail.com',   age: 30, gender: 'Male',   desired_position: 'Supply Chain Analyst',      location: 'Cebu City, Philippines',    phone_number: '+63 959 789 0145', career_status: 'OPEN_TO_OPPORTUNITIES',  skills: ['SAP MM','ERP','Inventory Management','Procurement','Excel'],                          languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'}],                                                    education: {institution_name:'University of San Carlos',            field_of_study:'Industrial Engineering',    start_year:2012, end_year:2016}, experience: {company_name:'Jollibee Foods Corporation', position:'Supply Chain Coordinator', start_date:new Date('2016-07-01'), is_current:true, end_date:null} },
  { first_name: 'Margarita', last_name: 'Tolentino',   email: 'margarita.tolentino@gmail.com', age: 26, gender: 'Female', desired_position: 'Content Strategist',    location: 'Quezon City, Philippines',  phone_number: '+63 960 890 1256', career_status: 'ACTIVELY_LOOKING',       skills: ['Content Strategy','SEO','Editorial Planning','Analytics','WordPress'],                languages: [{language_name:'Filipino',proficiency_level:'NATIVE'},{language_name:'English',proficiency_level:'FLUENT'},{language_name:'Spanish',proficiency_level:'BASIC'}],   education: {institution_name:'UP Diliman',                          field_of_study:'Journalism',                start_year:2017, end_year:2021}, experience: {company_name:'Rappler',                   position:'Content Editor',            start_date:new Date('2021-08-01'), is_current:true,  end_date:null} },
];

type AppStatus = 'NEW' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'HIRED' | 'CANCELLED';

interface AppTemplate {
  applicantIdx: number;
  jobCompanyIdx: number;
  jobIdx: number;
  status: AppStatus;
  days_ago: number;
}

// 50 applications spread across applicants and jobs with varied statuses
const APPLICATION_DATA: AppTemplate[] = [
  { applicantIdx: 0,  jobCompanyIdx: 0, jobIdx: 0, status: 'INTERVIEW',  days_ago: 30 },
  { applicantIdx: 0,  jobCompanyIdx: 0, jobIdx: 1, status: 'SCREENING',  days_ago: 20 },
  { applicantIdx: 1,  jobCompanyIdx: 1, jobIdx: 0, status: 'OFFER',      days_ago: 25 },
  { applicantIdx: 2,  jobCompanyIdx: 0, jobIdx: 1, status: 'NEW',        days_ago: 5  },
  { applicantIdx: 2,  jobCompanyIdx: 2, jobIdx: 0, status: 'SCREENING',  days_ago: 18 },
  { applicantIdx: 3,  jobCompanyIdx: 2, jobIdx: 0, status: 'REJECTED',   days_ago: 45 },
  { applicantIdx: 4,  jobCompanyIdx: 1, jobIdx: 0, status: 'HIRED',      days_ago: 60 },
  { applicantIdx: 5,  jobCompanyIdx: 0, jobIdx: 2, status: 'INTERVIEW',  days_ago: 15 },
  { applicantIdx: 6,  jobCompanyIdx: 2, jobIdx: 0, status: 'SCREENING',  days_ago: 10 },
  { applicantIdx: 7,  jobCompanyIdx: 3, jobIdx: 2, status: 'NEW',        days_ago: 3  },
  { applicantIdx: 8,  jobCompanyIdx: 3, jobIdx: 4, status: 'OFFER',      days_ago: 22 },
  { applicantIdx: 9,  jobCompanyIdx: 1, jobIdx: 2, status: 'INTERVIEW',  days_ago: 12 },
  { applicantIdx: 10, jobCompanyIdx: 0, jobIdx: 3, status: 'NEW',        days_ago: 2  },
  { applicantIdx: 11, jobCompanyIdx: 7, jobIdx: 3, status: 'SCREENING',  days_ago: 8  },
  { applicantIdx: 12, jobCompanyIdx: 9, jobIdx: 0, status: 'INTERVIEW',  days_ago: 14 },
  { applicantIdx: 13, jobCompanyIdx: 1, jobIdx: 1, status: 'HIRED',      days_ago: 55 },
  { applicantIdx: 14, jobCompanyIdx: 6, jobIdx: 1, status: 'NEW',        days_ago: 4  },
  { applicantIdx: 15, jobCompanyIdx: 4, jobIdx: 3, status: 'SCREENING',  days_ago: 9  },
  { applicantIdx: 16, jobCompanyIdx: 7, jobIdx: 4, status: 'INTERVIEW',  days_ago: 17 },
  { applicantIdx: 17, jobCompanyIdx: 9, jobIdx: 1, status: 'REJECTED',   days_ago: 35 },
  { applicantIdx: 18, jobCompanyIdx: 2, jobIdx: 3, status: 'NEW',        days_ago: 1  },
  { applicantIdx: 19, jobCompanyIdx: 4, jobIdx: 1, status: 'SCREENING',  days_ago: 11 },
  { applicantIdx: 20, jobCompanyIdx: 0, jobIdx: 4, status: 'INTERVIEW',  days_ago: 19 },
  { applicantIdx: 21, jobCompanyIdx: 8, jobIdx: 0, status: 'NEW',        days_ago: 6  },
  { applicantIdx: 22, jobCompanyIdx: 9, jobIdx: 2, status: 'OFFER',      days_ago: 28 },
  { applicantIdx: 23, jobCompanyIdx: 4, jobIdx: 0, status: 'SCREENING',  days_ago: 13 },
  { applicantIdx: 24, jobCompanyIdx: 4, jobIdx: 4, status: 'HIRED',      days_ago: 50 },
  { applicantIdx: 25, jobCompanyIdx: 6, jobIdx: 0, status: 'NEW',        days_ago: 7  },
  { applicantIdx: 26, jobCompanyIdx: 8, jobIdx: 2, status: 'INTERVIEW',  days_ago: 21 },
  { applicantIdx: 27, jobCompanyIdx: 7, jobIdx: 0, status: 'REJECTED',   days_ago: 40 },
  { applicantIdx: 28, jobCompanyIdx: 5, jobIdx: 0, status: 'SCREENING',  days_ago: 16 },
  { applicantIdx: 29, jobCompanyIdx: 8, jobIdx: 3, status: 'NEW',        days_ago: 4  },
  { applicantIdx: 30, jobCompanyIdx: 6, jobIdx: 2, status: 'OFFER',      days_ago: 33 },
  { applicantIdx: 31, jobCompanyIdx: 5, jobIdx: 2, status: 'INTERVIEW',  days_ago: 24 },
  { applicantIdx: 32, jobCompanyIdx: 9, jobIdx: 3, status: 'SCREENING',  days_ago: 10 },
  { applicantIdx: 33, jobCompanyIdx: 3, jobIdx: 0, status: 'NEW',        days_ago: 2  },
  { applicantIdx: 34, jobCompanyIdx: 5, jobIdx: 3, status: 'HIRED',      days_ago: 48 },
  { applicantIdx: 35, jobCompanyIdx: 2, jobIdx: 4, status: 'INTERVIEW',  days_ago: 27 },
  { applicantIdx: 36, jobCompanyIdx: 6, jobIdx: 3, status: 'SCREENING',  days_ago: 9  },
  { applicantIdx: 37, jobCompanyIdx: 7, jobIdx: 2, status: 'NEW',        days_ago: 3  },
  { applicantIdx: 38, jobCompanyIdx: 9, jobIdx: 4, status: 'INTERVIEW',  days_ago: 15 },
  { applicantIdx: 39, jobCompanyIdx: 1, jobIdx: 3, status: 'REJECTED',   days_ago: 38 },
  { applicantIdx: 40, jobCompanyIdx: 3, jobIdx: 1, status: 'SCREENING',  days_ago: 12 },
  { applicantIdx: 41, jobCompanyIdx: 8, jobIdx: 1, status: 'NEW',        days_ago: 5  },
  { applicantIdx: 42, jobCompanyIdx: 5, jobIdx: 1, status: 'OFFER',      days_ago: 29 },
  { applicantIdx: 43, jobCompanyIdx: 0, jobIdx: 2, status: 'INTERVIEW',  days_ago: 22 },
  { applicantIdx: 44, jobCompanyIdx: 2, jobIdx: 1, status: 'CANCELLED',  days_ago: 42 },
  { applicantIdx: 45, jobCompanyIdx: 4, jobIdx: 2, status: 'SCREENING',  days_ago: 8  },
  { applicantIdx: 46, jobCompanyIdx: 6, jobIdx: 4, status: 'NEW',        days_ago: 1  },
  { applicantIdx: 47, jobCompanyIdx: 3, jobIdx: 3, status: 'HIRED',      days_ago: 52 },
  { applicantIdx: 48, jobCompanyIdx: 5, jobIdx: 4, status: 'SCREENING',  days_ago: 7  },
  { applicantIdx: 49, jobCompanyIdx: 8, jobIdx: 4, status: 'NEW',        days_ago: 2  },
];

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────

async function cleanup() {
  console.log('Cleaning up...');
  await prisma.applicant_applied_job.deleteMany();
  await prisma.applicant_skill.deleteMany();
  await prisma.applicant_language.deleteMany();
  await prisma.applicant_experience.deleteMany();
  await prisma.applicant_education.deleteMany();
  await prisma.applicant_career_status.deleteMany();
  await prisma.applicant_resume.deleteMany();
  await prisma.applicant_profile.deleteMany();
  await prisma.company_admin_profile_picture.deleteMany();
  await prisma.company_admin.deleteMany();
  await prisma.company_social_link.deleteMany();
  await prisma.company_contact.deleteMany();
  await prisma.company_location.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company_information.deleteMany();
  await prisma.refresh_token.deleteMany();
  await prisma.auth_code.deleteMany();
  await prisma.user.deleteMany();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await cleanup();

  const DEFAULT_PASSWORD_HASH = await hash('Test@1234');
  const ADMIN_PASSWORD_HASH   = await hash('Admin@1234');

  // ── Admin user ───────────────────────────────────────────────────────────────

  console.log('Seeding admin...');
  await prisma.user.create({
    data: {
      email: 'admin@bayaw.com',
      first_name: 'Super',
      last_name: 'Admin',
      password: ADMIN_PASSWORD_HASH,
      role: 'ADMIN',
      status: 'ACTIVE',
      email_verified: true,
      email_verified_at: new Date(),
    },
  });

  // ── Company owners (10) ──────────────────────────────────────────────────────

  console.log('Seeding companies and jobs...');
  const companyUsers = await Promise.all(
    COMPANY_DATA.map((c) =>
      prisma.user.create({
        data: {
          email: c.owner.email,
          first_name: c.owner.first_name,
          last_name: c.owner.last_name,
          password: DEFAULT_PASSWORD_HASH,
          role: 'USER',
          status: 'ACTIVE',
          email_verified: true,
          email_verified_at: new Date(),
        },
      })
    )
  );

  // ── Companies, admins, and jobs ──────────────────────────────────────────────

  const allJobs: { id: string }[][] = [];

  for (let i = 0; i < COMPANY_DATA.length; i++) {
    const cData = COMPANY_DATA[i]!;
    const user = companyUsers[i]!;
    const jobTemplates = JOB_DATA[i]!;

    const company = await prisma.company_information.create({
      data: {
        user_id: user.id,
        ...cData.info,
        companyContacts:    { create: cData.contact },
        companySocialLinks: { create: cData.socials },
        companyLocations:   { create: cData.hq },
      },
    });

    await prisma.company_admin.create({
      data: {
        company_id: company.id,
        user_id: user.id,
        role: 'COMPANY_OWNER',
        position: 'CEO',
        can_create: true,
        can_read: true,
        can_update: true,
        can_delete: true,
      },
    });

    const jobs = await Promise.all(
      jobTemplates.map((j) =>
        prisma.job.create({ data: { company_id: company.id, ...j } })
      )
    );

    allJobs.push(jobs.map((j) => ({ id: j.id })));
  }

  // ── Applicants (50) ──────────────────────────────────────────────────────────

  console.log('Seeding applicants...');
  const applicantUsers = await Promise.all(
    APPLICANTS.map((a) =>
      prisma.user.create({
        data: {
          email: a.email,
          first_name: a.first_name,
          last_name: a.last_name,
          password: DEFAULT_PASSWORD_HASH,
          role: 'USER',
          status: 'ACTIVE',
          email_verified: true,
          email_verified_at: new Date(),
        },
      })
    )
  );

  const profiles = await Promise.all(
    APPLICANTS.map((a, idx) =>
      prisma.applicant_profile.create({
        data: {
          user_id: applicantUsers[idx]!.id,
          age: a.age,
          gender: a.gender,
          desired_position: a.desired_position,
          location: a.location,
          phone_number: a.phone_number,
          applicantEducations:    { create: a.education },
          applicantExperiences:   { create: a.experience },
          applicantSkills:        { create: a.skills.map((s) => ({ skill_name: s })) },
          applicantLanguages:     { create: a.languages },
          applicantCareerStatuses: { create: { status: a.career_status } },
        },
      })
    )
  );

  // ── Applications (50) ────────────────────────────────────────────────────────

  console.log('Seeding applications...');
  await Promise.all(
    APPLICATION_DATA.map((app) => {
      const profile = profiles[app.applicantIdx]!;
      const jobId   = allJobs[app.jobCompanyIdx]![app.jobIdx]!.id;
      return prisma.applicant_applied_job.create({
        data: {
          applicant_profile_id: profile.id,
          job_id: jobId,
          jobId,
          status: app.status,
          application_date: daysAgo(app.days_ago),
        },
      });
    })
  );

  console.log('\n✓ Seed completed!');
  console.log('\nCredentials (all use the same password per role):');
  console.log('  Admin:      admin@bayaw.com  / Admin@1234');
  console.log('  Companies:  owner@<company>.com  / Test@1234');
  console.log('  Applicants: <name>@gmail.com  / Test@1234');
  console.log('\nCounts: 1 admin, 10 companies, 50 jobs, 50 applicants, 50 applications');
}

main()
  .catch((e) => { console.error('Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
