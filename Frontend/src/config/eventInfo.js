export const EVENT_INFO = {
  name: 'PIXEL PATAKHA',
  edition: "BVEST '26",
  tagline: 'A 3-HOUR UI/UX DESIGNOTHON',
  subtitle: 'Turn bold ideas into intuitive digital experiences.',
  stripNotice: "★ BVEST '26 • DESIGN. BUILD. PLAY. ★",

  // Poster facts
  date: 'OCT 23rd',
  time: '9 AM onwards',
  venue: 'Venue: B404',
  prizePool: '₹1,00,000',
  organizers: 'DAS × ACM BVP',

  quickFacts: [
    { label: 'Duration', value: '3 Hours' },
    { label: 'Team Size', value: '1–3 Members' },
    { label: 'Tools', value: 'Figma · Canva · Adobe XD' },
    { label: 'Scoring', value: '100 Points Total' },
  ],

  features: [
    {
      step: '01',
      title: 'Think Fast',
      description: 'Receive an on-the-spot design problem statement revealed at kickoff. Brainstorm user-first flows immediately.',
      tone: 'cyan',
      sprite: 'robot',
    },
    {
      step: '02',
      title: 'Build Smart',
      description: 'Craft high-fidelity wireframes, intuitive UI layouts, and interactive prototypes using Figma, Canva, or Adobe XD.',
      tone: 'purple',
      sprite: 'hero',
    },
    {
      step: '03',
      title: 'Show Your Craft',
      description: 'Submit your design links, asset references, and mockups for evaluation across a comprehensive 100-point rubric.',
      tone: 'yellow',
      sprite: 'diamond',
    },
  ],

  timeline: [
    {
      time: '9:00 AM',
      stage: 'Registration Starts',
      details: 'Check-in opens. Teams complete on-ground verification and setup.',
      icon: 'flag',
    },
    {
      time: '9:30 AM',
      stage: 'Registration Closes',
      details: 'Registration window strictly closes. All participating teams assemble.',
      icon: 'users',
    },
    {
      time: '10:00 AM',
      stage: 'Problem Statements Reveal',
      details: 'Official design brief is revealed. The 3-hour designathon sprint officially kicks off!',
      icon: 'star',
    },
    {
      time: '11:00 AM',
      stage: 'Judging Round 1 Starts',
      details: 'Mentorship round begins. Judges evaluate initial screen progress and provide guidance.',
      icon: 'users',
    },
    {
      time: '1:00 PM',
      stage: 'Submissions Closes',
      details: 'Design sprint ends! All Figma/Canva/XD prototype links and files must be submitted.',
      icon: 'diamond',
    },
    {
      time: '1:30 PM',
      stage: 'Round 1 Shortlisted Teams Announced',
      details: 'Round 1 judging concludes. Shortlisted teams and Round 1 winners are announced.',
      icon: 'star',
    },
    {
      time: '2:00 PM',
      stage: 'Judging Round 2 Starts',
      details: 'Final judging round commences for qualifying teams, followed by grand verdict.',
      icon: 'diamond',
    },
  ],

  judgingCriteria: [
    {
      title: 'Concept & Idea',
      points: 25,
      percent: '25%',
      color: 'var(--color-electric-cyan)',
      bg: 'rgba(0, 217, 255, 0.12)',
      border: 'rgba(0, 217, 255, 0.4)',
      description: 'Originality, creative thinking, and contextual relevance to the announced problem statement.',
      icon: '💡',
    },
    {
      title: 'Design Execution',
      points: 25,
      percent: '25%',
      color: 'var(--color-arcade-yellow)',
      bg: 'rgba(255, 226, 41, 0.12)',
      border: 'rgba(255, 226, 41, 0.4)',
      description: 'Visual aesthetics, typography choices, grid layout, color harmony, and visual hierarchy.',
      icon: '📐',
    },
    {
      title: 'UX & Function',
      points: 20,
      percent: '20%',
      color: 'var(--color-success-green)',
      bg: 'rgba(72, 224, 138, 0.12)',
      border: 'rgba(72, 224, 138, 0.4)',
      description: 'Usability, logical user journey, navigation clarity, and real-world practical effectiveness.',
      icon: '⚡',
    },
    {
      title: 'Innovation',
      points: 20,
      percent: '20%',
      color: 'var(--color-pixel-pink)',
      bg: 'rgba(255, 51, 102, 0.12)',
      border: 'rgba(255, 51, 102, 0.4)',
      description: 'Problem-solving depth, distinctive creative angles, and unconventional yet viable features.',
      icon: '✨',
    },
    {
      title: 'Responsiveness',
      points: 10,
      percent: '10%',
      color: 'var(--color-voxel-purple)',
      bg: 'rgba(155, 77, 255, 0.12)',
      border: 'rgba(155, 77, 255, 0.4)',
      description: 'Clarity of explanation, defensive design thinking, and justification of design decisions during evaluation.',
      icon: '💬',
    },
  ],

  judgingRounds: [
    {
      round: 'Round 1',
      name: 'Mentorship & Initial Evaluation',
      time: '11:00 AM – 1:30 PM',
      description: 'Judges review WIP prototypes, guide design directions, and announce Round 1 winners at 1:30 PM.',
    },
    {
      round: 'Round 2',
      name: 'Final Championship Round',
      time: '2:00 PM Onwards',
      description: 'Qualifying teams present their full prototypes to judges for final 100-point rubric scoring.',
    },
  ],

  technicalSpecs: [
    {
      title: 'Project Requirement',
      detail: 'Design a complete UI/UX solution on the announced topic. Screen count requirements will be specified in the problem statement.',
      icon: '📱',
    },
    {
      title: 'Hardware Responsibility',
      detail: 'Bring your own laptops, chargers, mice, and graphic tablets. Organizers will not provide design devices or backup hardware.',
      icon: '💻',
    },
    {
      title: 'Design Software',
      detail: 'All final designs must be created and presented using Figma, Canva, or Adobe XD. Other digital tools may be used for asset creation, but final assembly must be in these tools.',
      icon: '🎨',
    },
    {
      title: 'Internet Connectivity',
      detail: 'Participants must arrange their own mobile hotspots. Dedicated campus Wi-Fi will not be provided by organizers.',
      icon: '📡',
    },
  ],

  rules: [
    'Eligibility: Each participating team must consist of 1 to 3 members.',
    'Problem Statement: Revealed exclusively at the start of the event. All designs must be built for this prompt.',
    'Software: All final designs can only be created and presented in Figma, Canva, or Adobe XD.',
    'Hardware & Network: Bring your own laptops, chargers, and mobile hotspot. Organizers provide no hardware or Wi-Fi.',
    'References & Citation: Reference materials from Dribbble or Pinterest are starting points only. All external assets, icons, fonts, and inspiration must be cited.',
    'Strict Deadlines: All design work must be completed within strictly 3 hours. Late submissions result in immediate disqualification.',
    'Version History: Judges reserve the right to audit your project’s version history to verify creation occurred during the event.',
    'Authority: The decision of the judges is final and cannot be contested.',
  ],

  aiPolicy: {
    title: 'Zero Tolerance: Generative AI & Plagiarism',
    warning: 'The use of Generative AI tools (e.g. Midjourney, DALL-E, ChatGPT layout generators, or AI-generated UI kits) for core design elements or design brainstorming is strictly prohibited. All work must be the original creation of the team. Any team caught using AI or external assistance will be disqualified immediately.',
  },

  showcase: [
    {
      id: 'placeholder-1',
      title: 'Retro Arcade Companion App',
      category: 'Mobile UI / Gaming',
      badge: 'SAMPLE PLACEHOLDER',
      author: 'Sample Design Team',
    },
    {
      id: 'placeholder-2',
      title: 'Cyberpunk Quest Dashboard',
      category: 'Web App / SaaS',
      badge: 'SAMPLE PLACEHOLDER',
      author: 'Sample Design Team',
    },
    {
      id: 'placeholder-3',
      title: '8-Bit Eco Navigator',
      category: 'Smart Mobility',
      badge: 'SAMPLE PLACEHOLDER',
      author: 'Sample Design Team',
    },
  ],

  faq: [
    {
      question: 'Who is eligible to participate?',
      answer: 'Any student registered for BVEST ’26 can participate. Teams must consist of 1 to 3 members.',
    },
    {
      question: 'When will the problem statement be revealed?',
      answer: 'The design problem statement will be announced exclusively at the kickoff of the event. All participants must create their design based on that problem statement only.',
    },
    {
      question: 'Which design software tools are allowed?',
      answer: 'All final designs can only be created and presented using Figma, Canva, or Adobe XD. Digital illustration tools can be used for custom assets, but the final assembled UI must be in Figma, Canva, or Adobe XD.',
    },
    {
      question: 'Is Wi-Fi provided by the organizers?',
      answer: 'No. Participants are strictly responsible for their own internet connectivity (such as a mobile hotspot). Wi-Fi will not be provided by the organizers.',
    },
    {
      question: 'What hardware do we need to bring?',
      answer: 'You must bring your own laptops and any necessary peripherals (chargers, mice, or graphic tablets). The organizers will not provide any designing devices or backup hardware.',
    },
    {
      question: 'Are Generative AI tools permitted?',
      answer: 'No. Generative AI tools (Midjourney, DALL-E, AI UI mockup generators) for core design elements or brainstorming are strictly prohibited. Every submission is audited and violations result in immediate disqualification.',
    },
    {
      question: 'Can we use inspiration from Dribbble or Pinterest?',
      answer: 'Yes, but reference materials should be used as a starting point only. Your design must demonstrate distinct originality. A list of links or copies of all external references used must be submitted prior to evaluation.',
    },
    {
      question: 'How are teams judged and scored?',
      answer: 'Teams are scored out of 100 points: Concept & Idea (25 pts), Design Execution (25 pts), UX & Function (20 pts), Innovation (20 pts), and Responsiveness (10 pts). There are two rounds: Round 1 Mentorship guidance and Round 2 Final Evaluation.',
    },
    {
      question: 'What happens if we submit late?',
      answer: 'All design work must be completed within the strictly allotted 3-hour time frame. Late submissions will result in automatic disqualification, regardless of the reason.',
    },
    {
      question: 'Will judges inspect edit history?',
      answer: 'Yes. Judges reserve the right to check the project edit and version history in Figma, Canva, or Adobe XD to verify the design was genuinely created during the 3-hour event.',
    },
  ],

  contact: {
    email: '',
    phone: '',
    whatsappGroup: '',
    socials: [],
  },
};

export default EVENT_INFO;
