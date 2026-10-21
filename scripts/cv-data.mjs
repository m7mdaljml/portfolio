/**
 * Single source of truth for the ATS-optimized CV.
 *
 * Rules applied here (kept in code so every regeneration stays compliant):
 * - Standard section names: Summary, Skills, Experience, Projects, Education, Leadership, Languages.
 * - Reverse-chronological experience, no logos, no icons, no tables, no skill meters.
 * - Every bullet starts with a strong action verb and names concrete technologies.
 * - No invented metrics: only numbers that already exist in the portfolio content.
 */

export const cv = {
  meta: {
    fileName: "Mohammad-Aljamal-CV.pdf",
    title: "Mohammad Aljamal - Front-End Engineer - CV",
    author: "Mohammad Aljamal",
    subject: "Front-End Engineer CV | Vue.js, TypeScript, React",
    keywords:
      "Front-End Engineer, Vue.js, TypeScript, React, JavaScript, HTML, CSS, Tailwind CSS, Bootstrap, Pinia, REST API, Axios, Git, Vite, Node.js, PHP, MySQL, SQL",
  },

  contact: {
    name: "Mohammad Aljamal",
    headline: "Front-End Engineer",
    tagline: "Vue.js · TypeScript · React · Bootstrap",
    email: "mohammadaljamal121@gmail.com",
    phone: "+962 786 116 835",
    location: "Jordan",
    links: [
      {
        label: "LinkedIn",
        value: "linkedin.com/in/mohammad-aljamal1",
        url: "https://linkedin.com/in/mohammad-aljamal1",
      },
      {
        label: "GitHub",
        value: "github.com/M7mdaljml",
        url: "https://github.com/M7mdaljml",
      },
      {
        label: "Portfolio",
        value: "mohd-aljml.netlify.app",
        url: "https://mohd-aljml.netlify.app",
      },
    ],
  },

  summary:
    "Front-End Engineer with 2+ years of professional experience building scalable, responsive web applications with Vue.js, TypeScript and React. Builds reusable component-driven interfaces, integrates REST APIs and ships production features with backend and QA teams. Leadership background as IEEE Computer Society chapter chairman and competitor in international programming contests (ACPC21, JCPC21, JCPC22, IEEEXtreme 15.0).",

  skills: [
    {
      label: "Front-End",
      items:
        "Vue.js (3), React.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Responsive Design, Component Architecture, Tailwind CSS, Bootstrap",
    },
    {
      label: "State & Data",
      items:
        "Pinia, REST APIs, Axios, Swagger / OpenAPI, Asynchronous Data Flow",
    },
    {
      label: "Backend & Languages",
      items: "PHP, MySQL, SQL (SQLite), C++",
    },
    {
      label: "Tools & Environment",
      items:
        "Git, GitHub, Vite, Node.js, Tauri, Swagger UI, Apache, Microsoft Office",
    },
    {
      label: "Professional",
      items:
        "Problem Solving, Code Refactoring, Cross-Team Collaboration, Time Management, Technical Documentation, Presentation",
    },
  ],

  experience: [
    {
      role: "Front-End Engineer",
      company: "Cubes Solutions Inc",
      meta: "Sep 2024 – Present · Jordan",
      bullets: [
        "Develop and maintain scalable web applications with Vue.js and TypeScript, delivering production features end to end.",
        "Build reusable UI components following design patterns and best practices, keeping interfaces consistent across features and reducing duplicated code.",
        "Translate complex business requirements into responsive, user-friendly interfaces across desktop and mobile breakpoints.",
        "Integrate REST APIs with Axios and handle asynchronous loading, validation and error states for data-driven features.",
        "Collaborate with backend engineers and QA to deliver features, review code and resolve production issues.",
        "Recognised as “Technical Team Super Star” (2025) for technical excellence, leadership and contributions to the team's success.",
      ],
    },
    // {
    //   role: "Full Stack Web Developer",
    //   company: "Anar Company",
    //   meta: "Aug 2023 – Mar 2024 · Jordan",
    //   bullets: [
    //     "Refactored and modernised the company website, improving UI/UX and aligning it with current design standards.",
    //     "Built a complete admin control panel from scratch for dynamic content management.",
    //     "Implemented backend-driven data structures to support scalable content management.",
    //     "Optimised database queries and API endpoints for faster page response and smoother data handling.",
    //     "Worked across the stack with PHP and MySQL to deliver end-to-end features for internal and public users.",
    //   ],
    // },
    // {
    //   role: "Research Assistant Programmer",
    //   company: "Zayed University, Abu Dhabi (UAE)",
    //   meta: "Mar 2022 – Mar 2023",
    //   bullets: [
    //     "Conducted research and analysis on interactive systems designed for people with special needs.",
    //   ],
    // },
  ],

  // projects: [
  //   {
  //     name: "Store POS — Offline Point-of-Sale Desktop App",
  //     meta: "Vue.js, TypeScript, Tauri 2, SQLite, Pinia, Bootstrap, Chart.js",
  //     link: {
  //       label: "github.com/M7mdaljml/Store-POS",
  //       url: "https://github.com/M7mdaljml/Store-POS",
  //     },
  //     bullets: [
  //       "Built a fully offline point-of-sale desktop application for small retail stores and markets; data stays on the local machine with no server dependency.",
  //       "Implemented fast checkout with barcode/scan search, split payments and hold-and-resume bills.",
  //       "Managed inventory, categories, suppliers, purchases, stock movements and customer credit ledgers with balances and payments.",
  //       "Added cashier sessions with opening/closing cash and variance tracking, plus revenue, top-product and margin reports with Excel export, backup and restore.",
  //       "Delivered a bilingual (English / Arabic) interface with RTL support, dark and light themes and role-based permissions for admins and cashiers.",
  //     ],
  //   },
  //   {
  //     name: "Personal Portfolio with AI Assistant",
  //     meta: "React, TypeScript, Tailwind CSS, Vite, Firebase, Groq API",
  //     link: {
  //       label: "mohd-aljml.netlify.app",
  //       url: "https://mohd-aljml.netlify.app",
  //     },
  //     bullets: [
  //       "Built a bilingual (English / Arabic with full RTL) portfolio with light and dark themes, live project previews and a deployable GitHub showcase.",
  //       "Added a password-protected admin dashboard with Firebase-backed content management, per-section editors, visitor analytics and a typed bilingual content store.",
  //       "Implemented an AI chat assistant that answers questions about CV, skills, projects and experience from a maintained knowledge base.",
  //     ],
  //   },
  //   {
  //     name: "SKGT Company Website",
  //     meta: "Vue.js, TypeScript, Bootstrap, Axios, Vite",
  //     link: { label: "skgt.ae", url: "https://skgt.ae" },
  //     bullets: [
  //       "Delivered a fully responsive company website together with an admin dashboard for content management.",
  //       "Integrated REST APIs with Axios and built reusable responsive sections to keep content updates consistent.",
  //     ],
  //   },
  //   {
  //     name: "Visca Cup — Sports Quiz Application",
  //     meta: "Vue.js, TypeScript, Bootstrap, Axios, Vite",
  //     link: {
  //       label: "visca-cup.netlify.app",
  //       url: "https://visca-cup.netlify.app",
  //     },
  //     bullets: [
  //       "Built a sports quiz application with randomised question sets, live scoring and a highest-score leaderboard.",
  //     ],
  //   },
  // ],

  education: {
    degree: "Bachelor of Computer Science",
    school: "Mutah University, Jordan",
    meta: "2019 – 2023 · GPA 82.61 / 100 (Very Good)",
    details:
      "Coursework: Data Structures & Algorithms, Software Engineering, Web Development, Database Systems.",
  },

  leadership: [
    {
      title: "Technical Team Super Star",
      org: "Cubes Solutions Inc.",
      year: "2025",
      text: "Named the most outstanding technical team member for technical excellence, leadership and significant contributions to the team's success.",
    },
    {
      title: "Chairman, IEEE Computer Society",
      org: "Mutah University Student Branch",
      year: "2021 – 2022",
      text: "Led the chapter, organising technical workshops, hackathons and coding competitions; grew membership by 40% and established partnerships with tech companies.",
    },
    {
      title: "Core Team Member, Google Developer Student Clubs",
      org: "Google Developer Student Club",
      year: "2021 – 2022",
      text: "Organised developer events, study jams and solution challenges, and mentored junior developers in web development and best practices.",
    },
    {
      title: "ACPC21 — Arab Collegiate Programming Championship",
      org: "Luxor, Egypt",
      year: "2021",
      text: "Represented Jordan in the Arab collegiate programming championship, competing against top programmers from across the Arab world.",
    },
    {
      title: "JCPC21 & JCPC22 — Jordan Collegiate Programming Contest",
      org: "Jordan",
      year: "2021 – 2022",
      text: "Competed in two consecutive editions of Jordan's premier collegiate programming contest, solving complex algorithmic problems under time pressure.",
    },
    {
      title: "IEEEXtreme 15.0 — IEEE Global Programming Competition",
      org: "Global",
      year: "2021",
      text: "Competed in a 24-hour global programming challenge, solving algorithmic problems against teams from around the world.",
    },
  ],

  languages: [
    { name: "Arabic", level: "Native" },
    { name: "English", level: "Very Good" },
  ],
};
