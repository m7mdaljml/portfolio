export type Lang = "en" | "ar";

const translations = {
  en: {
    nav: {
      about: "About",
      skills: "Skills",
      experience: "Experience",
      achievements: "Achievements",
      education: "Education",
      contact: "Contact",
      github: "GitHub",
    },
    hero: {
      firstname: "Mohammad",
      lastname: "Aljamal",
      role: "Front-End Engineer",
      tagline:
        "Building scalable, high-performance web applications — one clean component at a time.",
      contactMe: "Contact Me",
      viewWork: "View Work",
      downloadCV: "Download CV",
    },
    about: {
      tag: "about",
      title: "Who I Am",
      bio1: "I'm a Front-End Engineer with over 2 years of professional experience specializing in Vue.js and TypeScript, building scalable and high-performance web applications.",
      bio1Highlight: ["Vue.js", "TypeScript"],
      bio2start: "My journey in tech extends beyond code — I served as ",
      bio2Chair: "Chairman of IEEE Computer Society",
      bio2mid: " at Mutah University, competed internationally in ",
      bio2acpc: "ACPC in Egypt",
      bio2end: ", and contributed as a core member of the ",
      bio2gdsc: "Google Developer Student Club",
      bio3: "I thrive on translating complex business requirements into elegant, responsive interfaces. Problem-solving isn't just what I do — it's how I think.",
      yearsExp: "Years Experience",
      companies: "Companies",
      competitions: "Competitions",
      funFactsTitle: "Fun Facts",
      funFactsSubtitle: "Things you didn't know about me",
    },
    skills: {
      tag: "skills",
      title: "Technical Arsenal",
      subtitle:
        "A comprehensive toolkit built through real-world projects, competitive programming, and continuous learning.",
      categories: [
        "Core Front-End",
        "API & Data Integration",
        "Backend & Programming",
        "Tools & Environment",
        "Professional Skills",
      ],
    },
    experience: {
      tag: "experience",
      title: "Professional Journey",
      current: "Current",
      jobs: [
        {
          company: "Cubes Solutions Inc",
          role: "Front-End Developer",
          period: "September 2024 – Present",
          location: "Jordan",
          description: [
            "Built and maintained scalable web applications using Vue.js and TypeScript",
            "Developed reusable UI components following best practices and design patterns",
            "Translated complex business requirements into responsive, user-friendly interfaces",
            "Collaborated with cross-functional teams to deliver high-quality products",
          ],
        },
        {
          company: "Anar Company",
          role: "Full Stack Web Developer",
          period: "August 2023 – March 2024",
          location: "Jordan",
          description: [
            "Refactored the company website, significantly improving UI/UX and performance",
            "Built a comprehensive admin control panel from scratch",
            "Implemented backend-driven data structures for efficient content management",
            "Optimized database queries and API endpoints for better performance",
          ],
        },
      ],
    },
    achievements: {
      tag: "achievements",
      title: "Leadership & Competitions",
      subtitle:
        "Beyond code, I've led communities, mentored peers, and competed on international stages.",
      items: [
        {
          title: "Technical Team Super Star - 2025",
          organization: "Cubes Solution Inc.",
          description:
            "Honored as the most outstanding technical team member, recognized for technical excellence, leadership, and significant contributions to the team's success.",
          year: "2025",
        },
        {
          title: "IEEE Computer Society Chairman",
          organization: "Mutah University Student Branch",
          description:
            "Led the IEEE CS chapter, organizing technical workshops, hackathons, and coding competitions. Grew membership by 40% and established partnerships with tech companies.",
          year: "2021-2022",
        },
        {
          title: "Core Team Member",
          organization: "Google Developer Student Club",
          description:
            "Contributed to organizing developer events, study jams, and solution challenges. Mentored junior developers in web development and best practices.",
          year: "2021-2022",
        },
        {
          title: "JCPC21 & JCPC22",
          organization: "Jordan Collegiate Programming Contest",
          description:
            "Competed in two consecutive years of Jordan's premier collegiate programming competition. Solved complex algorithmic problems under time pressure.",
          year: "2021-2022",
        },
        {
          title: "ACPC21",
          organization: "Arab Collegiate Programming Championship",
          description:
            "Represented Jordan in the Arab Collegiate Programming Championship held in Luxor, Egypt. Competed against top programmers from across the Arab world.",
          year: "2021",
        },
        {
          title: "IEEEXtreme 15.0",
          organization: "IEEE Global Competition",
          description:
            "24-hour global programming competition. Solved algorithmic challenges and competed with teams worldwide.",
          year: "2021",
        },
      ],
    },
    education: {
      tag: "education",
      title: "Academic Foundation",
      degree: "Bachelor of Computer Science",
      university: "Mutah University",
      years: "2019 – 2023",
      gpa: "GPA: 82.61 — Very Good",
      desc1:
        "Comprehensive curriculum covering data structures, algorithms, software engineering, web development, and database systems.",
      desc2:
        "Active in extracurricular activities including IEEE Computer Society leadership and competitive programming teams.",
    },
    contact: {
      tag: "contact",
      title: "Let's Build Something",
      subtitle:
        "Looking for a developer who combines technical excellence with leadership experience? Let's talk.",
      email: "Email",
      phone: "Phone",
      readyTitle: "Ready to Hire?",
      readyDesc:
        "I'm open to new opportunities and exciting projects. Whether you're looking for a front-end engineer or a technical leader, I'd love to hear from you.",
      sendEmail: "Send an Email",
      connectLinkedIn: "Connect on LinkedIn",
      form: {
        title: "Send Me a Message",
        subtitle:
          "Fill in the form below and I'll get back to you as soon as possible.",
        name: "Name",
        namePlaceholder: "Your name",
        email: "Email",
        emailPlaceholder: "you@example.com",
        message: "Message",
        messagePlaceholder: "Write your message here...",
        send: "Send Message",
        sending: "Sending...",
        nameRequired: "Please enter your name",
        emailInvalid: "Please enter a valid email address",
        messageRequired: "Please enter your message",
        success: "Message sent successfully! I'll get back to you soon.",
        error: "Failed to send the message. Please try again.",
      },
    },
    github: {
      tag: "github",
      title: "GitHub Projects",
      subtitle:
        "A selection of my public repositories — from web apps to competitive programming solutions.",
      viewAll: "View All on GitHub",
      loading: "Loading repositories...",
      error: "Could not load repositories.",
      stars: "Stars",
      forks: "Forks",
      noDesc: "No description provided.",
      updated: "Updated",
    },
    aiChat: {
      assistant: "Portfolio AI Assistant",
      online: "Online",
      startConversation: "Ask me about Mohammad",
      typeBelow:
        "I can answer questions about his CV, skills, experience, and projects",
      inputPlaceholder: "Ask about Mohammad...",
      send: "Send",
      delete: "Delete conversation",
      errorResponse:
        "Sorry, something went wrong while getting an answer. Please try again later.",
      noAnswerMessage:
        "I couldn't find an answer to this question. If you'd like Mohammad to contact you about it, please enter your email.",
      leaveEmail:
        "Leave your email below and Mohammad will get back to you about your question.",
      emailPlaceholder: "Your email address",
      emailInvalid: "Please enter a valid email address",
      emailSendError: "Failed to send the email. Please try again.",
      emailSentBody: (email: string) =>
        `Thanks! Mohammad will contact you at ${email}.`,
      sending: "Sending...",
      cancel: "Cancel",
      suggestions: [
        "What are his skills?",
        "Tell me about his experience",
        "How can I contact him?",
        "His GitHub projects?",
      ],
    },
  },

  ar: {
    nav: {
      about: "عن",
      skills: "المهارات",
      experience: "الخبرة",
      achievements: "الإنجازات",
      education: "التعليم",
      contact: "تواصل",
      github: "GitHub",
    },
    hero: {
      firstname: "محمد",
      lastname: "الجمل",
      role: "مهندس واجهات أمامية",
      tagline:
        "بناء تطبيقات ويب قابلة للتطوير وعالية الأداء — مكوّن نظيف في كل مرة.",
      contactMe: "تواصل معي",
      viewWork: "عرض الأعمال",
      downloadCV: "تحميل السيرة الذاتية",
    },
    about: {
      tag: "about",
      title: "من أنا",
      bio1: "أنا مهندس واجهات أمامية بخبرة مهنية تزيد على سنتين، متخصص في Vue.js وTypeScript، أبني تطبيقات ويب قابلة للتطوير وعالية الأداء.",
      bio1Highlight: ["Vue.js", "TypeScript"],
      bio2start: "رحلتي في التقنية تمتد إلى أبعد من الكود — شغلت منصب ",
      bio2Chair: "رئيس جمعية IEEE لعلوم الحاسوب",
      bio2mid: " في جامعة مؤتة، وتنافست دولياً في ",
      bio2acpc: "بطولة ACPC في مصر",
      bio2end: "، وأسهمت عضواً أساسياً في ",
      bio2gdsc: "نادي مطوري Google للطلاب",
      bio3: "أتميّز في ترجمة متطلبات الأعمال المعقدة إلى واجهات أنيقة ومتجاوبة. حل المشكلات ليس مجرد عمل أؤديه — بل طريقة تفكيري.",
      yearsExp: "سنوات الخبرة",
      companies: "شركات",
      competitions: "مسابقات",
      funFactsTitle: "حقائق ممتعة",
      funFactsSubtitle: "Things you didn't know about me",
    },
    skills: {
      tag: "skills",
      title: "الترسانة التقنية",
      subtitle:
        "مجموعة أدوات شاملة بُنيت عبر مشاريع حقيقية وبرمجة تنافسية وتعلّم مستمر.",
      categories: [
        "واجهات أمامية أساسية",
        "تكامل API والبيانات",
        "الخلفية والبرمجة",
        "الأدوات والبيئة",
        "المهارات المهنية",
      ],
    },
    experience: {
      tag: "experience",
      title: "المسيرة المهنية",
      current: "حالياً",
      jobs: [
        {
          company: "Cubes Solutions Inc",
          role: "مطور واجهات أمامية",
          period: "سبتمبر 2024 – الحاضر",
          location: "الأردن",
          description: [
            "بناء وصيانة تطبيقات ويب قابلة للتطوير باستخدام Vue.js وTypeScript",
            "تطوير مكونات UI قابلة لإعادة الاستخدام وفق أفضل الممارسات وأنماط التصميم",
            "ترجمة متطلبات الأعمال المعقدة إلى واجهات متجاوبة وسهلة الاستخدام",
            "التعاون مع فرق متعددة التخصصات لتسليم منتجات عالية الجودة",
          ],
        },
        {
          company: "Anar Company",
          role: "مطور ويب متكامل",
          period: "أغسطس 2023 – مارس 2024",
          location: "الأردن",
          description: [
            "إعادة هيكلة موقع الشركة مع تحسين ملحوظ في تجربة المستخدم والأداء",
            "بناء لوحة تحكم إدارية شاملة من الصفر",
            "تنفيذ هياكل بيانات مدفوعة من الخلفية لإدارة المحتوى بكفاءة",
            "تحسين استعلامات قاعدة البيانات ونقاط نهاية API للأداء الأفضل",
          ],
        },
      ],
    },
    achievements: {
      tag: "achievements",
      title: "القيادة والمسابقات",
      subtitle:
        "بعيداً عن الكود، قدت مجتمعات وأرشدت أقراني وتنافست على المسرح الدولي.",
      items: [
        {
          title: "نجم الفريق التقني - 2025",
          organization: "Cubes Solution Inc.",
          description:
            "تم تكريمي بلقب نجم الفريق التقني، كأفضل عضو تقني في الفريق، واثني على مساهماتي التقنية المتميزة والقيادة في إنجاح العديد من المشاريع",
          year: "2025",
        },
        {
          title: "رئيس جمعية IEEE لعلوم الحاسوب",
          organization: "فرع طلاب جامعة مؤتة",
          description:
            "قيادة فصل IEEE CS وتنظيم ورش عمل تقنية وهاكاثونات ومسابقات برمجية. زيادة العضوية بنسبة 40% وإقامة شراكات مع شركات تقنية.",
          year: "2021-2022",
        },
        {
          title: "عضو الفريق الأساسي",
          organization: "نادي مطوري Google للطلاب",
          description:
            "المساهمة في تنظيم فعاليات المطورين ودورات الدراسة وتحديات الحلول. إرشاد المطورين المبتدئين في تطوير الويب وأفضل الممارسات.",
          year: "2021-2022",
        },
        {
          title: "JCPC21 وJCPC22",
          organization: "مسابقة البرمجة الجامعية الأردنية",
          description:
            "التنافس في عامين متتاليين من المسابقة البرمجية الجامعية الأردنية الرائدة. حل مشكلات خوارزمية معقدة تحت ضغط الوقت.",
          year: "2021-2022",
        },
        {
          title: "ACPC21",
          organization: "بطولة البرمجة الجامعية العربية",
          description:
            "تمثيل الأردن في بطولة البرمجة الجامعية العربية المقامة في الأقصر، مصر. التنافس مع أفضل المبرمجين من أنحاء العالم العربي.",
          year: "2021",
        },
        {
          title: "IEEEXtreme 15.0",
          organization: "مسابقة IEEE العالمية",
          description:
            "مسابقة برمجة عالمية تمتد 24 ساعة. حل تحديات خوارزمية والتنافس مع فرق من حول العالم.",
          year: "2021",
        },
      ],
    },
    education: {
      tag: "education",
      title: "الأساس الأكاديمي",
      degree: "بكالوريوس علوم الحاسوب",
      university: "جامعة مؤتة",
      years: "2019 – 2023",
      gpa: "المعدل: 82.61 — جيد جداً",
      desc1:
        "منهج شامل يغطي هياكل البيانات والخوارزميات وهندسة البرمجيات وتطوير الويب وأنظمة قواعد البيانات.",
      desc2:
        "مشارك نشط في الأنشطة اللاصفية بما فيها قيادة جمعية IEEE لعلوم الحاسوب وفرق البرمجة التنافسية.",
    },
    contact: {
      tag: "contact",
      title: "لنبني شيئاً معاً",
      subtitle: "تبحث عن مطور يجمع بين التميز التقني وخبرة القيادة؟ تحدث معي.",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      readyTitle: "مستعد للتوظيف؟",
      readyDesc:
        "أنا منفتح على الفرص الجديدة والمشاريع المثيرة. سواء كنت تبحث عن مهندس واجهات أمامية أو قائد تقني، يسعدني التحدث معك.",
      sendEmail: "أرسل بريداً إلكترونياً",
      connectLinkedIn: "تواصل عبر LinkedIn",
      form: {
        title: "أرسل لي رسالة",
        subtitle: "املأ النموذج أدناه وسأعود إليك في أقرب وقت ممكن.",
        name: "الاسم",
        namePlaceholder: "اسمك",
        email: "البريد الإلكتروني",
        emailPlaceholder: "you@example.com",
        message: "الرسالة",
        messagePlaceholder: "اكتب رسالتك هنا...",
        send: "إرسال الرسالة",
        sending: "جارٍ الإرسال...",
        nameRequired: "يرجى إدخال اسمك",
        emailInvalid: "يرجى إدخال بريد إلكتروني صحيح",
        messageRequired: "يرجى إدخال رسالتك",
        success: "تم إرسال الرسالة بنجاح! سأتواصل معك قريباً.",
        error: "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.",
      },
    },
    github: {
      tag: "github",
      title: "مشاريع GitHub",
      subtitle:
        "مختارات من مستودعاتي العامة — من تطبيقات الويب إلى حلول البرمجة التنافسية.",
      viewAll: "عرض الكل على GitHub",
      loading: "جاري تحميل المستودعات...",
      error: "تعذّر تحميل المستودعات.",
      stars: "نجوم",
      forks: "تفرعات",
      noDesc: "لا يوجد وصف.",
      updated: "آخر تحديث",
    },
    aiChat: {
      assistant: "المساعد الذكي للموقع",
      online: "متصل",
      startConversation: "اسألني عن محمد",
      typeBelow:
        "يمكنني الإجابة عن أسئلة حول سيرته الذاتية ومهاراته وخبرته ومشاريعه",
      inputPlaceholder: "اسأل عن محمد...",
      send: "إرسال",
      delete: "حذف المحادثة",
      errorResponse:
        "عذراً، حدث خطأ أثناء جلب الرد. يرجى المحاولة مرة أخرى لاحقاً.",
      noAnswerMessage:
        "لم أجد إجابة لهذا السؤال. إذا كنت ترغب في أن يتواصل معك محمد، يرجى إدخال بريدك الإلكتروني.",
      leaveEmail: "اترك بريدك الإلكتروني أدناه وسيتواصل معك محمد بخصوص سؤالك.",
      emailPlaceholder: "بريدك الإلكتروني",
      emailInvalid: "يرجى إدخال بريد إلكتروني صحيح",
      emailSendError: "فشل إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى.",
      emailSentBody: (email: string) => `شكراً! سيتواصل معك محمد على ${email}.`,
      sending: "جارٍ الإرسال...",
      cancel: "إلغاء",
      suggestions: [
        "ما هي مهاراته؟",
        "حدثني عن خبرته",
        "كيف يمكنني التواصل معه؟",
        "مشاريعه على GitHub؟",
      ],
    },
  },
} as const;

export default translations;
