import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  ClipboardCheck,
  Handshake,
  Rocket,
  Users,
} from "lucide-react";

const translations = {
  en: {
    nav: {
      solutions: "Solutions",
      teams: "For Teams",
      about: "About Us",
      login: "Login",
      started: "Get started free",
    },
    heading1: "One AI Platform for the Full HR Lifecycle.",
    heading2: "Save up to 20 Hours Every Week.",
    subheading:
      "AdaptAI automates recruitment, onboarding, learning, and HR analytics in one system, replacing up to five disconnected services.",
    cta: "Start 14-Day Free Trial",
    tabs: {
      analyse: "Recruitment",
      train: "Onboarding",
      testing: "Learning",
      deploy: "Analytics",
      sales: "Sales",
      tasks: "Tasks",
    },
    overlays: {
      analyse: {
        title: "AI Recruitment Engine",
        subtitle: "Bias-free screening + WhatsApp testing",
        steps: [
          "1. Parse CVs and hard/soft skills",
          "2. Auto-reject candidates below 40% match",
          "3. Send tests for candidates above 80% match",
          "4. Run AI video interview with transcript",
        ],
      },
      train: {
        title: "AI Onboarding Module",
        subtitle: "Adaptation turned into a measurable process",
        metrics: ["Tasks and deadlines", "Document checks", "Surveys and pulse feedback", "Progress tracking"],
      },
      testing: {
        title: "AI Learning & Development",
        status: "Live",
        passed: "Upload courses and generate AI tests instantly",
        metrics: ["Video-based modules", "Knowledge checks", "Skill-gap tracking", "Personalized learning paths"],
      },
      deploy: {
        title: "Centralized HR Analytics",
        checklist: [
          "Hiring funnel transparency",
          "Onboarding performance by team",
          "Learning and engagement insights",
          "Data-driven HR decisions in real time",
        ],
        button: "View Dashboard",
      },
      sales: {
        title: "Sales Funnel Module",
        subtitle: "Track leads and deals by stage",
        metrics: [
          "Pipeline by stages and owners",
          "Quick lead and stage creation",
          "Filters, documents, and search",
          "Conversion and progress insights",
        ],
      },
      tasks: {
        title: "Task Management Module",
        subtitle: "Create, assign and control task execution",
        metrics: [
          "Statuses: To Do, In Progress, Done, Canceled",
          "Fast task creation and editing",
          "Search and filters for workflows",
          "Team visibility on performance",
        ],
      },
    },
  },
  ru: {
    nav: {
      solutions: "Решения",
      teams: "Для команд",
      about: "О нас",
      login: "Вход",
      started: "Начать бесплатно",
    },
    heading1: "AI платформа полного бизнес цикла",
    heading2: "Найм, адаптация, продажи, задачи, аналитика для CEO - в одной платформе.",
    subheading: "",
    cta: "Начать 14-дневный бесплатный тест",
    tabs: {
      analyse: "Рекрутинг",
      train: "Онбординг",
      testing: "Обучение",
      deploy: "Аналитика",
      sales: "Продажи",
      tasks: "Задачи",
    },
    overlays: {
      analyse: {
        title: "AI-система рекрутинга",
        subtitle: "Скрининг без bias + тесты в WhatsApp",
        steps: [
          "1. Анализ резюме и hard/soft skills",
          "2. Автоотклонение кандидатов ниже 40%",
          "3. Тестирование кандидатов выше 80%",
          "4. AI-видеоинтервью с транскрипцией",
        ],
      },
      train: {
        title: "AI-модуль онбординга",
        subtitle: "Адаптация сотрудников как измеримый процесс",
        metrics: ["Задачи и дедлайны", "Проверка документов", "Опросы и обратная связь", "Трекинг прогресса"],
      },
      testing: {
        title: "AI Learning & Development",
        status: "Активно",
        passed: "Загружайте курсы и создавайте AI-тесты за минуты",
        metrics: ["Видеомодули", "Проверка знаний", "Оценка skill-gap", "Персональные треки развития"],
      },
      deploy: {
        title: "Централизованная HR-аналитика",
        checklist: [
          "Прозрачная воронка найма",
          "Эффективность адаптации по командам",
          "Инсайты по обучению и вовлеченности",
          "Data-driven решения в реальном времени",
        ],
        button: "Смотреть дашборд",
      },
      sales: {
        title: "Модуль продаж",
        subtitle: "Контроль лидов и сделок по этапам",
        metrics: [
          "Воронка продаж по этапам и ответственным",
          "Быстрое добавление этапов и лидов",
          "Фильтры, документы и поиск",
          "Аналитика конверсии и прогресса",
        ],
      },
      tasks: {
        title: "Модуль задач",
        subtitle: "Постановка, контроль и выполнение задач",
        metrics: [
          "Статусы: к выполнению, в работе, выполнено, отменено",
          "Быстрое создание и редактирование задач",
          "Поиск и фильтрация по процессам",
          "Прозрачность загрузки команды",
        ],
      },
    },
  },
  kz: {
    nav: {
      solutions: "Шешімдер",
      teams: "Командаларға",
      about: "Біз туралы",
      login: "Кіру",
      started: "Тегін бастау",
    },
    heading1: "Толық HR цикліне арналған бірыңғай AI платформа.",
    heading2: "Аптасына 20 сағатқа дейін үнемдеңіз.",
    subheading:
      "AdaptAI рекрутинг, онбординг, оқу және HR аналитиканы бір жүйеде автоматтандырып, беске дейін бөлек сервисті алмастырады.",
    cta: "14 күндік тегін сынақты бастау",
    tabs: {
      analyse: "Рекрутинг",
      train: "Онбординг",
      testing: "Оқыту",
      deploy: "Аналитика",
      sales: "Сатылым",
      tasks: "Тапсырмалар",
    },
    overlays: {
      analyse: {
        title: "AI рекрутинг жүйесі",
        subtitle: "Bias-сыз скрининг + WhatsApp тестілеу",
        steps: [
          "1. Резюме және hard/soft skills талдау",
          "2. 40%-дан төмен кандидаттарды авто-бас тарту",
          "3. 80%-дан жоғары кандидаттарға тест жіберу",
          "4. Транскрипциясы бар AI видео сұхбат",
        ],
      },
      train: {
        title: "AI онбординг модулі",
        subtitle: "Бейімдеуді өлшенетін процеске айналдырады",
        metrics: ["Тапсырмалар мен дедлайндар", "Құжаттарды тексеру", "Сауалнама және кері байланыс", "Прогресс трекингі"],
      },
      testing: {
        title: "AI Learning & Development",
        status: "Белсенді",
        passed: "Курстарды жүктеп, AI тесттерді бірден жасаңыз",
        metrics: ["Видео модульдер", "Білім тексеру", "Skill-gap бағалау", "Жеке даму тректері"],
      },
      deploy: {
        title: "Орталықтандырылған HR аналитика",
        checklist: [
          "Жалдау воронкасының ашықтығы",
          "Команда бойынша бейімдеу тиімділігі",
          "Оқу және engagement инсайттары",
          "Нақты уақыттағы data-driven шешімдер",
        ],
        button: "Дашбордты көру",
      },
      sales: {
        title: "Сатылым модулі",
        subtitle: "Лидтер мен мәмілелерді кезең бойынша бақылау",
        metrics: [
          "Кезеңдер мен жауаптылар бойынша воронка",
          "Кезеңдер мен лидтерді жылдам қосу",
          "Фильтрлер, құжаттар және іздеу",
          "Конверсия мен прогресс аналитикасы",
        ],
      },
      tasks: {
        title: "Тапсырмалар модулі",
        subtitle: "Тапсырмаларды қою, бақылау және орындау",
        metrics: [
          "Күйлер: орындалуда, жұмыста, орындалды, тоқтатылды",
          "Тапсырмаларды жылдам құру және өңдеу",
          "Процестер бойынша іздеу және фильтр",
          "Команда жүктемесінің ашықтығы",
        ],
      },
    },
  },
};

const pricingPlans = [
  {
    name: "Base",
    min: 1,
    max: 20,
    employees: "до 20 сотрудников",
    monthlyPrice: "9 990 ₸/мес",
    yearlyPrice: "99 900 ₸/год",
    note: "",
    points: [
      "Все базовые модули: рекрутинг (до 200 резюме), адаптация, обучение, AI-ассистент, аналитика.",
      "Поддержка в чате.",
      "Цель: воронка -> привыкание к платформе -> рост -> переход на платный тариф или кастомные доработки.",
    ],
  },
  {
    name: "Growth",
    min: 21,
    max: 50,
    employees: "до 50 сотрудников",
    monthlyPrice: "99 000 ₸/мес",
    yearlyPrice: "990 000 ₸/год",
    note: "Стоимость на сотрудника: 1 980 ₸",
    points: ["Все модули платформы.", "Рекрутинг (до 1000 резюме), расширенная аналитика.", "Поддержка в чате."],
  },
  {
    name: "Scale",
    min: 51,
    max: 100,
    employees: "до 100 сотрудников",
    monthlyPrice: "199 000 ₸/мес",
    yearlyPrice: "1 990 000 ₸/год",
    note: "Стоимость на сотрудника: 1 990 ₸",
    points: ["Все модули платформы, рекрутинг (до 3000 резюме).", "Приоритетная поддержка.", "Помощь в настройке процессов."],
    featured: true,
  },
  {
    name: "Advanced",
    min: 101,
    max: 300,
    employees: "до 300 сотрудников",
    monthlyPrice: "349 000 ₸/мес",
    yearlyPrice: "3 490 000 ₸/год",
    note: "Стоимость на сотрудника: 1 163 ₸",
    points: [
      "Все модули платформы, рекрутинг (до 10 000 резюме).",
      "Выделенный менеджер.",
      "Настройка воронки и онбординг-треков, приоритетная поддержка.",
    ],
  },
  {
    name: "Enterprise",
    min: 301,
    max: Infinity,
    employees: "300+ сотрудников",
    monthlyPrice: "Cloud: от 499 000 ₸/мес (+1000 ₸ за каждого сотрудника)",
    yearlyPrice: "Cloud: индивидуально",
    note: "On premise: индивидуально",
    points: [
      "Все модули платформы. Рекрутинг (индивидуально).",
      "Интеграции с внутренними системами.",
      "Полная кастомизация под бизнес-процессы, выделенная поддержка и персональный онбординг.",
      "SLA и индивидуальные условия.",
    ],
  },
];

const additionalServices = [
  { name: "Кастомные доработки", price: "от 200 000 ₸ за проект" },
  { name: "Внедрение под ключ", price: "от 300 000 ₸ разово" },
  { name: "Интеграции", price: "от 150 000 ₸ за систему" },
];

const partnerLogos = [
  { src: "/partners/eurasian-university.png", alt: "Евразийский национальный университет" },
  { src: "/partners/astana-hub.png", alt: "Astana Hub" },
  { src: "/partners/sdu.png", alt: "SDU University" },
  { src: "/partners/alatau-hub.png", alt: "Alatau Hub" },
  { src: "/partners/central-asia-pipes.png", alt: "Central Asia Pipes" },
];

const faqItems = [
  {
    question: "Что входит в 14-дневный бесплатный тест?",
    answer:
      "Во время тестового периода вы получаете доступ ко всем ключевым модулям платформы без ограничений, чтобы проверить рекрутинг, онбординг, обучение и аналитику в реальных процессах.",
  },
  {
    question: "Можно ли интегрировать AdaptAI с нашей CRM и HRM-системой?",
    answer:
      "Да. Для крупных клиентов доступны интеграции с внутренними системами и кастомная настройка процессов, включая обмен данными и автоматизацию сценариев.",
  },
  {
    question: "Как рассчитывается тариф для нашей компании?",
    answer:
      "Тариф зависит от количества сотрудников и выбранного пакета. Вы можете переключать ежемесячную и годовую оплату и выбрать подходящий план под масштаб команды.",
  },
  {
    question: "Есть ли поддержка и сопровождение после запуска?",
    answer:
      "Да. Поддержка доступна на всех тарифах: от чата на базовых пакетах до приоритетного сопровождения, выделенного менеджера и персонального онбординга на старших пакетах.",
  },
];

function getRecommendedPlan(teamSize) {
  return pricingPlans.find((plan) => teamSize >= plan.min && teamSize <= plan.max) ?? pricingPlans[2];
}

function OverlayCard({ activeTab, t }) {
  if (activeTab === "analyse") {
    return (
      <div className="absolute left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/95 p-5 shadow-2xl backdrop-blur animate-slide-up-overlay">
        <h3 className="text-lg font-semibold text-black">{t.overlays.analyse.title}</h3>
        <p className="mt-1 text-sm text-gray-600">{t.overlays.analyse.subtitle}</p>
        <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
          <div className="h-full w-1/4 rounded-full bg-purple-500" />
        </div>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          {t.overlays.analyse.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (activeTab === "train") {
    return (
      <div className="absolute left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/95 p-5 shadow-2xl backdrop-blur animate-slide-up-overlay">
        <h3 className="text-lg font-semibold text-black">{t.overlays.train.title}</h3>
        <p className="mt-1 text-sm text-gray-600">{t.overlays.train.subtitle}</p>
        <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
          <div className="h-full w-2/3 rounded-full bg-orange-500" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          {t.overlays.train.metrics.map((metric) => (
            <div key={metric} className="rounded-lg bg-gray-100 p-3">
              {metric}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === "testing") {
    return (
      <div className="absolute left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/95 p-5 shadow-2xl backdrop-blur animate-slide-up-overlay">
        <h3 className="text-lg font-semibold text-black">{t.overlays.testing.title}</h3>
        <div className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
          {t.overlays.testing.status}
        </div>
        <p className="mt-3 text-sm text-gray-700">{t.overlays.testing.passed}</p>
        <div className="mt-4 space-y-2 text-sm text-gray-700">
          {t.overlays.testing.metrics.map((metric) => (
            <div key={metric} className="rounded-lg bg-gray-100 p-3">
              {metric}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === "sales") {
    return (
      <div className="absolute left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/95 p-5 shadow-2xl backdrop-blur animate-slide-up-overlay">
        <h3 className="text-lg font-semibold text-black">{t.overlays.sales.title}</h3>
        <p className="mt-1 text-sm text-gray-600">{t.overlays.sales.subtitle}</p>
        <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
          <div className="h-full w-[58%] rounded-full bg-[#08b7cf]" />
        </div>
        <div className="mt-4 space-y-2 text-sm text-gray-700">
          {t.overlays.sales.metrics.map((metric) => (
            <div key={metric} className="rounded-lg bg-gray-100 p-3">
              {metric}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === "tasks") {
    return (
      <div className="absolute left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/95 p-5 shadow-2xl backdrop-blur animate-slide-up-overlay">
        <h3 className="text-lg font-semibold text-black">{t.overlays.tasks.title}</h3>
        <p className="mt-1 text-sm text-gray-600">{t.overlays.tasks.subtitle}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <span className="rounded-full bg-gray-100 px-2 py-1 text-center">To Do</span>
          <span className="rounded-full bg-yellow-100 px-2 py-1 text-center">In Progress</span>
          <span className="rounded-full bg-green-100 px-2 py-1 text-center">Done</span>
          <span className="rounded-full bg-red-100 px-2 py-1 text-center">Canceled</span>
        </div>
        <div className="mt-4 space-y-2 text-sm text-gray-700">
          {t.overlays.tasks.metrics.map((metric) => (
            <div key={metric} className="rounded-lg bg-gray-100 p-3">
              {metric}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/95 p-5 shadow-2xl backdrop-blur animate-slide-up-overlay">
      <h3 className="text-lg font-semibold text-black">{t.overlays.deploy.title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        {t.overlays.deploy.checklist.map((item) => (
          <li key={item} className="rounded-lg bg-gray-100 p-3">
            {item}
          </li>
        ))}
      </ul>
      <button className="mt-4 rounded-full bg-[#08b7cf] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#079fb3]">
        {t.overlays.deploy.button}
      </button>
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState("ru");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("analyse");
  const [teamSize, setTeamSize] = useState(75);
  const [selectedPlan, setSelectedPlan] = useState("Scale");
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [pauseModulesAutoplay, setPauseModulesAutoplay] = useState(false);
  const [pausePricingAutoplay, setPausePricingAutoplay] = useState(false);
  const videoRef = useRef(null);
  const pricingVideoRef = useRef(null);
  const languageMenuRef = useRef(null);
  const t = translations[language];
  const tabs = [
    { id: "analyse", label: t.tabs.analyse, icon: BarChart3 },
    { id: "train", label: t.tabs.train, icon: BookOpen },
    { id: "testing", label: t.tabs.testing, icon: Users },
    { id: "deploy", label: t.tabs.deploy, icon: Rocket },
    { id: "sales", label: t.tabs.sales, icon: Handshake },
    { id: "tasks", label: t.tabs.tasks, icon: ClipboardCheck },
  ];
  const recommendedPlan = getRecommendedPlan(teamSize);
  const currentPlan = pricingPlans.find((plan) => plan.name === selectedPlan) ?? pricingPlans[0];
  const currentPlanIndex = pricingPlans.findIndex((plan) => plan.name === selectedPlan);

  useEffect(() => {
    if (pauseModulesAutoplay) return undefined;

    const interval = setInterval(() => {
      setActiveTab((current) => {
        const currentIndex = tabs.findIndex((tab) => tab.id === current);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex].id;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [pauseModulesAutoplay, tabs]);

  useEffect(() => {
    if (pausePricingAutoplay) return undefined;

    const interval = setInterval(() => {
      setSelectedPlan((current) => {
        const currentIndex = pricingPlans.findIndex((plan) => plan.name === current);
        const nextIndex = (currentIndex + 1) % pricingPlans.length;
        return pricingPlans[nextIndex].name;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [pausePricingAutoplay]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const hlsUrl = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260417_061226_74f0749c-a22d-42b3-895e-5d6203bc741c.mp4";

    if (!video) return;

    if (video.canPlayType("video/mp4")) {
      video.src = hlsUrl;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    }
  }, []);

  useEffect(() => {
    const video = pricingVideoRef.current;
    const hlsUrl = "https://stream.mux.com/r6pXRAJb3005XEEbl1hYU1x01RFJDSn7KQApwNGgAHHbU.m3u8";

    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    }
  }, []);

  return (
    <div className="relative bg-white min-h-screen">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[980px] overflow-hidden">
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-white/45" />
      </div>

      <header className="relative">
        <nav
          className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto animate-fade-in-up backdrop-blur-md bg-white/65"
          style={{ opacity: 0, animationDelay: "0.1s" }}
        >
          <div className="flex items-center gap-2">
            <img src="/adaptai-logo.png" alt="AdaptAI logo" className="h-7 w-7 object-contain" />
            <span className="text-lg font-semibold text-black">AdaptAI</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#modules" className="text-sm text-gray-700 hover:text-black transition-colors">
              Модули платформы
            </a>
            <a href="#pricing" className="text-sm text-gray-700 hover:text-black transition-colors">
              Тарифы
            </a>
            <a href="#about" className="text-sm text-gray-700 hover:text-black transition-colors">
              Видео о продукте
            </a>
            <a href="#faq" className="text-sm text-gray-700 hover:text-black transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={languageMenuRef}>
              <button
                onClick={() => setIsLangMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:text-black"
                aria-haspopup="menu"
                aria-expanded={isLangMenuOpen}
              >
                {language.toUpperCase()}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isLangMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-24 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
                  {["ru", "en", "kz"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangMenuOpen(false);
                      }}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                        language === lang
                          ? "bg-[#08b7cf] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <a href="#" className="text-sm text-gray-700 hover:text-black transition-colors">
              {t.nav.login}
            </a>
            <button className="bg-[#08b7cf] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#079fb3] transition-colors">
              {t.nav.started}
            </button>
          </div>
        </nav>
      </header>

      <main className="relative z-10 px-6 pt-14 md:pt-16 pb-32 max-w-7xl mx-auto text-center">
        <h1
          className="mx-auto max-w-5xl text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight mb-5 animate-fade-in-up"
          style={{ opacity: 0, animationDelay: "0.2s" }}
        >
          <span className="block">{t.heading1}</span>
          <span className="block text-[0.5em] leading-[1.12] bg-gradient-to-r from-black via-gray-500 to-gray-400 bg-clip-text text-transparent">
            {t.heading2}
          </span>
        </h1>

        {t.subheading && (
          <p
            className="text-lg md:text-xl leading-relaxed text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in-up"
            style={{ opacity: 0, animationDelay: "0.3s" }}
          >
            {t.subheading}
          </p>
        )}

        <button
          className="bg-black text-white px-8 py-3 rounded-full text-base font-medium transition-colors mb-10 animate-fade-in-up"
          style={{ opacity: 0, animationDelay: "0.4s" }}
        >
          {t.cta}
        </button>

        <div
          id="modules"
          onMouseEnter={() => setPauseModulesAutoplay(true)}
          onMouseLeave={() => setPauseModulesAutoplay(false)}
        >
          <div
            className="mx-auto w-full max-w-5xl rounded-lg bg-gray-100 p-1 animate-fade-in-up"
            style={{ opacity: 0, animationDelay: "0.5s" }}
          >
            <div className="grid grid-cols-2 gap-1 md:hidden">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-2 rounded-md px-3 py-3 text-sm transition-colors ${
                      isActive ? "bg-white text-black shadow-sm" : "text-gray-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="hidden md:flex items-center justify-between gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <div key={tab.id} className="flex-1">
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex w-full items-center justify-center gap-2 rounded-md px-3 py-3 text-sm transition-colors ${
                        isActive ? "bg-white text-black shadow-sm" : "text-gray-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="mt-8 relative rounded-3xl overflow-hidden h-[400px] md:h-[500px] animate-fade-in-up"
            style={{ opacity: 0, animationDelay: "0.6s" }}
          >
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            <div key={activeTab} className="absolute inset-0 animate-fade-in-overlay">
              <OverlayCard activeTab={activeTab} t={t} />
            </div>
          </div>
        </div>

        <section
          id="partners"
          className="mt-8 mb-2 animate-fade-in-up"
          style={{ opacity: 0, animationDelay: "0.65s" }}
        >
          <div className="relative overflow-hidden py-3">
            <div className="marquee-track">
              {[...partnerLogos, ...partnerLogos].map((logo, index) => (
                <div
                  key={`${logo.alt}-${index}`}
                  className="mx-2 flex h-16 min-w-[180px] items-center justify-center px-4"
                >
                  <img src={logo.src} alt={logo.alt} className="max-h-12 w-auto object-contain" />
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent" />
          </div>
        </section>

        <section
          id="pricing"
          className="mt-16 rounded-3xl border border-gray-200 bg-white p-5 md:p-8 text-left animate-fade-in-up"
          style={{ opacity: 0, animationDelay: "0.7s" }}
        >
          <div className="mx-auto max-w-6xl grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 md:p-6">
              <h2 className="text-3xl md:text-4xl font-semibold text-black">14 дней бесплатного теста</h2>
              <p className="mt-3 max-w-xl text-gray-600">
                Протестируйте платформу без ограничений, затем выберите масштаб по размеру команды.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <span className={`text-sm ${!isYearly ? "text-black" : "text-gray-500"}`}>Ежемесячно</span>
                <button
                  onClick={() => setIsYearly((prev) => !prev)}
                  className="relative h-7 w-14 rounded-full bg-black/90 p-1"
                  aria-label="Переключить режим оплаты"
                >
                  <span
                    className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                      isYearly ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className={`text-sm ${isYearly ? "text-black" : "text-gray-500"}`}>Годовой</span>
              </div>

              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 md:p-5 text-left">
                <h3 className="text-xl font-semibold text-black">Дополнительные услуги</h3>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  {additionalServices.map((service) => (
                    <div key={service.name} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="mt-1 text-sm font-medium text-gray-700">{service.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-2xl border border-gray-200 min-h-[430px]"
              onMouseEnter={() => setPausePricingAutoplay(true)}
              onMouseLeave={() => setPausePricingAutoplay(false)}
            >
              <video
                ref={pricingVideoRef}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/15" />
              <div className="relative z-10 flex h-full flex-col p-4 md:p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-white">Пакеты</p>
                <div className="mt-3">
                  <article
                    key={currentPlan.name}
                    className="w-full rounded-xl border border-white/30 bg-black/40 p-4 text-left shadow-lg backdrop-blur-[1px] animate-fade-in-up"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-2xl font-semibold text-white">{currentPlan.name}</span>
                      {recommendedPlan.name === currentPlan.name && (
                        <span className="rounded-full bg-black px-2 py-1 text-[10px] font-semibold text-white">
                          Рекомендуем
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-white/80">{currentPlan.employees}</p>
                    <p className="mt-3 text-lg font-semibold text-white break-words">
                      {isYearly ? currentPlan.yearlyPrice : currentPlan.monthlyPrice}
                    </p>
                  </article>

                  <div className="mt-4 rounded-xl border border-white/20 bg-black/30 p-3 text-left">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-white/80">
                      Условия подписки
                    </p>
                    {currentPlan.note && !currentPlan.note.toLowerCase().includes("стоимость на сотрудника") && (
                      <p className="mt-2 text-xs text-[#7cf0ff]">{currentPlan.note}</p>
                    )}
                    <ul className="mt-2 space-y-1.5 text-xs text-white/85">
                      {currentPlan.points.map((point) => (
                        <li key={point}>• {point}</li>
                      ))}
                    </ul>
                  </div>

                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {pricingPlans.map((plan, index) => (
                      <button
                        key={plan.name}
                        onClick={() => setSelectedPlan(plan.name)}
                        aria-label={`Показать пакет ${plan.name}`}
                        className={`h-2.5 w-2.5 rounded-full transition-colors ${
                          index === currentPlanIndex ? "bg-white" : "bg-white/55 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const prevIndex =
                          currentPlanIndex <= 0 ? pricingPlans.length - 1 : currentPlanIndex - 1;
                        setSelectedPlan(pricingPlans[prevIndex].name);
                      }}
                      className="rounded-full border border-white/40 bg-black/30 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-black/45"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => {
                        const nextIndex = (currentPlanIndex + 1) % pricingPlans.length;
                        setSelectedPlan(pricingPlans[nextIndex].name);
                      }}
                      className="rounded-full border border-white/40 bg-black/30 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-black/45"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        <section
          id="about"
          className="mt-16 rounded-3xl px-4 py-8 md:px-8 md:py-10 animate-fade-in-up"
          style={{ opacity: 0, animationDelay: "0.8s" }}
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-medium text-black">Узнайте больше об AdaptAI</h2>
            <p className="mt-3 text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
            Посмотрите видео презентацию платформы и узнайте, как AdaptAI трансформирует бизнес процессы.
            </p>
            <div className="mt-6 mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/80 shadow-sm">
              <div className="relative w-full pb-[56.25%]">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube.com/embed/NG5hrOvnOrg"
                  title="Узнайте больше об AdaptAI"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="mt-16 bg-white p-5 md:p-8 text-left animate-fade-in-up"
          style={{ opacity: 0, animationDelay: "0.9s" }}
        >
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-semibold text-black text-center md:text-left">FAQ</h2>
            <p className="mt-3 text-gray-600 text-center md:text-left">
              Частые вопросы о платформе, тарифах и внедрении AdaptAI.
            </p>

            <div className="mt-6 space-y-3">
              {faqItems.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={item.question} className="rounded-2xl border border-gray-200 bg-gray-50">
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                    >
                      <span className="text-base md:text-lg font-medium text-black">{item.question}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-sm md:text-base text-gray-700 leading-relaxed">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <footer
          id="contacts"
          className="mt-12 mb-4 border-t border-gray-200 pt-8 text-left animate-fade-in-up"
          style={{ opacity: 0, animationDelay: "1s" }}
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <img src="/adaptai-logo.png" alt="AdaptAI logo" className="h-6 w-6 object-contain" />
                <span className="text-base font-semibold text-black">AdaptAI</span>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                AI-платформа адаптации сотрудников от FTT. Резидент Astana Hub.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Контакты</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>+7 701 070 4342</li>
                <li>ftt@fttclub.kz</li>
                <li>г. Астана</li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Продукт</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li><a href="#modules" className="hover:text-black transition-colors">Модули платформы</a></li>
                <li><a href="#pricing" className="hover:text-black transition-colors">Тарифы</a></li>
                <li><a href="#about" className="hover:text-black transition-colors">Видео о продукте</a></li>
                <li><a href="#faq" className="hover:text-black transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Правовая информация</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>
                  <a
                    href="https://fttclub.kz/privacy_policy.html"
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-black"
                  >
                    Политика конфиденциальности
                  </a>
                </li>
                <li>
                  <a
                    href="https://fttclub.kz/offer.html"
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-black"
                  >
                    Публичная оферта
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-4 text-xs text-gray-500">
            © 2026 AdaptAI Platform. Все права защищены.
          </div>
        </footer>
      </main>
    </div>
  );
}
