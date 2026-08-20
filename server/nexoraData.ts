import type { Job, JobProvider, JobSearchParams } from "../shared/nexora";

const EXPANDED_DEMO_JOBS: Job[] = [
  {
    id: "nx-nova-ux",
    title: "UX Researcher",
    company: "Nova Commons",
    location: "Mumbai, India",
    remote: false,
    workMode: "hybrid",
    jobType: "full-time",
    experienceLevel: "mid",
    salaryMin: 950000,
    salaryMax: 1400000,
    currency: "INR",
    description:
      "Plan mixed-method research that helps product teams make confident decisions. You will conduct interviews, synthesize findings, and partner with product designers.",
    skills: [
      "User Research",
      "Interviewing",
      "Figma",
      "Prototyping",
      "Analytics",
    ],
    postedAt: "2026-08-13T09:00:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/nova-ux",
  },
  {
    id: "nx-vector-qa",
    title: "QA Automation Engineer",
    company: "Vector Labs",
    location: "Bengaluru, India",
    remote: false,
    workMode: "hybrid",
    jobType: "full-time",
    experienceLevel: "mid",
    salaryMin: 900000,
    salaryMax: 1350000,
    currency: "INR",
    description:
      "Build dependable automated test coverage for a fast-moving SaaS platform. You will use TypeScript, Playwright, APIs, and CI workflows to improve release confidence.",
    skills: ["TypeScript", "Playwright", "API Testing", "CI/CD", "Git"],
    postedAt: "2026-08-12T10:30:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/vector-qa",
  },
  {
    id: "nx-cipher-security",
    title: "Cybersecurity Analyst",
    company: "Cipher Grove",
    location: "Pune, India",
    remote: false,
    workMode: "onsite",
    jobType: "full-time",
    experienceLevel: "entry",
    salaryMin: 800000,
    salaryMax: 1150000,
    currency: "INR",
    description:
      "Support incident triage, vulnerability management, and secure-access reviews across a growing technology estate. Linux, networking, and security fundamentals are essential.",
    skills: ["Linux", "Networking", "Security", "Python", "AWS"],
    postedAt: "2026-08-11T07:45:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/cipher-security",
  },
  {
    id: "nx-clarity-business",
    title: "Business Analyst",
    company: "Clarity Loop",
    location: "Gurugram, India",
    remote: false,
    workMode: "hybrid",
    jobType: "full-time",
    experienceLevel: "entry",
    salaryMin: 700000,
    salaryMax: 1050000,
    currency: "INR",
    description:
      "Translate business questions into structured requirements, process maps, and practical delivery plans. You will work closely with stakeholders and use SQL and Excel for insight.",
    skills: ["Business Analysis", "SQL", "Excel", "Requirements", "Analytics"],
    postedAt: "2026-08-10T11:00:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/clarity-business",
  },
  {
    id: "nx-weave-fullstack",
    title: "Full Stack Developer",
    company: "Weave Stack",
    location: "Remote — India",
    remote: true,
    workMode: "remote",
    jobType: "full-time",
    experienceLevel: "mid",
    salaryMin: 1300000,
    salaryMax: 1650000,
    currency: "INR",
    description:
      "Ship end-to-end product workflows with React, Node.js, PostgreSQL, and cloud services. The team values thoughtful APIs, performance, and a collaborative product mindset.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    postedAt: "2026-08-09T13:00:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/weave-fullstack",
    featured: true,
  },
  {
    id: "nx-ember-devops",
    title: "DevOps Engineer",
    company: "Ember Cloud",
    location: "Hyderabad, India",
    remote: false,
    workMode: "hybrid",
    jobType: "full-time",
    experienceLevel: "mid",
    salaryMin: 1200000,
    salaryMax: 1600000,
    currency: "INR",
    description:
      "Improve deployment safety and service reliability through infrastructure automation, Kubernetes, CI/CD, and observability. You will mentor teams on practical operational habits.",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
    postedAt: "2026-08-08T09:15:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/ember-devops",
  },
  {
    id: "nx-arc-product",
    title: "Associate Product Manager",
    company: "Arc Market",
    location: "Bengaluru, India",
    remote: false,
    workMode: "hybrid",
    jobType: "full-time",
    experienceLevel: "entry",
    salaryMin: 900000,
    salaryMax: 1300000,
    currency: "INR",
    description:
      "Own well-scoped product initiatives from customer insight to launch. You will write clear requirements, analyze experiments, and align design and engineering partners.",
    skills: [
      "Product Strategy",
      "Analytics",
      "User Research",
      "Figma",
      "Communication",
    ],
    postedAt: "2026-08-07T08:30:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/arc-product",
  },
  {
    id: "nx-pulse-dataeng",
    title: "Data Engineer",
    company: "Pulse Metrics",
    location: "Chennai, India",
    remote: false,
    workMode: "onsite",
    jobType: "full-time",
    experienceLevel: "mid",
    salaryMin: 1100000,
    salaryMax: 1550000,
    currency: "INR",
    description:
      "Design trusted data pipelines and models for reporting and machine-learning teams. You will use Python, SQL, Airflow, and cloud warehouses.",
    skills: ["Python", "SQL", "Airflow", "ETL", "AWS"],
    postedAt: "2026-08-06T12:15:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/pulse-dataeng",
  },
  {
    id: "nx-loom-seo",
    title: "SEO Specialist",
    company: "Loom Content",
    location: "Remote — India",
    remote: true,
    workMode: "remote",
    jobType: "full-time",
    experienceLevel: "entry",
    salaryMin: 550000,
    salaryMax: 800000,
    currency: "INR",
    description:
      "Improve organic discovery for an education platform through technical audits, keyword research, content planning, and performance reporting.",
    skills: ["SEO", "Analytics", "Content Strategy", "Research", "Writing"],
    postedAt: "2026-08-05T10:00:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/loom-seo",
  },
  {
    id: "nx-harbor-success",
    title: "Customer Success Manager",
    company: "Harbor Desk",
    location: "Mumbai, India",
    remote: false,
    workMode: "hybrid",
    jobType: "full-time",
    experienceLevel: "mid",
    salaryMin: 850000,
    salaryMax: 1250000,
    currency: "INR",
    description:
      "Guide customers to measurable outcomes through onboarding, usage insight, renewal planning, and clear cross-functional communication.",
    skills: [
      "Customer Success",
      "Analytics",
      "Communication",
      "Project Management",
      "CRM",
    ],
    postedAt: "2026-08-04T11:30:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/harbor-success",
  },
  {
    id: "nx-lumen-salesforce",
    title: "Salesforce Administrator",
    company: "Lumen Works",
    location: "Delhi, India",
    remote: false,
    workMode: "onsite",
    jobType: "full-time",
    experienceLevel: "entry",
    salaryMin: 700000,
    salaryMax: 1000000,
    currency: "INR",
    description:
      "Maintain dependable sales operations by configuring Salesforce, improving data quality, and creating clear reporting for go-to-market teams.",
    skills: ["Salesforce", "CRM", "Excel", "Analytics", "Automation"],
    postedAt: "2026-08-03T09:45:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/lumen-salesforce",
  },
  {
    id: "nx-mosaic-ui",
    title: "UI Designer",
    company: "Mosaic Health",
    location: "Pune, India",
    remote: false,
    workMode: "hybrid",
    jobType: "contract",
    experienceLevel: "mid",
    salaryMin: 850000,
    salaryMax: 1200000,
    currency: "INR",
    description:
      "Turn product requirements into expressive, accessible interfaces for a patient engagement platform. Strong Figma and design-system craft are required.",
    skills: ["Figma", "Design Systems", "Prototyping", "Accessibility", "CSS"],
    postedAt: "2026-08-02T12:00:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/mosaic-ui",
  },
  {
    id: "nx-ledger-chain",
    title: "Blockchain Developer",
    company: "Ledger Field",
    location: "Remote — India",
    remote: true,
    workMode: "remote",
    jobType: "contract",
    experienceLevel: "mid",
    salaryMin: 1300000,
    salaryMax: 1650000,
    currency: "INR",
    description:
      "Build secure smart-contract integrations and developer tools for financial workflow products. Solidity, JavaScript, and security awareness are central to the role.",
    skills: ["Solidity", "JavaScript", "Web3", "Security", "REST APIs"],
    postedAt: "2026-08-01T08:00:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/ledger-chain",
  },
  {
    id: "nx-sensor-embedded",
    title: "Embedded Systems Engineer",
    company: "Sensor Forge",
    location: "Bengaluru, India",
    remote: false,
    workMode: "onsite",
    jobType: "full-time",
    experienceLevel: "mid",
    salaryMin: 1150000,
    salaryMax: 1500000,
    currency: "INR",
    description:
      "Develop firmware and board-level integrations for connected industrial devices. You will work with C++, Linux, debugging tools, and hardware teams.",
    skills: ["C++", "Embedded Systems", "Linux", "Python", "Git"],
    postedAt: "2026-07-31T10:30:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/sensor-embedded",
  },
  {
    id: "nx-tide-ios",
    title: "iOS Developer",
    company: "Tide Mobile",
    location: "Hyderabad, India",
    remote: false,
    workMode: "hybrid",
    jobType: "full-time",
    experienceLevel: "mid",
    salaryMin: 1200000,
    salaryMax: 1600000,
    currency: "INR",
    description:
      "Create polished mobile product experiences in Swift for a fast-growing consumer platform. You will own releases, performance, and reliable API integration.",
    skills: ["Swift", "iOS", "REST APIs", "Mobile Testing", "Git"],
    postedAt: "2026-07-30T09:00:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/tide-ios",
  },
  {
    id: "nx-margin-writer",
    title: "Technical Writer",
    company: "Margin Systems",
    location: "Remote — India",
    remote: true,
    workMode: "remote",
    jobType: "part-time",
    experienceLevel: "entry",
    salaryMin: 35000,
    salaryMax: 60000,
    currency: "INR",
    description:
      "Write concise product guides, developer documentation, and release notes for workflow automation software. Technical curiosity and excellent editing are valued.",
    skills: ["Technical Writing", "Writing", "Research", "REST APIs", "Git"],
    postedAt: "2026-07-29T11:15:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/margin-writer",
  },
  {
    id: "nx-pivot-finops",
    title: "Finance Operations Analyst",
    company: "Pivot Finance",
    location: "Mumbai, India",
    remote: false,
    workMode: "hybrid",
    jobType: "full-time",
    experienceLevel: "entry",
    salaryMin: 650000,
    salaryMax: 950000,
    currency: "INR",
    description:
      "Improve financial reporting and operational planning through reconciliations, Excel models, SQL analysis, and careful stakeholder communication.",
    skills: ["Excel", "SQL", "Finance", "Analytics", "Communication"],
    postedAt: "2026-07-28T13:00:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/pivot-finops",
  },
  {
    id: "nx-people-ops",
    title: "HR Operations Specialist",
    company: "People Current",
    location: "Gurugram, India",
    remote: false,
    workMode: "hybrid",
    jobType: "full-time",
    experienceLevel: "entry",
    salaryMin: 550000,
    salaryMax: 800000,
    currency: "INR",
    description:
      "Support a high-trust employee experience through accurate people data, onboarding coordination, policy operations, and process improvements.",
    skills: [
      "HR Operations",
      "Excel",
      "Communication",
      "Project Management",
      "Analytics",
    ],
    postedAt: "2026-07-27T08:45:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/people-ops",
  },
  {
    id: "nx-strata-solutions",
    title: "Solutions Architect",
    company: "Strata Cloud",
    location: "Remote — India",
    remote: true,
    workMode: "remote",
    jobType: "full-time",
    experienceLevel: "senior",
    salaryMin: 1450000,
    salaryMax: 1700000,
    currency: "INR",
    description:
      "Partner with customers and engineering teams to design secure, scalable cloud implementations. Strong AWS, API, architecture, and communication experience is required.",
    skills: ["AWS", "Architecture", "REST APIs", "Security", "Communication"],
    postedAt: "2026-07-26T10:00:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/strata-solutions",
    featured: true,
  },
  {
    id: "nx-kite-ai-product",
    title: "AI Product Analyst",
    company: "Kite Intelligence",
    location: "Bengaluru, India",
    remote: false,
    workMode: "hybrid",
    jobType: "full-time",
    experienceLevel: "mid",
    salaryMin: 1150000,
    salaryMax: 1550000,
    currency: "INR",
    description:
      "Measure and improve AI-assisted product workflows by combining SQL analysis, prompt evaluation, user research, and clear product recommendations.",
    skills: [
      "SQL",
      "Python",
      "Machine Learning",
      "User Research",
      "Product Strategy",
    ],
    postedAt: "2026-07-25T09:30:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/kite-ai-product",
  },
];

export const DEMO_JOBS: Job[] = [
  {
    id: "nx-aurora-python",
    title: "Software Engineer, Platform",
    company: "Aurora Systems",
    location: "Hyderabad, India",
    remote: false,
    workMode: "hybrid",
    jobType: "full-time",
    experienceLevel: "entry",
    salaryMin: 650000,
    salaryMax: 900000,
    currency: "INR",
    description:
      "Join a product engineering team building reliable workflow services for growing businesses. You will develop Python APIs, improve data pipelines, collaborate in code reviews, and help ship thoughtful features. Required skills include Python, SQL, REST APIs, Git, and a practical learning mindset. Familiarity with Docker or AWS is preferred but not required.",
    skills: ["Python", "SQL", "REST APIs", "Git", "Docker"],
    postedAt: "2026-08-18T09:00:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/aurora-platform",
    featured: true,
  },
  {
    id: "nx-fractal-react",
    title: "Frontend Engineer",
    company: "Fractal Studio",
    location: "Remote — India",
    remote: true,
    workMode: "remote",
    jobType: "full-time",
    experienceLevel: "mid",
    salaryMin: 1200000,
    salaryMax: 1700000,
    currency: "INR",
    description:
      "Fractal Studio is looking for a frontend engineer to build refined, accessible product experiences. You will work with React, TypeScript, modern CSS, and design systems. This role values strong product judgement, performance awareness, and clear communication across design and engineering.",
    skills: ["React", "TypeScript", "CSS", "Accessibility", "Figma"],
    postedAt: "2026-08-19T11:00:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/fractal-frontend",
  },
  {
    id: "nx-lattice-data",
    title: "Data Analyst",
    company: "Lattice Health",
    location: "Bengaluru, India",
    remote: false,
    workMode: "hybrid",
    jobType: "full-time",
    experienceLevel: "entry",
    salaryMin: 700000,
    salaryMax: 1000000,
    currency: "INR",
    description:
      "Turn clinical operations data into useful, trustworthy decisions. You will use SQL, Python, dashboards, and structured analysis to support operational teams. The ideal candidate has strong analytical foundations and can explain findings clearly to non-technical partners.",
    skills: ["SQL", "Python", "Tableau", "Excel", "Statistics"],
    postedAt: "2026-08-17T08:30:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/lattice-data",
  },
  {
    id: "nx-orbit-ml",
    title: "Machine Learning Intern",
    company: "Orbit Research",
    location: "Remote — India",
    remote: true,
    workMode: "remote",
    jobType: "internship",
    experienceLevel: "intern",
    salaryMin: 30000,
    salaryMax: 45000,
    currency: "INR",
    description:
      "Work alongside applied researchers on experiments that improve recommendation systems. You will prepare data, evaluate models, document results, and contribute small production-quality utilities. Python, machine learning fundamentals, pandas, and curiosity are essential.",
    skills: ["Python", "Machine Learning", "Pandas", "PyTorch", "Statistics"],
    postedAt: "2026-08-20T06:00:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/orbit-ml-intern",
    featured: true,
  },
  {
    id: "nx-cirrus-java",
    title: "Java Backend Engineer",
    company: "Cirrus Pay",
    location: "Chennai, India",
    remote: false,
    workMode: "onsite",
    jobType: "full-time",
    experienceLevel: "entry",
    salaryMin: 750000,
    salaryMax: 1100000,
    currency: "INR",
    description:
      "Build secure payment services used by small merchants. You will work with Java, Spring Boot, PostgreSQL, and API integrations. The team supports early-career engineers through pairing, reviews, and clear technical mentorship.",
    skills: ["Java", "Spring Boot", "PostgreSQL", "REST APIs", "Git"],
    postedAt: "2026-08-16T09:30:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/cirrus-java",
  },
  {
    id: "nx-canvas-design",
    title: "Product Designer",
    company: "Canvas Works",
    location: "Mumbai, India",
    remote: false,
    workMode: "hybrid",
    jobType: "full-time",
    experienceLevel: "mid",
    salaryMin: 1000000,
    salaryMax: 1500000,
    currency: "INR",
    description:
      "Own product design from discovery through detailed interaction design. You will partner with product and engineering on research, flows, prototypes, and accessible visual systems. A strong portfolio showing thoughtful product decisions is required.",
    skills: [
      "Figma",
      "User Research",
      "Prototyping",
      "Design Systems",
      "Accessibility",
    ],
    postedAt: "2026-08-15T12:00:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/canvas-product-design",
  },
  {
    id: "nx-verde-devops",
    title: "Cloud Operations Associate",
    company: "Verde Grid",
    location: "Pune, India",
    remote: false,
    workMode: "hybrid",
    jobType: "full-time",
    experienceLevel: "entry",
    salaryMin: 650000,
    salaryMax: 950000,
    currency: "INR",
    description:
      "Help keep modern energy systems observable, reliable, and secure. You will support CI/CD workflows, cloud infrastructure, incident learning, and internal automation. Candidates should be comfortable with Linux, Git, basic networking, and scripting.",
    skills: ["Linux", "AWS", "Docker", "Git", "CI/CD"],
    postedAt: "2026-08-18T13:00:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/verde-cloud-ops",
  },
  {
    id: "nx-bridge-mobile",
    title: "React Native Developer",
    company: "Bridge Mobility",
    location: "Delhi, India",
    remote: false,
    workMode: "hybrid",
    jobType: "contract",
    experienceLevel: "mid",
    salaryMin: 900000,
    salaryMax: 1300000,
    currency: "INR",
    description:
      "Create a dependable mobile experience for urban mobility customers. You will ship features in React Native, collaborate with API engineers, and care deeply about device performance and quality. Experience with TypeScript and mobile release workflows is valued.",
    skills: [
      "React Native",
      "TypeScript",
      "JavaScript",
      "REST APIs",
      "Mobile Testing",
    ],
    postedAt: "2026-08-14T10:00:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/bridge-mobile",
  },
  {
    id: "nx-sora-content",
    title: "Content Strategy Associate",
    company: "Sora Learning",
    location: "Remote — India",
    remote: true,
    workMode: "remote",
    jobType: "part-time",
    experienceLevel: "entry",
    salaryMin: 30000,
    salaryMax: 50000,
    currency: "INR",
    description:
      "Shape clear, useful learning content for early-career professionals. You will research audience needs, create editorial briefs, review learning resources, and collaborate with product teams. Strong writing and analytical skills are essential.",
    skills: ["Content Strategy", "Research", "Writing", "SEO", "Analytics"],
    postedAt: "2026-08-20T07:30:00.000Z",
    source: "NEXORA demo network",
    applyUrl: "https://example.com/careers/sora-content",
  },
  ...EXPANDED_DEMO_JOBS,
];

const includesText = (value: string, needle: string) =>
  value.toLowerCase().includes(needle.toLowerCase());

export function filterDemoJobs(jobs: Job[], params: JobSearchParams): Job[] {
  const terms = (params.query ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  const result = jobs.filter(job => {
    const searchable = [
      job.title,
      job.company,
      job.location,
      job.description,
      ...job.skills,
    ]
      .join(" ")
      .toLowerCase();
    const satisfiesQuery = terms.every(term => searchable.includes(term));
    const satisfiesLocation =
      !params.location ||
      params.location === "Anywhere" ||
      includesText(job.location, params.location);
    const satisfiesSkills =
      !params.skills?.length ||
      params.skills.every(skill =>
        job.skills.some(item => includesText(item, skill))
      );
    const satisfiesMode =
      !params.workMode ||
      params.workMode === "any" ||
      job.workMode === params.workMode;
    const satisfiesType =
      !params.jobType ||
      params.jobType === "any" ||
      job.jobType === params.jobType;
    const satisfiesSeniority =
      !params.seniority ||
      params.seniority === "any" ||
      job.experienceLevel === params.seniority;
    const satisfiesSalary =
      !params.salaryMin || (job.salaryMax ?? 0) >= params.salaryMin;
    return (
      satisfiesQuery &&
      satisfiesLocation &&
      satisfiesSkills &&
      satisfiesMode &&
      satisfiesType &&
      satisfiesSeniority &&
      satisfiesSalary
    );
  });

  return [...result].sort((a, b) => {
    if (params.sort === "salary")
      return (b.salaryMax ?? 0) - (a.salaryMax ?? 0);
    if (params.sort === "newest")
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  });
}

export class DemoJobProvider implements JobProvider {
  async searchJobs(params: JobSearchParams): Promise<Job[]> {
    return filterDemoJobs(DEMO_JOBS, params);
  }

  async getJob(id: string): Promise<Job | null> {
    return DEMO_JOBS.find(job => job.id === id) ?? null;
  }
}
