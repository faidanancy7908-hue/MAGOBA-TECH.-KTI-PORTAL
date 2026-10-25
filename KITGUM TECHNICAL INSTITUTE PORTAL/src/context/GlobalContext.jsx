import React, { createContext, useState, useContext, useEffect } from 'react';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

// Initial Mock Data (used if localStorage is empty)
const INITIAL_DATA = {
  users: [
    { id: 1, username: 'admin', password: 'password', role: 'Administrator', name: 'System Admin' },
    { id: 999, username: 'faidanancy7908@gmail.com', password: 'password', role: 'Administrator', name: 'Faida Nancy', email: 'faidanancy7908@gmail.com' },
    { id: 2, username: 'registry', password: 'password', role: 'Registry', name: 'Sarah Registry' },
    { id: 3, username: 'finance', password: 'password', role: 'Finance', name: 'John Finance' },
    { id: 4, username: 'lecturer1', password: 'password', role: 'Lecturer', name: 'Eng. Okello David', lecturer_id: 1 },
    { id: 5, username: 'student1', password: 'KtiFN@2026', role: 'Student', name: 'Jane Doe', student_id: 'S001' },
    { id: 6, username: 'student2', password: 'KtiFN@2026', role: 'Student', name: 'John Smith', student_id: 'S002' },
    { id: 7, username: 'alumni1', password: 'KtiFN@2026', role: 'Alumni', name: 'Graduated George', student_id: 'S999' },
    { id: 8, username: 'student3', password: 'KtiFN@2026', role: 'Student', name: 'Alice Brown', student_id: 'S003' },
    { id: 9, username: 'guild1', password: 'password', role: 'Guild President', name: 'HE. Oola Ronald', student_id: 'S010' },
    { id: 13, username: 'principal', password: 'password', role: 'Principal', name: 'Mr. Principal' }
  ],
  students: [
    { student_id: 'S001', user_id: 5, name: 'Jane Doe', department_id: 1, email: 'jdS001students@kti.ac.ug', enrollment_date: '2025-01-10', program: 'NCES (Electrical)' },
    { student_id: 'S002', user_id: 6, name: 'John Smith', department_id: 2, email: 'jsS002students@kti.ac.ug', enrollment_date: '2025-01-15', program: 'NCBC (Building)' },
    { student_id: 'S999', user_id: 7, name: 'Graduated George', department_id: 1, email: 'ggS999students@kti.ac.ug', enrollment_date: '2021-01-10', program: 'NCES (Electrical)' },
    { student_id: 'S003', user_id: 8, name: 'Alice Brown', department_id: 4, email: 'abS003students@kti.ac.ug', enrollment_date: '2025-01-18', program: 'NCICT (ICT)' },
    { student_id: 'S010', user_id: 9, name: 'HE. Oola Ronald', department_id: 2, email: 'roS010students@kti.ac.ug', enrollment_date: '2024-02-01', program: 'NCBC (Civil & Building)' }
  ],
  departments: [
    {
      id: 1,
      name: 'Electrical & Electronic Engineering',
      code: 'DEEE',
      hod: 'Eng. Okello David',
      qualification: 'MSc. Electrical Power (Makerere), Reg. Eng.',
      contact: 'dee@kti.ac.ug | +256 772 100 201',
      studentsCount: 320,
      facultyCount: 8,
      workshopsCount: 3,
      description: 'Equipping trainees with hands-on skills in domestic & industrial wiring, solar photovoltaic installation, electrical machines, and automated control systems.',
      programs: [
        'National Certificate in Electrical Installation Systems and Maintenance (NCES - 2 Yrs)',
        'Certificate in Solar Energy & Inverter Maintenance (Short Course - 6 Mos)',
        'Diploma in Electrical Engineering (Evening/Weekend - 2 Yrs)'
      ],
      facilities: ['High Voltage & Machines Lab', 'Solar Photovoltaic Testing Rig', 'Domestic Wiring Simulator Workshop'],
      innovation: 'Smart Solar-Powered Campus Lighting & Inverter Backup Unit fabricated entirely by NCES Year 2 trainees.',
      image: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/workshop-1.jpg',
      badgeColor: 'blue'
    },
    {
      id: 2,
      name: 'Civil & Building Construction Engineering',
      code: 'DBC',
      hod: 'Eng. Akello Beatrice',
      qualification: 'BSc. Civil Engineering (KYU), Cert. Project Mgmt.',
      contact: 'dbc@kti.ac.ug | +256 772 100 202',
      studentsCount: 410,
      facultyCount: 11,
      workshopsCount: 4,
      description: 'Training master artisans in bricklaying, structural concreting, surveying, architectural drafting, plumbing, and modern carpentry & joinery.',
      programs: [
        'National Certificate in Building Construction (NCBC - 2 Yrs)',
        'National Certificate in Plumbing (NCPL - 2 Yrs)',
        'Certificate in Carpentry & Joinery (NCCJ - 2 Yrs)'
      ],
      facilities: ['Civil Concrete & Soil Testing Yard', 'Plumbing & Pipe Fabrication Workshop', 'Architectural Drafting Studio', 'Carpentry Power Mill'],
      innovation: 'Interlocking Eco-Stabilized Soil Blocks (ISSB) produced for low-cost institute staff quarter construction.',
      image: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/campus-main.jpg',
      badgeColor: 'amber'
    },
    {
      id: 3,
      name: 'Automotive & Mechanical Engineering',
      code: 'DAME',
      hod: 'Eng. Komakech Patrick',
      qualification: 'BEng. Automotive Technology, DIT Assessor',
      contact: 'dame@kti.ac.ug | +256 772 100 203',
      studentsCount: 290,
      facultyCount: 7,
      workshopsCount: 3,
      description: 'Empowering automotive mechanics in engine overhaul, transmission diagnostics, welding & fabrication, panel beating, and motorcycle mechanics.',
      programs: [
        'National Certificate in Automotive Mechanics (NCAM - 2 Yrs)',
        'National Certificate in Machining & Fitting (NCMF - 2 Yrs)',
        'Advanced Arc & Gas Welding Fabrication (Short Course - 6 Mos)'
      ],
      facilities: ['Modern Motor Vehicle Diagnostic Garage with Hydraulic Hoist', 'Precision Metal Lathe & Milling Unit', 'Shielded Metal Arc & TIG Welding Bays'],
      innovation: 'Multi-Purpose Agricultural Trailer and Maize Thresher fabricated for local farmers in Kitgum district.',
      image: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/workshop-2.jpg',
      badgeColor: 'rose'
    },
    {
      id: 4,
      name: 'Information & Communications Technology',
      code: 'DICT',
      hod: 'Mr. Denis Opio',
      qualification: 'MSc. Information Systems, Cisco Certified Network Associate',
      contact: 'dict@kti.ac.ug | +256 772 100 204',
      studentsCount: 380,
      facultyCount: 6,
      workshopsCount: 2,
      description: 'Fostering digital transformation through practical software engineering, network administration, computer hardware repair, database systems, and graphic design.',
      programs: [
        'National Certificate in Information and Communication Technology (NCICT - 2 Yrs)',
        'Certificate in Computer Maintenance & Networking (6 Mos)',
        'Digital Graphic Design & Multimedia (Short Course - 3 Mos)'
      ],
      facilities: ['2 Fully Air-Conditioned Computer Labs with 120 Workstations', 'Dedicated Fiber Optic Internet Backbone', 'Hardware & Electronics Repair Lab'],
      innovation: 'KTI Automated Biometric Workshop Attendance & SMS Alert Gateway built by ICT students.',
      image: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/lab-session.jpg',
      badgeColor: 'cyan'
    },
    {
      id: 5,
      name: 'Agriculture & Agribusiness',
      code: 'DAG',
      hod: 'Dr. Grace Atoo',
      qualification: 'PhD. Agricultural Economics & Animal Health',
      contact: 'dag@kti.ac.ug | +256 772 100 205',
      studentsCount: 260,
      facultyCount: 5,
      workshopsCount: 2,
      description: 'Modern agricultural production, post-harvest handling, drip irrigation systems, poultry farming, piggery, and commercial crop agribusiness.',
      programs: [
        'National Certificate in Agriculture (NCAG - 2 Yrs)',
        'Commercial Horticulture & Greenhouse Management (6 Mos)',
        'Livestock Management & Animal Health Support (Short Course)'
      ],
      facilities: ['5-Acre Demonstration & Research Farm', 'Smart Solar Drip Irrigation Demo', 'Piggery, Dairy & Poultry Production Units'],
      innovation: 'Gravity-Fed Solar Drip Irrigation Kit installed in Pandwong sub-county for dry-season vegetable farming.',
      image: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/students-activity.jpg',
      badgeColor: 'emerald'
    },
    {
      id: 6,
      name: 'Fashion, Garment & Textile Design',
      code: 'DFGD',
      hod: 'Ms. Harriet Lamwaka',
      qualification: 'BA. Industrial Art & Fashion Design (Kyambogo)',
      contact: 'dfgd@kti.ac.ug | +256 772 100 206',
      studentsCount: 195,
      facultyCount: 4,
      workshopsCount: 2,
      description: 'Mastering apparel pattern drafting, industrial sewing machine operation, textile embroidery, African fabric styling, and garment merchandising.',
      programs: [
        'National Certificate in Fashion and Garment Design (NCFD - 2 Yrs)',
        'Certificate in Tailoring & Dressmaking (1 Yr)',
        'Modern Computerized Embroidery & Fashion Craft (Short Course)'
      ],
      facilities: ['Industrial Electric Sewing Machine Hall (45 Machines)', 'Pattern Cutting & Mannequin Modeling Studio', 'Screen Printing & Dyeing Laboratory'],
      innovation: 'Production of all Kitgum Technical Institute workshop coats, sports jerseys, and graduation gowns.',
      image: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/exhibition.jpg',
      badgeColor: 'purple'
    },
    {
      id: 7,
      name: 'Business & Institutional Administration',
      code: 'DBIA',
      hod: 'Mr. Charles Odoki',
      qualification: 'MBA, Certified Public Accountant (CPA-U)',
      contact: 'dbia@kti.ac.ug | +256 772 100 207',
      studentsCount: 310,
      facultyCount: 6,
      workshopsCount: 2,
      description: 'Nurturing competent professionals in book-keeping, procurement & logistics, secretarial management, records automation, and entrepreneurship.',
      programs: [
        'National Certificate in Secretarial & Office Management (NCSM - 2 Yrs)',
        'National Certificate in Accounting and Finance (NCAF - 2 Yrs)',
        'Certificate in Procurement & Storekeeping (1 Yr)'
      ],
      facilities: ['Modern Mock Corporate Office & Boardroom Lab', 'Computerized Accounting Suite (Tally & QuickBooks)', 'Digital Records Management Center'],
      innovation: 'Digital Microfinance & Student Cooperative Savings System managed by trainee accountants.',
      image: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/campus-main.jpg',
      badgeColor: 'teal'
    }
  ],
  guildCabinet: [
    { title: 'Guild President', name: 'HE. Oola Ronald', department: 'NCBC (Civil Engineering)', term: '2025/2026', phone: '+256 774 219 001', quote: 'Service, Integrity, and Student Empowerment.' },
    { title: 'Vice President', name: 'Hon. Auma Fiona', department: 'NCES (Electrical)', term: '2025/2026', phone: '+256 774 219 002', quote: 'Championing Women in Technical Fields.' },
    { title: 'Prime Minister', name: 'Hon. Komakech Patrick', department: 'NCAM (Automotive)', term: '2025/2026', phone: '+256 774 219 003', quote: 'Execution and Administrative Harmony.' },
    { title: 'Minister of Academic Affairs', name: 'Hon. Lanyero Brenda', department: 'NCICT (ICT)', term: '2025/2026', phone: '+256 774 219 004', quote: 'Academic Excellence and Workshop Readiness.' },
    { title: 'Minister of Sports & Culture', name: 'Hon. Okot Brian', department: 'NCAG (Agriculture)', term: '2025/2026', phone: '+256 774 219 005', quote: 'Uniting Campuses through Athletic Brilliance.' },
    { title: 'Minister of Finance & Development', name: 'Hon. Akello Gladys', department: 'DBIA (Business)', term: '2025/2026', phone: '+256 774 219 006', quote: 'Fiscal Transparency and Value for Students.' },
    { title: 'Speaker of Guild Representative Council', name: 'Rt. Hon. Ojok Samuel', department: 'NCBC (Civil)', term: '2025/2026', phone: '+256 774 219 007', quote: 'The Sovereign Voice of Trainees.' }
  ],
  guildProjects: [
    { id: 1, title: 'Campus High-Speed Wi-Fi Zone Expansion', status: 'In Progress', progress: 85, budget: '4,500,000 UGX', description: 'Extending solar-backed Wi-Fi coverage to all student dormitories and technical workshop courtyards.' },
    { id: 2, title: 'Workshop Safety Gear & Overalls Subsidy', status: 'Completed', progress: 100, budget: '6,200,000 UGX', description: 'Successfully supplied 450 subsidized heavy-duty safety boots and fire-retardant overalls to all first-year trainees.' },
    { id: 3, title: 'Student Emergency Welfare & Health Fund', status: 'Active', progress: 75, budget: '3,000,000 UGX', description: 'Immediate medical assistance and contingency bursaries for vulnerable students facing financial distress.' },
    { id: 4, title: 'Clean Green Campus & Tree Planting Drive', status: 'In Progress', progress: 65, budget: '1,800,000 UGX', description: 'Planting 600 indigenous fruit and shade trees across the sports ground and dining complex.' }
  ],
  guildPetitions: [
    { id: 1, title: 'Extend Computer Lab Opening Hours on Weekends', description: 'Requesting the ICT department to keep Lab 1 open on Saturdays from 8:00 AM to 5:00 PM for project coding and CAD drafting.', author: 'Omona Walter (ICT)', department: 'ICT', date: '2025-05-12', upvotes: 142, status: 'Approved by Principal', category: 'Academic' },
    { id: 2, title: 'Floodlights Installation on Basketball & Volleyball Court', description: 'Allowing trainees to practice evening sports matches after 6:00 PM when temperatures are cooler.', author: 'Adong Scovia (Netball)', department: 'Sports', date: '2025-05-08', upvotes: 98, status: 'Under Review', category: 'Sports' },
    { id: 3, title: 'Installation of Extra Water Points at Technical Workshops', description: 'Adding hands-free washing sinks with soap dispensers outside the Automotive and Welding bays for quick cleanup.', author: 'Otim David (Mechanical)', department: 'Automotive', date: '2025-04-29', upvotes: 115, status: 'Implemented', category: 'Welfare' }
  ],
  sportsTeams: [
    { id: 'football-m', name: 'KTI Warriors FC (Men)', sport: 'Football', coach: 'Coach Bosco Otim', captain: 'Ocan Derrick', trophies: '3x Northern Regional Tech Champions', trainingDays: 'Mon, Wed, Fri 4:30 PM', banner: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/sports-football.jpg' },
    { id: 'netball', name: 'Kitgum Tech Queens', sport: 'Netball', coach: 'Coach Sarah Aber', captain: 'Akello Mercy', trophies: '2024 USSSA Technical Gold', trainingDays: 'Tue, Thu, Sat 4:00 PM', banner: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/students-activity.jpg' },
    { id: 'volleyball', name: 'KTI Titans Volleyball', sport: 'Volleyball', coach: 'Coach Robert Okumu', captain: 'Oringa Kevin', trophies: 'Inter-Institute Finalist 2025', trainingDays: 'Daily 5:00 PM', banner: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/workshop-2.jpg' },
    { id: 'athletics', name: 'KTI Track & Field Athletics', sport: 'Athletics', coach: 'Coach Janet Auma', captain: 'Okot Ronald', trophies: '12 Regional Medals (100m, 5000m, Javelin)', trainingDays: 'Tue, Fri 6:00 AM', banner: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/guild-event.jpg' },
    { id: 'woodball', name: 'KTI Woodball & Table Tennis Club', sport: 'Indoor Games', coach: 'Patron Charles Odoki', captain: 'Lamwaka Judith', trophies: 'National Technical Games Bronze', trainingDays: 'Wed, Sat 2:00 PM', banner: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/lab-session.jpg' }
  ],
  sportsFixtures: [
    { id: 1, sport: 'Football', match: 'KTI Warriors vs UTC Lira', tournament: 'Northern Technical Institutions Championship', date: '2025-06-02', time: '3:30 PM', venue: 'KTI Main Stadium', status: 'Upcoming' },
    { id: 2, sport: 'Netball', match: 'KTI Queens vs Gulu College', tournament: 'USSSA Northern Qualifiers', date: '2025-05-28', time: '2:00 PM', venue: 'Pece Stadium, Gulu', status: 'Upcoming' },
    { id: 3, sport: 'Football', match: 'KTI Warriors 3 - 1 Bobi Polytechnic', tournament: 'Inter-District Derby', date: '2025-05-18', time: '4:00 PM', venue: 'KTI Main Stadium', status: 'Completed', result: '3 - 1 WIN' },
    { id: 4, sport: 'Volleyball', match: 'KTI Titans 3 - 0 Kitgum UCC', tournament: 'Friendly Exhibition', date: '2025-05-14', time: '4:30 PM', venue: 'KTI Sports Arena', status: 'Completed', result: '3 - 0 WIN' }
  ],
  sportsStandings: [
    { rank: 1, team: 'Kitgum Technical Institute (KTI)', played: 8, won: 7, drawn: 1, lost: 0, gd: '+14', points: 22 },
    { rank: 2, team: 'Uganda Technical College (UTC) Lira', played: 8, won: 6, drawn: 1, lost: 1, gd: '+10', points: 19 },
    { rank: 3, team: 'Gulu College of Commerce', played: 8, won: 4, drawn: 2, lost: 2, gd: '+4', points: 14 },
    { rank: 4, team: 'Bobi Community Polytechnic', played: 8, won: 3, drawn: 1, lost: 4, gd: '-2', points: 10 },
    { rank: 5, team: 'Pabbo Technical Institute', played: 8, won: 2, drawn: 0, lost: 6, gd: '-8', points: 6 }
  ],
  sportsTryouts: [],
  admissionPrograms: [
    { code: 'NCES', title: 'National Certificate in Electrical Installation Systems & Maintenance', department: 'Electrical', duration: '2 Years (Full-time / Modular)', qualification: 'UBTEB Accredited', minRequirements: 'UCE (O-Level) with passes in Mathematics, Physics / Science, and English', tuition: '450,000 UGX / Sem' },
    { code: 'NCBC', title: 'National Certificate in Building Construction', department: 'Civil Engineering', duration: '2 Years (Full-time / Modular)', qualification: 'UBTEB Accredited', minRequirements: 'UCE (O-Level) with passes in Mathematics, Technical Drawing / Physics, and English', tuition: '450,000 UGX / Sem' },
    { code: 'NCAM', title: 'National Certificate in Automotive Mechanics', department: 'Automotive', duration: '2 Years (Full-time / Modular)', qualification: 'UBTEB Accredited', minRequirements: 'UCE (O-Level) with passes in Sciences / Mathematics', tuition: '450,000 UGX / Sem' },
    { code: 'NCICT', title: 'National Certificate in Information & Communication Technology', department: 'ICT', duration: '2 Years (Full-time / Weekend)', qualification: 'UBTEB Accredited', minRequirements: 'UCE (O-Level) with credits in Mathematics and English', tuition: '480,000 UGX / Sem' },
    { code: 'NCAG', title: 'National Certificate in Agriculture', department: 'Agriculture', duration: '2 Years (Full-time)', qualification: 'UBTEB Accredited', minRequirements: 'UCE (O-Level) with passes in Biology, Agriculture, or Chemistry', tuition: '420,000 UGX / Sem' },
    { code: 'NCFD', title: 'National Certificate in Fashion & Garment Design', department: 'Fashion', duration: '2 Years (Full-time / Modular)', qualification: 'UBTEB & DIT Certified', minRequirements: 'UCE (O-Level) or PLE with proven vocational experience', tuition: '420,000 UGX / Sem' },
    { code: 'NCPL', title: 'National Certificate in Plumbing', department: 'Civil Engineering', duration: '2 Years (Full-time)', qualification: 'UBTEB Accredited', minRequirements: 'UCE (O-Level) passes or relevant artisan trade test', tuition: '450,000 UGX / Sem' },
    { code: 'C-SOLAR', title: 'Specialized Certificate in Solar PV Sizing & Installation', department: 'Electrical', duration: '6 Months (Artisan Fast-Track)', qualification: 'DIT Level 1 & 2', minRequirements: 'Open to secondary school leavers and practicing technicians', tuition: '320,000 UGX' }
  ],
  admissionApplications: [
    { id: 'KTI-ADM-2026-1042', applicantName: 'Acaye Emmanuel', programCode: 'NCES', programTitle: 'Electrical Installation', phone: '+256 779 123 456', status: 'Provisional Admission Offered', submissionDate: '2025-05-14', gender: 'Male', highSchool: 'Kitgum High School' },
    { id: 'KTI-ADM-2026-1088', applicantName: 'Abalo Christine', programCode: 'NCICT', programTitle: 'Information & Comm. Tech', phone: '+256 782 987 654', status: 'Under Review', submissionDate: '2025-05-18', gender: 'Female', highSchool: 'Archbishop Flynn SS' },
    { id: 'KTI-ADM-2026-1120', applicantName: 'Odoch Geoffrey', programCode: 'NCBC', programTitle: 'Building Construction', phone: '+256 771 445 566', status: 'Interview Scheduled', submissionDate: '2025-05-20', gender: 'Male', highSchool: 'Y.Y. Okot Memorial College' }
  ],
  alumniDirectory: [
    { id: 1, name: 'Eng. Ocen David', classYear: 'Class of 2019', department: 'Electrical Engineering', role: 'Lead Solar Grid Engineer', employer: 'SolarCity Uganda & Umeme Partner', location: 'Gulu / Kitgum', email: 'david.ocen@alumni.kti.ac.ug', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', achievement: 'Supervised over 12MW of rural solar installations in Acholi sub-region.' },
    { id: 2, name: 'Akello Beatrice', classYear: 'Class of 2020', department: 'Building Construction', role: 'Managing Director & Licensed Contractor', employer: 'Acholi Builders Ltd', location: 'Kitgum', email: 'beatrice.akello@alumni.kti.ac.ug', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', achievement: 'Constructed 14 community health post wards with award-winning eco-materials.' },
    { id: 3, name: 'Okello Denis', classYear: 'Class of 2021', department: 'Information Technology', role: 'Senior Cloud & Fullstack Developer', employer: 'TechNorthern Innovation Hub', location: 'Kampala / Remote', email: 'denis.okello@alumni.kti.ac.ug', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', achievement: 'Founder of Northern AgriMarket App linking 15,000 farmers to direct buyers.' },
    { id: 4, name: 'Lamwaka Gloria', classYear: 'Class of 2022', department: 'Fashion & Garment Design', role: 'Chief Creative Director', employer: 'Luo Threads Couture', location: 'Kitgum / Entebbe', email: 'gloria.lamwaka@alumni.kti.ac.ug', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150', achievement: 'Showcased Acholi cultural fabrics at Kampala Fashion Week.' },
    { id: 5, name: 'Otim Samuel', classYear: 'Class of 2018', department: 'Automotive Mechanics', role: 'Fleet Maintenance Superintendent', employer: 'UNHCR Northern Logistics', location: 'Lamwo / Kitgum', email: 'samuel.otim@alumni.kti.ac.ug', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', achievement: 'Maintains 99.4% operational readiness for emergency aid vehicle fleet.' }
  ],
  alumniJobs: [
    { id: 1, title: 'Junior Electrical & Solar Field Technician', company: 'SunPower East Africa', location: 'Kitgum & Agago', deadline: '2025-06-30', type: 'Full-time', salary: '950,000 UGX/mo', postedBy: 'Eng. Ocen David (Alumni)' },
    { id: 2, title: 'Assistant Site Supervisor (Civil & Masonry)', company: 'Acholi Builders Ltd', location: 'Kitgum Municipality', deadline: '2025-06-15', type: 'Full-time Apprenticeship', salary: '850,000 UGX/mo', postedBy: 'Akello Beatrice (Alumni)' },
    { id: 3, title: 'ICT Support Intern (Hardware & Network)', company: 'District Local Government Kitgum', location: 'Kitgum HQ', deadline: '2025-06-20', type: 'Paid Internship', salary: '500,000 UGX/mo', postedBy: 'District ICT Office' }
  ],
  alumniRequests: [
    { id: 'KTI-TR-8821', studentName: 'Graduated George', requestType: 'Official Academic Transcript', department: 'Electrical', yearOfGraduation: '2021', status: 'Ready for Collection', trackingCode: 'KTI-TR-8821', date: '2025-05-10' }
  ],
  campusActivities: [
    {
      id: 1,
      name: 'KTI Robotics, Drone & Coding Club',
      category: 'Innovation',
      members: 48,
      meetingDay: 'Every Wednesday 4:30 PM',
      president: 'Lanyero Brenda (ICT)',
      description: 'Building automated micro-controllers, IoT farming sensors, and drone surveillance for agricultural monitoring.',
      image: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/lab-session.jpg'
    },
    {
      id: 2,
      name: 'Red Cross & Emergency Health Corps',
      category: 'Community Service',
      members: 74,
      meetingDay: 'Every Tuesday & Thursday 5:00 PM',
      president: 'Ocaya Denis (Electrical)',
      description: 'First aid training, community blood donation drives, disaster relief readiness, and health hygiene advocacy.',
      image: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/students-activity.jpg'
    },
    {
      id: 3,
      name: 'Acholi Cultural Performing Arts Troupe',
      category: 'Culture & Arts',
      members: 62,
      meetingDay: 'Fridays & Saturdays 3:00 PM',
      president: 'Auma Mercy (Fashion)',
      description: 'Preserving traditional dances (Bwola, Dingi Dingi, Lararakaraka), royal Acholi flute music, and theater performances.',
      image: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/guild-event.jpg'
    },
    {
      id: 4,
      name: 'KTI Environmental & Agro-Green Brigade',
      category: 'Environment',
      members: 55,
      meetingDay: 'Every Saturday 7:30 AM',
      president: 'Okot Brian (Agriculture)',
      description: 'Campus tree planting, plastic recycling, organic composting, and solar conservation awareness.',
      image: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/campus-main.jpg'
    },
    {
      id: 5,
      name: 'Young Entrepreneurs & Debating Society',
      category: 'Leadership',
      members: 40,
      meetingDay: 'Mondays 5:00 PM',
      president: 'Akello Gladys (Business)',
      description: 'Developing public speaking, competitive parliamentary debate, business plan pitching, and financial literacy.',
      image: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/exhibition.jpg'
    }
  ],
  campusEvents: [
    {
      id: 1,
      title: 'Annual KTI Technical Innovation & Skills Expo 2026',
      date: 'July 18-20, 2026',
      venue: 'KTI Innovation Square & Workshops',
      time: '9:00 AM - 5:00 PM',
      description: 'Grand public exhibition of student-fabricated machinery, solar technology, automated irrigation systems, fashion design catwalk, and architectural models.',
      rsvpCount: 230,
      image: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/exhibition.jpg'
    },
    {
      id: 2,
      title: 'Northern Uganda Inter-Institutes Cultural Gala',
      date: 'August 12, 2026',
      venue: 'Main Campus Assembly Ground',
      time: '1:00 PM - 8:00 PM',
      description: 'Showcasing traditional dance, folk songs, traditional delicacies, and cultural artifacts from across Acholi, Lango, West Nile, and Karamoja.',
      rsvpCount: 410,
      image: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/guild-event.jpg'
    },
    {
      id: 3,
      title: 'Community Technical Outreach & Repair Camp',
      date: 'June 27, 2026',
      venue: 'Kitgum Main Market Square',
      time: '8:30 AM - 4:00 PM',
      description: 'Free community repairs of radios, generators, solar inverters, sewing machines, and motorcycles by KTI final-year trainees and instructors.',
      rsvpCount: 155,
      image: '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/workshop-1.jpg'
    }
  ],
  tasks: [
    { id: 1, title: 'Submit NCES Year 2 Solar Sizing Project Report', category: 'Academic', priority: 'High', dueDate: 'Tomorrow, 5:00 PM', completed: false },
    { id: 2, title: 'Inspect Automotive Hydraulic Hoist Safety Seals', category: 'Workshop', priority: 'Medium', dueDate: 'June 01, 2026', completed: false },
    { id: 3, title: 'Guild Cabinet Monthly Assembly with GRC Reps', category: 'Guild', priority: 'High', dueDate: 'June 03, 2026', completed: true },
    { id: 4, title: 'Verify Semester II Admission Applications Batch', category: 'Registry', priority: 'High', dueDate: 'June 05, 2026', completed: false },
    { id: 5, title: 'Finalize Warriors FC Lineup for UTC Lira Match', category: 'Sports', priority: 'Medium', dueDate: 'June 02, 2026', completed: false },
    { id: 6, title: 'Collect Alumni Transcript Sign-off from Registrar', category: 'Alumni', priority: 'Low', dueDate: 'June 08, 2026', completed: true }
  ],
  schedule: [
    { id: 1, time: '08:30 AM - 11:30 AM', title: 'Electrical Machines & Control Practical', venue: 'DEEE Workshop 2', instructor: 'Eng. Okello David', badge: 'DEEE' },
    { id: 2, time: '11:45 AM - 01:15 PM', title: 'Computer Aided Design (CAD) & Drafting', venue: 'ICT Lab 1', instructor: 'Mr. Denis Opio', badge: 'DICT' },
    { id: 3, time: '02:00 PM - 04:00 PM', title: 'Automotive Engine Diagnostics & Overhaul', venue: 'Automotive Bay', instructor: 'Eng. Komakech Patrick', badge: 'DAME' },
    { id: 4, time: '04:30 PM - 06:00 PM', title: 'KTI Warriors FC Friendly Training Session', venue: 'Main Sports Stadium', instructor: 'Coach Bosco Otim', badge: 'SPORTS' }
  ],
  courses: [
    { id: 'CS101', name: 'Intro to Programming & Algorithms', department_id: 4, credits: 3, lecturer_id: 1, prerequisites: [] },
    { id: 'CS102', name: 'Data Structures & System Analysis', department_id: 4, credits: 4, lecturer_id: 1, prerequisites: ['CS101'] },
    { id: 'EE101', name: 'Electrical Installation Technology I', department_id: 1, credits: 4, lecturer_id: 1, prerequisites: [] },
    { id: 'BC101', name: 'Building Drawing & Construction Science', department_id: 2, credits: 4, lecturer_id: null, prerequisites: [] },
    { id: 'BA101', name: 'Intro to Business Management', department_id: 7, credits: 3, lecturer_id: null, prerequisites: [] }
  ],
  enrollments: [
    { id: 1, student_id: 'S001', course_id: 'EE101', status: 'Enrolled', grade: 'A', grade_points: 4.0, marks: 88 },
    { id: 2, student_id: 'S002', course_id: 'BC101', status: 'Enrolled', grade: 'B', grade_points: 3.0, marks: 74 },
    { id: 3, student_id: 'S003', course_id: 'CS101', status: 'Enrolled', grade: 'A', grade_points: 4.0, marks: 91 }
  ],
  ledger: [
    { id: 1, student_id: 'S001', type: 'Tuition', amount: -450000, date: '2025-01-15', description: 'Semester 1 Tuition NCES' },
    { id: 2, student_id: 'S001', type: 'Payment', amount: 450000, date: '2025-01-20', description: 'Bank Deposit - Full Clearance' },
    { id: 3, student_id: 'S002', type: 'Tuition', amount: -450000, date: '2025-01-16', description: 'Semester 1 Tuition NCBC' },
    { id: 4, student_id: 'S002', type: 'Payment', amount: 300000, date: '2025-01-22', description: 'Partial Installment Payment' }
  ],
  announcements: [
    { id: 1, department: 'Registry', title: 'Admissions for August 2026/2027 Intake are Officially Open', content: 'Applications are formally invited from eligible candidates for all National Certificate and Artisan Diploma programs. Apply online or visit the Academic Registrar.', date: '2025-05-24', priority: 'high' },
    { id: 2, department: 'Sports', title: 'KTI Warriors Football & Netball Tryouts Next Week', content: 'All interested student athletes are encouraged to register for the upcoming regional technical games trials at the sports field.', date: '2025-05-21', priority: 'high' },
    { id: 3, department: 'Guild', title: 'Guild Cabinet Wi-Fi Expansion Phase II Ready', content: 'Free high-speed campus Wi-Fi has now been energized around all technical workshops and student hostels.', date: '2025-05-18', priority: 'normal' },
    { id: 4, department: 'Academic', title: 'UBTEB Final Practical Examinations Timetable', content: 'Final draft timetable for national certificate practical exams has been released. Please check with your HODs.', date: '2025-05-15', priority: 'high' }
  ]
};

export const GlobalProvider = ({ children }) => {
  const getInitialState = (key) => {
    try {
      const saved = localStorage.getItem(`kti_${key}`);
      return saved ? JSON.parse(saved) : INITIAL_DATA[key];
    } catch {
      return INITIAL_DATA[key];
    }
  };

  const [users, setUsersState] = useState(() => getInitialState('users'));
  const [students, setStudentsState] = useState(() => getInitialState('students'));
  const [departments, setDepartmentsState] = useState(() => getInitialState('departments'));
  const [guildCabinet, setGuildCabinetState] = useState(() => getInitialState('guildCabinet'));
  const [guildProjects, setGuildProjectsState] = useState(() => getInitialState('guildProjects'));
  const [guildPetitions, setGuildPetitionsState] = useState(() => getInitialState('guildPetitions'));
  const [sportsTeams, setSportsTeamsState] = useState(() => getInitialState('sportsTeams'));
  const [sportsFixtures, setSportsFixturesState] = useState(() => getInitialState('sportsFixtures'));
  const [sportsStandings, setSportsStandingsState] = useState(() => getInitialState('sportsStandings'));
  const [sportsTryouts, setSportsTryoutsState] = useState(() => getInitialState('sportsTryouts') || []);
  const [admissionPrograms, setAdmissionProgramsState] = useState(() => getInitialState('admissionPrograms'));
  const [admissionApplications, setAdmissionApplicationsState] = useState(() => getInitialState('admissionApplications'));
  const [alumniDirectory, setAlumniDirectoryState] = useState(() => getInitialState('alumniDirectory'));
  const [alumniJobs, setAlumniJobsState] = useState(() => getInitialState('alumniJobs'));
  const [alumniRequests, setAlumniRequestsState] = useState(() => getInitialState('alumniRequests'));
  const [campusActivities, setCampusActivitiesState] = useState(() => getInitialState('campusActivities'));
  const [campusEvents, setCampusEventsState] = useState(() => getInitialState('campusEvents'));
  const [tasks, setTasksState] = useState(() => getInitialState('tasks'));
  const [schedule, setScheduleState] = useState(() => getInitialState('schedule'));
  const [courses, setCoursesState] = useState(() => getInitialState('courses'));
  const [enrollments, setEnrollmentsState] = useState(() => getInitialState('enrollments'));
  const [ledger, setLedgerState] = useState(() => getInitialState('ledger'));
  const [announcements, setAnnouncementsState] = useState(() => getInitialState('announcements'));

  // Default to Faida Nancy (Administrator) or stored user so site is instantly rich & functional
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kti_currentUser');
      if (saved) return JSON.parse(saved);
      // Default to Administrator Faida Nancy for first-time visitors for full executive power
      return INITIAL_DATA.users.find(u => u.username === 'faidanancy7908@gmail.com') || INITIAL_DATA.users[0];
    } catch {
      return INITIAL_DATA.users[0];
    }
  });

  // State sync persistence helpers
  const setPersist = (key, data, setter) => {
    setter(data);
    try {
      localStorage.setItem(`kti_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn("Storage write error", e);
    }
  };

  const setUsers = (d) => setPersist('users', d, setUsersState);
  const setStudents = (d) => setPersist('students', d, setStudentsState);
  const setDepartments = (d) => setPersist('departments', d, setDepartmentsState);
  const setGuildPetitions = (d) => setPersist('guildPetitions', d, setGuildPetitionsState);
  const setSportsTryouts = (d) => setPersist('sportsTryouts', d, setSportsTryoutsState);
  const setAdmissionApplications = (d) => setPersist('admissionApplications', d, setAdmissionApplicationsState);
  const setAlumniRequests = (d) => setPersist('alumniRequests', d, setAlumniRequestsState);
  const setTasks = (d) => setPersist('tasks', d, setTasksState);
  const setAnnouncements = (d) => setPersist('announcements', d, setAnnouncementsState);
  const setCampusEvents = (d) => setPersist('campusEvents', d, setCampusEventsState);
  const setCampusActivities = (d) => setPersist('campusActivities', d, setCampusActivitiesState);

  // Active Function Running indicator state (animates badge in sidebar)
  const [isFunctionRunning, setIsFunctionRunning] = useState(false);
  const [activeFunctionName, setActiveFunctionName] = useState('');

  const triggerSystemFunction = (name, durationMs = 3500) => {
    setIsFunctionRunning(true);
    setActiveFunctionName(name || 'Realtime System Process');
    setTimeout(() => {
      setIsFunctionRunning(false);
      setActiveFunctionName('');
    }, durationMs);
  };

  // Authentication & Role Switching
  const switchRole = (roleName) => {
    let target = users.find(u => u.role === roleName);
    if (!target) {
      if (roleName === 'Guest') {
        target = { id: 0, username: 'guest', role: 'Guest', name: 'Public Visitor' };
      } else {
        target = { id: Date.now(), username: roleName.toLowerCase(), role: roleName, name: `${roleName} User` };
      }
    }
    setCurrentUser(target);
    localStorage.setItem('kti_currentUser', JSON.stringify(target));
  };

  const verifyCredentials = async (identifier, password, role) => {
    let user = users.find(u => u.username.toLowerCase() === identifier.toLowerCase());
    if (!user) {
      const student = students.find(s => s.email.toLowerCase() === identifier.toLowerCase());
      if (student) user = users.find(u => u.id === student.user_id);
    }
    if (!user && role) {
      user = users.find(u => u.role === role);
    }
    if (!user) {
      // Dynamic fallback
      user = {
        id: Date.now(),
        username: identifier || 'demo_user',
        role: role || 'Student',
        name: identifier ? identifier.split('@')[0] : 'Demo User'
      };
      setUsers([...users, user]);
    }
    return { user };
  };

  const completeLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('kti_currentUser', JSON.stringify(user));
  };

  const logout = () => {
    switchRole('Guest');
  };

  const updateProfilePicture = async (userId, base64Str) => {
    const updated = users.map(u => u.id === userId ? { ...u, profile_pic: base64Str } : u);
    setUsers(updated);
    if (currentUser?.id === userId) {
      const updatedCur = { ...currentUser, profile_pic: base64Str };
      setCurrentUser(updatedCur);
      localStorage.setItem('kti_currentUser', JSON.stringify(updatedCur));
    }
  };

  // Admission handler
  const submitAdmissionApplication = (appData) => {
    const refId = `KTI-ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp = {
      id: refId,
      applicantName: `${appData.firstName} ${appData.lastName}`,
      programCode: appData.programCode,
      programTitle: appData.programTitle || 'Technical Certificate Program',
      phone: appData.phone,
      email: appData.email || '',
      gender: appData.gender,
      highSchool: appData.highSchool || 'O-Level Certificate',
      intake: appData.intake || 'August 2026/2027',
      status: 'Provisional Admission Offered',
      submissionDate: new Date().toISOString().split('T')[0],
      grades: appData.grades || 'Passes in Sci/Math/Eng'
    };
    const updated = [newApp, ...admissionApplications];
    setAdmissionApplications(updated);
    triggerSystemFunction("Processing Online Admission Application", 4000);
    return refId;
  };

  // Guild Petition Handlers
  const submitGuildPetition = (petition) => {
    const newPet = {
      id: Date.now(),
      title: petition.title,
      description: petition.description,
      author: petition.author || currentUser.name || 'Concerned Trainee',
      department: petition.department || 'General',
      date: new Date().toISOString().split('T')[0],
      upvotes: 1,
      status: 'Under Review',
      category: petition.category || 'Welfare'
    };
    setGuildPetitions([newPet, ...guildPetitions]);
    return true;
  };

  const upvoteGuildPetition = (petitionId) => {
    const updated = guildPetitions.map(p => p.id === petitionId ? { ...p, upvotes: p.upvotes + 1 } : p);
    setGuildPetitions(updated);
  };

  // Sports Tryouts Handler
  const submitSportsTryout = (tryoutData) => {
    const newTryout = {
      id: Date.now(),
      ...tryoutData,
      status: 'Confirmed for Tryout',
      date: new Date().toISOString().split('T')[0]
    };
    setSportsTryouts([newTryout, ...sportsTryouts]);
    return true;
  };

  // Alumni Services Request Handler
  const submitTranscriptRequest = (data) => {
    const trackingCode = `KTI-TR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq = {
      id: trackingCode,
      trackingCode,
      studentName: data.name,
      requestType: data.type || 'Official Academic Transcript',
      department: data.department,
      yearOfGraduation: data.year,
      email: data.email,
      phone: data.phone,
      status: 'Processing in Academic Registry',
      date: new Date().toISOString().split('T')[0]
    };
    setAlumniRequests([newReq, ...alumniRequests]);
    return trackingCode;
  };

  // Campus Events & Club RSVP
  const rsvpEvent = (eventId) => {
    const updated = campusEvents.map(e => e.id === eventId ? { ...e, rsvpCount: e.rsvpCount + 1, userRsvp: true } : e);
    setCampusEvents(updated);
  };

  const joinClub = (clubId) => {
    const updated = campusActivities.map(c => c.id === clubId ? { ...c, members: c.members + 1, joined: true } : c);
    setCampusActivities(updated);
  };

  // Tasks Management
  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      title: task.title,
      category: task.category || 'General',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate || 'This Week',
      completed: false
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (taskId) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
  };

  const deleteTask = (taskId) => {
    const updated = tasks.filter(t => t.id !== taskId);
    setTasks(updated);
  };

  // Balance calculation
  const getStudentBalance = (studentId) => {
    return ledger
      .filter(entry => entry.student_id === studentId)
      .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  };

  // UNRESTRICTED Course Registration (No debt blocks, no prerequisite locks)
  const registerForCourse = async (studentId, courseId) => {
    const sId = studentId || currentUser?.student_id || 'S001';
    if (enrollments.some(e => e.student_id === sId && e.course_id === courseId)) {
      throw new Error("Already enrolled in this course.");
    }
    const newEnrollment = {
      id: Date.now(),
      student_id: sId,
      course_id: courseId,
      status: 'Enrolled',
      grade: null,
      grade_points: null,
      marks: null
    };
    const updated = [...enrollments, newEnrollment];
    setPersist('enrollments', updated, setEnrollmentsState);
    triggerSystemFunction(`Registering Course ${courseId}`, 3500);
    return true;
  };

  // UNRESTRICTED Payments
  const makePayment = async (studentId, amount, description) => {
    const sId = studentId || currentUser?.student_id || 'S001';
    const newPayment = {
      id: Date.now(),
      student_id: sId,
      type: 'Payment',
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      description: description || 'Tuition Clearance'
    };
    const updated = [...ledger, newPayment];
    setPersist('ledger', updated, setLedgerState);
    triggerSystemFunction(`Reconciling UGX ${amount} Payment`, 3500);
    return true;
  };

  // UNRESTRICTED Grading
  const submitGrade = async (enrollmentId, grade, marks) => {
    const gradePointsMap = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 };
    const points = gradePointsMap[grade] || 0.0;
    const updated = enrollments.map(e => 
      e.id === enrollmentId ? { ...e, grade, grade_points: points, marks: marks || 85 } : e
    );
    setPersist('enrollments', updated, setEnrollmentsState);
    triggerSystemFunction(`Submitting Marks (${marks}%) & Grade ${grade}`, 3000);
    return true;
  };

  // UNRESTRICTED Student Profile Creation
  const createStudentProfile = async (studentData) => {
    const newUserId = Date.now();
    const names = (studentData.name || 'New Student').trim().split(' ');
    const first_name = names[0] || 'Trainee';
    const last_name = names.length > 1 ? names[names.length - 1] : 'Scholar';
    const studentId = 'S' + Math.floor(100 + Math.random() * 900);
    const generatedEmail = `${first_name.charAt(0).toLowerCase()}${last_name.charAt(0).toLowerCase()}${studentId}students@kti.ac.ug`;

    const newStudent = {
      student_id: studentId,
      user_id: newUserId,
      name: studentData.name,
      email: generatedEmail,
      department_id: studentData.department_id || 1,
      enrollment_date: new Date().toISOString().split('T')[0]
    };
    setStudents([...students, newStudent]);
    return { studentId, generatedEmail };
  };

  const loadData = async () => true;

  const value = {
    currentUser,
    users,
    students,
    departments,
    guildCabinet,
    guildProjects,
    guildPetitions,
    sportsTeams,
    sportsFixtures,
    sportsStandings,
    sportsTryouts,
    admissionPrograms,
    admissionApplications,
    alumniDirectory,
    alumniJobs,
    alumniRequests,
    campusActivities,
    campusEvents,
    tasks,
    schedule,
    courses,
    enrollments,
    ledger,
    announcements,
    // Methods
    switchRole,
    verifyCredentials,
    completeLogin,
    logout,
    updateProfilePicture,
    submitAdmissionApplication,
    submitGuildPetition,
    upvoteGuildPetition,
    submitSportsTryout,
    submitTranscriptRequest,
    rsvpEvent,
    joinClub,
    addTask,
    toggleTask,
    deleteTask,
    getStudentBalance,
    registerForCourse,
    makePayment,
    submitGrade,
    createStudentProfile,
    loadData,
    isFunctionRunning,
    activeFunctionName,
    triggerSystemFunction,
    courseWorks: [],
    setCourseWorks: () => {}
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};
