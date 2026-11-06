import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import FluidBackground from "./FluidBackground.jsx";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  ChevronDown,
  ClipboardCheck,
  Compass,
  Handshake,
  MessageCircle,
  Package,
  Play,
  Plus,
  Users,
} from "lucide-react";

const translations = {
  en: {
    nav: {
      solutions: "Solutions",
      teams: "For Teams",
      about: "About Us",
      login: "Login",
      started: "Get started",
    },
    heading1: "Your business runs. You stay in control.",
    heading2: "AI agents for sales, inventory, tasks and your team - in one platform.",
    subheading:
      "Leads from WhatsApp, Instagram and Kaspi, products and deals, tasks and hiring are connected. Agents take over the routine, and you see the whole process.",
    cta: "Get started",
    tabs: {
      sales: "Sales",
      train: "Inventory",
      tasks: "Tasks",
      analyse: "Hiring",
      testing: "AI agents",
      deploy: "Analytics",
    },
    ui: {
      "skip": "Skip to content",
      "navModules": "Modules",
      "navAgents": "AI agents",
      "navVideo": "Video",
      "badgeTag": "New",
      "badge": "An AI agent map for your company",
      "watch": "Watch video",
      "partners": "Working with us",
      "modulesLabel": "Platform",
      "modulesTitle": "Six modules, one database",
      "modulesText": "Turn sections on one by one. Deals, products, tasks and people see each other from day one.",
      "videoLabel": "Video",
      "finalTitle": "Launch your first agent this week",
      "finalText": "Start with one department. The AI assistant walks you through company setup, and we help move your data.",
      "status": "Astana, Kazakhstan"
    },
    console: {
      "title": "Agent feed",
      "working": "agents at work",
      "idle": "waiting for your decision",
      "confirm": "Approve",
      "reject": "Decline",
      "lines": [
        {
          "time": "09:14",
          "agent": "Sales",
          "state": "done",
          "text": "New WhatsApp lead - deal created"
        },
        {
          "time": "09:15",
          "agent": "Inventory",
          "state": "done",
          "text": "Stock reserved for the deal"
        },
        {
          "time": "09:21",
          "agent": "Tasks",
          "state": "done",
          "text": "Manager assigned “Prepare the contract”"
        },
        {
          "time": "09:40",
          "agent": "Scout",
          "state": "hint",
          "text": "Next step: send the offer before 15:00"
        },
        {
          "time": "10:02",
          "agent": "Sales",
          "state": "wait",
          "text": "7% discount on the deal"
        }
      ]
    },
    map: {
      "title": "Agents work as a team",
      "text": "The CEO agent distributes work between department agents, and they pass tasks further down. You define the structure and permissions, agents take over the routine. Select an agent to see what it does.",
      "hint": "Scroll the map sideways",
      "exampleLabel": "Example action",
      "nodes": {
        "ceo": {
          "name": "CEO agent",
          "role": "Distributes work between departments",
          "does": [
            "Receives goals from the owner",
            "Assigns tasks to department agents",
            "Makes sure nothing gets lost"
          ],
          "log": "Task “Close this week's deals” passed to the sales agent"
        },
        "sales": {
          "name": "Sales agent",
          "role": "Moves deals through the pipeline",
          "does": [
            "Creates deals from WhatsApp, Instagram and Kaspi leads",
            "Moves deals through pipeline stages",
            "Discounts above the limit need your approval"
          ],
          "log": "New Instagram lead - deal created"
        },
        "scout": {
          "name": "Scout",
          "role": "Suggests the next step",
          "does": [
            "Reviews the deal history",
            "Suggests the next action to the manager"
          ],
          "log": "Next step: send the offer before 15:00"
        },
        "stock": {
          "name": "Inventory agent",
          "role": "Links products and deals",
          "does": [
            "Reserves stock for a deal",
            "Accounts for returns in revenue"
          ],
          "log": "Stock reserved for the deal"
        },
        "tasks": {
          "name": "Tasks agent",
          "role": "Keeps the team on pace",
          "does": [
            "Assigns deal tasks to managers",
            "Tracks what is done and what is overdue"
          ],
          "log": "Manager assigned “Prepare the contract”"
        },
        "digest": {
          "name": "Daily digest",
          "role": "Results in WhatsApp",
          "does": [
            "Collects deal and task results",
            "Sends the digest to the owner in WhatsApp"
          ],
          "log": "Daily results sent to the owner"
        },
        "hiring": {
          "name": "Hiring agent",
          "role": "Screens candidates",
          "does": [
            "Scores HeadHunter applications",
            "Sends candidates tests in WhatsApp"
          ],
          "log": "12 applications scored, 3 candidates shortlisted"
        }
      },
      "integrationsTitle": "Connects to the services you already use"
    },
    showcase: {
      "orbit": {
        "eyebrow": "One system",
        "title": "Everything is connected",
        "text": "A deal reserves stock in the warehouse, a task knows the customer, and reports are built from real data. No more copying information between services."
      },
      "rows": [
        {
          "id": "agents",
          "eyebrow": "AI agents",
          "title": "Agents work as a team",
          "text": "The CEO agent distributes work between department agents, and they pass tasks further down. You define the structure and permissions, agents take over the routine.",
          "points": [
            "Agent map with any hierarchy",
            "Scout suggests the next step for every deal",
            "Changes to your data only after your confirmation"
          ]
        },
        {
          "id": "whatsapp",
          "eyebrow": "Every day",
          "title": "Daily results arrive in WhatsApp",
          "text": "Managers get a summary of deals and tasks right in the messenger, and sales reps learn about customer replies instantly.",
          "points": [
            "Daily task and deal summary",
            "Customer reply notifications",
            "Talk to agents directly from WhatsApp"
          ]
        },
        {
          "id": "shield",
          "eyebrow": "Security",
          "title": "Access under control",
          "text": "Everyone sees only what they need for their work. Permissions are set for roles, sections and deal stages, and each company's data is isolated.",
          "points": [
            "Roles and permissions by section",
            "Deal stage access and discount limits",
            "Data isolation between companies"
          ]
        }
      ]
    },
    overlays: {
      analyse: {
        title: "Hiring and onboarding",
        subtitle: "From the first response to a new hire's first week",
        steps: [
          "1. AI screening of HeadHunter and career-page responses",
          "2. Candidate tests in WhatsApp",
          "3. Video and audio interviews by link",
          "4. Onboarding and courses for new employees",
        ],
      },
      train: {
        title: "Inventory and Kaspi",
        subtitle: "Stock is linked to deals and orders",
        metrics: ["Receipts from suppliers", "Reservations for deals", "Shipments and returns", "Kaspi orders, prices and stock"],
      },
      testing: {
        title: "AI agents for your company",
        status: "In the app and in WhatsApp",
        passed: "An agent map from CEO to departments: each agent works within its own access",
        metrics: [
          "Scout: next steps for every deal",
          "Assistant that helps set up your company",
          "Answers from your documents with sources",
          "Write actions only after your confirmation",
        ],
      },
      deploy: {
        title: "Analytics for the CEO",
        checklist: [
          "Deals by stage and by manager",
          "Revenue after returns and average order value",
          "Daily task and deal summary in WhatsApp",
          "Hiring and training reports",
        ],
        button: "View Dashboard",
      },
      sales: {
        title: "Sales and leads",
        subtitle: "WhatsApp, Instagram, Kaspi and calls in one pipeline",
        metrics: [
          "Leads from messengers, Instagram comments and Kaspi",
          "Pipeline by stages, owners and access rights",
          "Contracts and waybills straight from a deal",
          "Binotel and OnlinePBX call recordings",
        ],
      },
      tasks: {
        title: "Tasks and projects",
        subtitle: "Assign, track and hand over work",
        metrics: [
          "Projects and a weekly calendar",
          "Recurring tasks and bulk actions",
          "Assignee notifications",
          "Work handover when an employee leaves",
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
      started: "Начать работу",
    },
    heading1: "Бизнес работает. Вы управляете.",
    heading2: "ИИ-агенты для продаж, склада, задач и команды - в одной платформе.",
    subheading:
      "Заявки из WhatsApp, Instagram и Kaspi, товары и сделки, задачи и найм связаны между собой. Агенты берут на себя рутину, а вы видите весь процесс.",
    cta: "Начать работу",
    tabs: {
      sales: "Продажи",
      train: "Склад",
      tasks: "Задачи",
      analyse: "Найм",
      testing: "ИИ-агенты",
      deploy: "Аналитика",
    },
    ui: {
      "skip": "Перейти к содержанию",
      "navModules": "Модули",
      "navAgents": "ИИ-агенты",
      "navVideo": "Видео",
      "badgeTag": "Новое",
      "badge": "Карта ИИ-агентов вашей компании",
      "watch": "Смотреть видео",
      "partners": "С нами работают",
      "modulesLabel": "Платформа",
      "modulesTitle": "Шесть модулей, одна база данных",
      "modulesText": "Подключайте разделы по очереди. Сделки, товары, задачи и сотрудники сразу видят друг друга.",
      "videoLabel": "Видео",
      "finalTitle": "Подключите первого агента на этой неделе",
      "finalText": "Начните с одного отдела. ИИ-помощник проведёт через настройку компании, а мы поможем перенести данные.",
      "status": "Астана, Казахстан"
    },
    console: {
      "title": "Лента агентов",
      "working": "агенты работают",
      "idle": "ждёт вашего решения",
      "confirm": "Подтвердить",
      "reject": "Отклонить",
      "lines": [
        {
          "time": "09:14",
          "agent": "Продажи",
          "state": "done",
          "text": "Новый лид из WhatsApp - сделка создана"
        },
        {
          "time": "09:15",
          "agent": "Склад",
          "state": "done",
          "text": "Товар зарезервирован под сделку"
        },
        {
          "time": "09:21",
          "agent": "Задачи",
          "state": "done",
          "text": "Менеджеру поставлена задача «Подготовить договор»"
        },
        {
          "time": "09:40",
          "agent": "Разведчик",
          "state": "hint",
          "text": "Следующий шаг: отправить КП до 15:00"
        },
        {
          "time": "10:02",
          "agent": "Продажи",
          "state": "wait",
          "text": "Скидка 7% по сделке"
        }
      ]
    },
    map: {
      "title": "Агенты работают как команда",
      "text": "CEO-агент распределяет работу между агентами отделов, а те передают задачи дальше. Вы задаёте структуру и права, агенты берут на себя рутину. Нажмите на агента, чтобы увидеть, что он делает.",
      "hint": "Схема прокручивается вбок",
      "exampleLabel": "Пример действия",
      "nodes": {
        "ceo": {
          "name": "CEO-агент",
          "role": "Распределяет работу между отделами",
          "does": [
            "Получает цели от руководителя",
            "Ставит задачи агентам отделов",
            "Следит, чтобы ничего не потерялось"
          ],
          "log": "Задача «Закрыть сделки недели» передана агенту продаж"
        },
        "sales": {
          "name": "Агент продаж",
          "role": "Ведёт сделки по воронке",
          "does": [
            "Создаёт сделки из заявок WhatsApp, Instagram и Kaspi",
            "Двигает сделки по этапам воронки",
            "Скидки выше лимита - только после подтверждения"
          ],
          "log": "Новый лид из Instagram - сделка создана"
        },
        "scout": {
          "name": "Разведчик",
          "role": "Подсказывает следующий шаг",
          "does": [
            "Анализирует историю сделки",
            "Предлагает следующее действие менеджеру"
          ],
          "log": "Следующий шаг: отправить КП до 15:00"
        },
        "stock": {
          "name": "Агент склада",
          "role": "Связывает товары и сделки",
          "does": [
            "Резервирует товар под сделку",
            "Учитывает возвраты в выручке"
          ],
          "log": "Товар зарезервирован под сделку"
        },
        "tasks": {
          "name": "Агент задач",
          "role": "Держит команду в ритме",
          "does": [
            "Ставит задачи менеджерам по сделкам",
            "Отмечает, что сделано и что горит"
          ],
          "log": "Менеджеру поставлена задача «Подготовить договор»"
        },
        "digest": {
          "name": "Сводка дня",
          "role": "Итоги в WhatsApp",
          "does": [
            "Собирает итоги по сделкам и задачам",
            "Отправляет сводку руководителю в WhatsApp"
          ],
          "log": "Итоги дня отправлены руководителю"
        },
        "hiring": {
          "name": "Агент найма",
          "role": "Отбирает кандидатов",
          "does": [
            "Оценивает отклики с HeadHunter",
            "Отправляет кандидатам тесты в WhatsApp"
          ],
          "log": "12 откликов оценены, 3 кандидата прошли отбор"
        }
      },
      "integrationsTitle": "Подключается к сервисам, которыми вы уже пользуетесь"
    },
    showcase: {
      "orbit": {
        "eyebrow": "Одна система",
        "title": "Всё связано между собой",
        "text": "Сделка резервирует товар на складе, задача знает клиента, а отчёт собирается из реальных данных. Не нужно переносить информацию между сервисами."
      },
      "rows": [
        {
          "id": "agents",
          "eyebrow": "ИИ-агенты",
          "title": "Агенты работают как команда",
          "text": "CEO-агент распределяет работу между агентами отделов, а те передают задачи дальше. Вы задаёте структуру и права, агенты берут на себя рутину.",
          "points": [
            "Карта агентов с любой иерархией",
            "Разведчик подсказывает следующий шаг по сделке",
            "Изменения в системе - только после вашего подтверждения"
          ]
        },
        {
          "id": "whatsapp",
          "eyebrow": "Каждый день",
          "title": "Итоги дня приходят в WhatsApp",
          "text": "Руководитель получает сводку по сделкам и задачам прямо в мессенджер. Менеджеры сразу узнают об ответах клиентов.",
          "points": [
            "Ежедневная сводка задач и сделок",
            "Уведомления об ответах клиентов",
            "Обращения к агентам прямо из WhatsApp"
          ]
        },
        {
          "id": "shield",
          "eyebrow": "Безопасность",
          "title": "Доступы под контролем",
          "text": "Каждый видит только то, что нужно для работы. Права настраиваются для ролей, разделов и этапов сделок, а данные каждой компании хранятся изолированно.",
          "points": [
            "Роли и права по разделам",
            "Доступ к этапам сделок и лимиты скидок",
            "Изоляция данных между компаниями"
          ]
        }
      ]
    },
    overlays: {
      analyse: {
        title: "Найм и адаптация",
        subtitle: "От первого отклика до первой недели сотрудника",
        steps: [
          "1. ИИ-оценка откликов с HeadHunter и карьерной страницы",
          "2. Тесты для кандидатов в WhatsApp",
          "3. Видео- и аудиособеседования по ссылке",
          "4. Онбординг и курсы для новых сотрудников",
        ],
      },
      train: {
        title: "Склад и Kaspi",
        subtitle: "Остатки связаны со сделками и заказами",
        metrics: ["Приход от поставщиков", "Резервы под сделки", "Отгрузки и возвраты", "Заказы, цены и остатки Kaspi"],
      },
      testing: {
        title: "ИИ-агенты компании",
        status: "В приложении и WhatsApp",
        passed: "Карта агентов от CEO до отделов: каждый работает в пределах своих доступов",
        metrics: [
          "Разведчик подсказывает следующий шаг по сделке",
          "Помощник проводит через настройку компании",
          "Ответы по документам компании со ссылками",
          "Изменения в системе - только после вашего подтверждения",
        ],
      },
      deploy: {
        title: "Аналитика для руководителя",
        checklist: [
          "Сделки по этапам и по менеджерам",
          "Выручка с учётом возвратов и средний чек",
          "Ежедневная сводка задач и сделок в WhatsApp",
          "Отчёты по найму и обучению",
        ],
        button: "Смотреть дашборд",
      },
      sales: {
        title: "Продажи и заявки",
        subtitle: "WhatsApp, Instagram, Kaspi и звонки в одной воронке",
        metrics: [
          "Заявки из мессенджеров, комментариев Instagram и Kaspi",
          "Воронка по этапам, ответственным и правам доступа",
          "Договоры и накладные прямо из сделки",
          "Записи звонков Binotel и OnlinePBX",
        ],
      },
      tasks: {
        title: "Задачи и проекты",
        subtitle: "Постановка, контроль и передача дел",
        metrics: [
          "Проекты и календарь по неделям",
          "Повторяющиеся задачи и массовые действия",
          "Уведомления исполнителям",
          "Передача дел при увольнении сотрудника",
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
      started: "Бастау",
    },
    heading1: "Бизнес жұмыс істейді. Сіз басқарасыз.",
    heading2: "Сатылым, қойма, тапсырмалар және команда үшін ЖИ-агенттер - бір платформада.",
    subheading:
      "WhatsApp, Instagram және Kaspi өтінімдері, тауарлар мен мәмілелер, тапсырмалар мен жалдау өзара байланысты. Агенттер күнделікті жұмысты өз мойнына алады, ал сіз бүкіл процесті көресіз.",
    cta: "Жұмысты бастау",
    tabs: {
      sales: "Сатылым",
      train: "Қойма",
      tasks: "Тапсырмалар",
      analyse: "Жалдау",
      testing: "ЖИ-агенттер",
      deploy: "Аналитика",
    },
    ui: {
      "skip": "Мазмұнға өту",
      "navModules": "Модульдер",
      "navAgents": "ЖИ-агенттер",
      "navVideo": "Бейне",
      "badgeTag": "Жаңа",
      "badge": "Компанияңыздың ЖИ-агенттер картасы",
      "watch": "Бейнені көру",
      "partners": "Бізбен жұмыс істейді",
      "modulesLabel": "Платформа",
      "modulesTitle": "Алты модуль, бір дерекқор",
      "modulesText": "Бөлімдерді кезекпен қосыңыз. Мәмілелер, тауарлар, тапсырмалар және қызметкерлер бір-бірін бірден көреді.",
      "videoLabel": "Бейне",
      "finalTitle": "Алғашқы агентті осы аптада қосыңыз",
      "finalText": "Бір бөлімнен бастаңыз. ЖИ-көмекші компанияны баптаудан өткізеді, ал біз деректерді көшіруге көмектесеміз.",
      "status": "Астана, Қазақстан"
    },
    console: {
      "title": "Агенттер лентасы",
      "working": "агенттер жұмыста",
      "idle": "сіздің шешіміңізді күтеді",
      "confirm": "Растау",
      "reject": "Қабылдамау",
      "lines": [
        {
          "time": "09:14",
          "agent": "Сатылым",
          "state": "done",
          "text": "WhatsApp-тан жаңа лид - мәміле құрылды"
        },
        {
          "time": "09:15",
          "agent": "Қойма",
          "state": "done",
          "text": "Тауар мәмілеге резервтелді"
        },
        {
          "time": "09:21",
          "agent": "Тапсырмалар",
          "state": "done",
          "text": "Менеджерге «Шартты дайындау» тапсырмасы берілді"
        },
        {
          "time": "09:40",
          "agent": "Барлаушы",
          "state": "hint",
          "text": "Келесі қадам: коммерциялық ұсынысты 15:00-ге дейін жіберу"
        },
        {
          "time": "10:02",
          "agent": "Сатылым",
          "state": "wait",
          "text": "Мәміле бойынша 7% жеңілдік"
        }
      ]
    },
    map: {
      "title": "Агенттер команда болып жұмыс істейді",
      "text": "CEO-агент жұмысты бөлім агенттері арасында бөледі, ал олар тапсырмаларды әрі қарай береді. Сіз құрылым мен рұқсаттарды белгілейсіз, күнделікті жұмысты агенттер атқарады. Агенттің не істейтінін көру үшін оны таңдаңыз.",
      "hint": "Сызбаны бүйірге жылжытыңыз",
      "exampleLabel": "Әрекет мысалы",
      "nodes": {
        "ceo": {
          "name": "CEO-агент",
          "role": "Жұмысты бөлімдерге бөледі",
          "does": [
            "Басшыдан мақсаттарды алады",
            "Бөлім агенттеріне тапсырма береді",
            "Ештеңе жоғалмауын қадағалайды"
          ],
          "log": "«Апта мәмілелерін жабу» тапсырмасы сатылым агентіне берілді"
        },
        "sales": {
          "name": "Сатылым агенті",
          "role": "Мәмілелерді воронка бойынша жүргізеді",
          "does": [
            "WhatsApp, Instagram және Kaspi өтінімдерінен мәміле құрады",
            "Мәмілелерді кезеңдер бойынша жылжытады",
            "Лимиттен жоғары жеңілдік - тек растаудан кейін"
          ],
          "log": "Instagram-нан жаңа лид - мәміле құрылды"
        },
        "scout": {
          "name": "Барлаушы",
          "role": "Келесі қадамды ұсынады",
          "does": [
            "Мәміле тарихын талдайды",
            "Менеджерге келесі әрекетті ұсынады"
          ],
          "log": "Келесі қадам: коммерциялық ұсынысты 15:00-ге дейін жіберу"
        },
        "stock": {
          "name": "Қойма агенті",
          "role": "Тауарлар мен мәмілелерді байланыстырады",
          "does": [
            "Мәмілеге тауар резервтейді",
            "Түсімде қайтаруларды ескереді"
          ],
          "log": "Тауар мәмілеге резервтелді"
        },
        "tasks": {
          "name": "Тапсырмалар агенті",
          "role": "Команданы ырғақта ұстайды",
          "does": [
            "Менеджерлерге мәміле бойынша тапсырма береді",
            "Не орындалғанын және не кешігіп жатқанын белгілейді"
          ],
          "log": "Менеджерге «Шартты дайындау» тапсырмасы берілді"
        },
        "digest": {
          "name": "Күн қорытындысы",
          "role": "Қорытынды WhatsApp-та",
          "does": [
            "Мәмілелер мен тапсырмалар қорытындысын жинайды",
            "Басшыға WhatsApp-қа жібереді"
          ],
          "log": "Күн қорытындысы басшыға жіберілді"
        },
        "hiring": {
          "name": "Жалдау агенті",
          "role": "Кандидаттарды іріктейді",
          "does": [
            "HeadHunter өтініштерін бағалайды",
            "Кандидаттарға WhatsApp-та тест жібереді"
          ],
          "log": "12 өтініш бағаланды, 3 кандидат іріктеуден өтті"
        }
      },
      "integrationsTitle": "Сіз қолданып жүрген сервистерге қосылады"
    },
    showcase: {
      "orbit": {
        "eyebrow": "Бір жүйе",
        "title": "Барлығы өзара байланысты",
        "text": "Мәміле қоймадағы тауарды резервтейді, тапсырма клиентті біледі, ал есеп нақты деректерден жиналады. Ақпаратты сервистер арасында тасудың қажеті жоқ."
      },
      "rows": [
        {
          "id": "agents",
          "eyebrow": "ЖИ-агенттер",
          "title": "Агенттер команда болып жұмыс істейді",
          "text": "CEO-агент жұмысты бөлім агенттері арасында бөледі, ал олар тапсырмаларды әрі қарай береді. Сіз құрылым мен рұқсаттарды белгілейсіз, күнделікті жұмысты агенттер атқарады.",
          "points": [
            "Кез келген иерархиясы бар агенттер картасы",
            "Барлаушы мәміле бойынша келесі қадамды ұсынады",
            "Жүйедегі өзгерістер - тек сіз растағаннан кейін"
          ]
        },
        {
          "id": "whatsapp",
          "eyebrow": "Күн сайын",
          "title": "Күн қорытындысы WhatsApp-қа келеді",
          "text": "Басшы мәмілелер мен тапсырмалар бойынша қорытындыны тікелей мессенджерге алады. Менеджерлер клиент жауаптары туралы бірден біледі.",
          "points": [
            "Тапсырмалар мен мәмілелердің күнделікті қорытындысы",
            "Клиент жауаптары туралы хабарламалар",
            "Агенттерге тікелей WhatsApp-тан жүгіну"
          ]
        },
        {
          "id": "shield",
          "eyebrow": "Қауіпсіздік",
          "title": "Рұқсаттар бақылауда",
          "text": "Әркім жұмысына қажетті нәрсені ғана көреді. Рұқсаттар рөлдер, бөлімдер және мәміле кезеңдері үшін бапталады, ал әр компанияның деректері оқшау сақталады.",
          "points": [
            "Бөлімдер бойынша рөлдер мен рұқсаттар",
            "Мәміле кезеңдеріне қолжетімділік және жеңілдік лимиттері",
            "Компаниялар арасындағы деректерді оқшаулау"
          ]
        }
      ]
    },
    overlays: {
      analyse: {
        title: "Жалдау және бейімдеу",
        subtitle: "Алғашқы өтінімнен қызметкердің алғашқы аптасына дейін",
        steps: [
          "1. HeadHunter және мансап парағындағы өтінімдерді ЖИ бағалауы",
          "2. Кандидаттарға WhatsApp арқылы тест",
          "3. Сілтеме арқылы видео және аудио сұхбат",
          "4. Жаңа қызметкерлерге онбординг пен курстар",
        ],
      },
      train: {
        title: "Қойма және Kaspi",
        subtitle: "Қалдықтар мәмілелер мен тапсырыстарға байланысты",
        metrics: ["Жеткізушілерден кіріс", "Мәмілеге резерв", "Жөнелту және қайтару", "Kaspi тапсырыстары, бағалары мен қалдықтары"],
      },
      testing: {
        title: "Компанияның ЖИ-агенттері",
        status: "Қосымшада және WhatsApp-та",
        passed: "CEO-дан бөлімдерге дейінгі агенттер картасы: әрқайсысы өз рұқсаты шегінде жұмыс істейді",
        metrics: [
          "Барлаушы мәміле бойынша келесі қадамды ұсынады",
          "Көмекші компанияны баптаудан өткізеді",
          "Компания құжаттары бойынша сілтемесі бар жауаптар",
          "Жүйедегі өзгерістер - тек сіз растағаннан кейін",
        ],
      },
      deploy: {
        title: "Басшыға арналған аналитика",
        checklist: [
          "Кезеңдер мен менеджерлер бойынша мәмілелер",
          "Қайтаруды ескергендегі түсім және орташа чек",
          "WhatsApp-та тапсырмалар мен мәмілелердің күнделікті қорытындысы",
          "Жалдау және оқыту бойынша есептер",
        ],
        button: "Дашбордты көру",
      },
      sales: {
        title: "Сатылым және өтінімдер",
        subtitle: "WhatsApp, Instagram, Kaspi және қоңыраулар бір воронкада",
        metrics: [
          "Мессенджерлерден, Instagram пікірлерінен және Kaspi-дан өтінімдер",
          "Кезеңдер, жауаптылар және рұқсаттар бойынша воронка",
          "Шарттар мен жүкқұжаттар тікелей мәміледен",
          "Binotel және OnlinePBX қоңырау жазбалары",
        ],
      },
      tasks: {
        title: "Тапсырмалар және жобалар",
        subtitle: "Тапсырма қою, бақылау және істі тапсыру",
        metrics: [
          "Жобалар және апталық күнтізбе",
          "Қайталанатын тапсырмалар және жаппай әрекеттер",
          "Орындаушыларға хабарламалар",
          "Қызметкер кеткенде істерді тапсыру",
        ],
      },
    },
  },
};

const partnerLogos = [
  { src: "/partners/eurasian-university.png", alt: "Евразийский национальный университет" },
  { src: "/partners/astana-hub.png", alt: "Astana Hub" },
  { src: "/partners/sdu.png", alt: "SDU University" },
  { src: "/partners/alatau-hub.png", alt: "Alatau Hub" },
  { src: "/partners/central-asia-pipes.png", alt: "Central Asia Pipes" },
];

const faqItems = [
  {
    question: "Нужно подключать сразу все модули?",
    answer:
      "Нет. Начните с продаж, склада, задач или найма, а остальные разделы подключайте по очереди. ИИ-помощник проведёт через настройку компании.",
  },
  {
    question: "Какие интеграции есть у AdaptAI?",
    answer:
      "Готовые подключения: WhatsApp, Instagram, Kaspi, HeadHunter, Битрикс24, телефония Binotel и OnlinePBX. Для крупных клиентов настраиваем интеграции с внутренними системами и автоматизацию сценариев под ваши процессы.",
  },
  {
    question: "Как перенести товары и сделки?",
    answer:
      "В платформе есть загрузка товаров и интеграция с Битрикс24. Способ переноса зависит от исходных данных - обсудим структуру и проверим результат перед началом работы.",
  },
  {
    question: "Есть ли поддержка после запуска?",
    answer:
      "Да. Отвечаем в чате и помогаем с настройкой и переносом данных. Для крупных компаний проводим персональное внедрение.",
  },
];

function OverlayCard({ activeTab, t }) {
  if (activeTab === "analyse") {
    return (
      <div className="absolute left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/95 p-5 shadow-2xl backdrop-blur animate-slide-up-overlay">
        <h3 className="text-lg font-semibold text-black">{t.overlays.analyse.title}</h3>
        <p className="mt-1 text-sm text-gray-600">{t.overlays.analyse.subtitle}</p>
        <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
          <div className="h-full w-1/4 rounded-full bg-brand" />
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
          <div className="h-full w-2/3 rounded-full bg-brand" />
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
          <div className="h-full w-[58%] rounded-full bg-brand" />
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
      <button className="mt-4 rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-deep">
        {t.overlays.deploy.button}
      </button>
    </div>
  );
}

function LoopVideo({ name, className = "", fit = "object-contain" }) {
  return (
    <div className={`relative ${className}`}>
      <img
        src={`/scenes/${name}-poster.webp`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className={`loop-poster absolute inset-0 h-full w-full ${fit}`}
      />
      <video
        poster={`/scenes/${name}-poster.webp`}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        className={`loop-video h-full w-full ${fit}`}
      >
        <source src={`/scenes/${name}.webm`} type="video/webm" />
        <source src={`/scenes/${name}.mp4`} type="video/mp4" />
      </video>
    </div>
  );
}

const INTEGRATIONS = [
  { name: "WhatsApp", src: "/integrations/whatsapp.svg", mark: true },
  { name: "Instagram", src: "/integrations/instagram.svg", mark: true },
  { name: "Kaspi.kz", src: "/integrations/kaspi.svg" },
  { name: "HeadHunter", src: "/integrations/headhunter.svg", mark: true },
  { name: "Битрикс24", src: "/integrations/bitrix24.svg" },
  { name: "Binotel", src: "/integrations/binotel.svg", small: true },
  { name: "OnlinePBX", src: "/integrations/onlinepbx.svg", mark: true },
];


function AgentFeed({ data }) {
  const [shown, setShown] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? data.lines.length : 0,
  );

  useEffect(() => {
    if (shown >= data.lines.length) return undefined;
    const timer = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 1000 : 700);
    return () => clearTimeout(timer);
  }, [shown, data.lines.length]);

  const working = shown < data.lines.length;
  const DOT = { done: "bg-brand", hint: "bg-amber-400", wait: "bg-ink" };

  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-white text-left">
      <div className="flex items-center justify-between border-b border-line bg-mist px-4 py-3">
        <div className="flex items-center gap-2.5">
          <img src="/adaptai-logo.png" alt="" className="h-5 w-5 object-contain" />
          <span className="text-sm font-medium text-ink">{data.title}</span>
        </div>
        <span className="inline-flex items-center gap-2 text-xs text-ink/60" aria-live="polite">
          <span className={`h-1.5 w-1.5 rounded-full ${working ? "bg-brand animate-pulse" : "bg-ink"}`} />
          {working ? data.working : data.idle}
        </span>
      </div>
      <ol className="min-h-[300px] divide-y divide-line/70 sm:min-h-[212px]">
        {data.lines.slice(0, shown).map((line, i) => (
          <li key={i} className="feed-line flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5">
            <span className="w-11 shrink-0 font-mono text-xs tabular-nums text-ink/45">{line.time}</span>
            <span className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-brand-deep">
              <span className={`h-1.5 w-1.5 rounded-full ${DOT[line.state]}`} />
              {line.agent}
            </span>
            <span className="min-w-0 basis-full text-sm text-ink sm:basis-auto sm:flex-1">{line.text}</span>
            {line.state === "wait" && (
              <span className="ml-auto inline-flex gap-2 text-xs">
                <span className="rounded-md bg-ink px-2.5 py-1 font-medium text-white">{data.confirm}</span>
                <span className="rounded-md border border-line px-2.5 py-1 text-ink/70">{data.reject}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* карта агентов: координаты в процентах холста */
const MAP_NODES = [
  { id: "ceo", x: 50, y: 15, icon: null },
  { id: "sales", x: 14, y: 50, parent: "ceo", icon: Handshake },
  { id: "stock", x: 38, y: 50, parent: "ceo", icon: Package },
  { id: "tasks", x: 62, y: 50, parent: "ceo", icon: ClipboardCheck },
  { id: "hiring", x: 86, y: 50, parent: "ceo", icon: Users },
  { id: "scout", x: 14, y: 85, parent: "sales", icon: Compass },
  { id: "digest", x: 62, y: 85, parent: "tasks", icon: MessageCircle },
];

const MOBILE_ORDER = [
  ["ceo", 0], ["sales", 1], ["scout", 2], ["stock", 1], ["tasks", 1], ["digest", 2], ["hiring", 1],
];

function linkPath(a, b) {
  const my = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
}

function AgentMap({ data }) {
  const [active, setActive] = useState("sales");
  const byId = Object.fromEntries(MAP_NODES.map((n) => [n.id, n]));
  const chain = new Set();
  for (let n = byId[active]; n; n = byId[n.parent]) chain.add(n.id);
  const node = data.nodes[active];

  return (
    <section id="agents" className="mt-16 scroll-mt-24 md:mt-24">
      <SectionHead title={data.title} text={data.text} />

      <div className="relative mt-10 overflow-hidden rounded-2xl border border-line bg-white">
        <ul className="map-canvas space-y-2 p-4 md:hidden">
          {MOBILE_ORDER.map(([id, level]) => {
            const n = byId[id];
            const Icon = n.icon;
            const isActive = active === id;
            return (
              <li key={id} style={{ paddingLeft: `${level * 22}px` }} className="relative">
                {level > 0 && (
                  <span
                    aria-hidden="true"
                    className={`absolute top-1/2 h-px w-3 ${chain.has(id) ? "bg-brand" : "bg-line"}`}
                    style={{ left: `${level * 22 - 14}px` }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => setActive(id)}
                  aria-pressed={isActive}
                  className={`flex w-full items-center gap-2.5 rounded-xl border bg-white py-2 pl-2 pr-3 text-left text-sm font-medium ${
                    isActive ? "border-brand text-ink" : chain.has(id) ? "border-brand/50 text-ink" : "border-line text-ink/75"
                  }`}
                >
                  <span className={`grid h-8 w-8 place-items-center rounded-lg ${isActive ? "bg-brand text-white" : "bg-mist text-brand-deep"}`}>
                    {Icon ? <Icon className="h-4 w-4" /> : <img src="/adaptai-logo.png" alt="" className="h-5 w-5" />}
                  </span>
                  {data.nodes[id].name}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:block">
          <div className="map-canvas relative h-[480px]">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
              {MAP_NODES.filter((n) => n.parent).map((n) => {
                const d = linkPath(byId[n.parent], n);
                const on = chain.has(n.id);
                return (
                  <g key={n.id}>
                    <path d={d} fill="none" stroke="#DCE9EC" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                    <path
                      d={d}
                      fill="none"
                      stroke={on ? "#0BB8D3" : "#9FD9E3"}
                      strokeWidth={on ? 2.5 : 1.5}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      className={on ? "flow flow-on" : "flow"}
                    />
                  </g>
                );
              })}
            </svg>

            {MAP_NODES.map((n) => {
              const Icon = n.icon;
              const isActive = active === n.id;
              const inChain = chain.has(n.id);
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setActive(n.id)}
                  aria-pressed={isActive}
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 whitespace-nowrap rounded-xl border bg-white py-2 pl-2 pr-4 text-sm font-medium transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-[calc(50%+2px)] ${
                    isActive
                      ? "border-brand text-ink shadow-[0_10px_30px_-12px_rgba(8,126,144,0.55)]"
                      : inChain
                        ? "border-brand/50 text-ink"
                        : "border-line text-ink/75 hover:border-ink/25"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-lg ${
                      isActive ? "bg-brand text-white" : "bg-mist text-brand-deep"
                    }`}
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : <img src="/adaptai-logo.png" alt="" className="h-5 w-5" />}
                  </span>
                  {data.nodes[n.id].name}
                </button>
              );
            })}
          </div>
        </div>

        <div key={active} className="map-detail grid gap-6 border-t border-line p-6 md:grid-cols-[1fr_1.2fr_1.2fr] md:gap-10 md:p-8">
          <div>
            <h3 className="font-display text-xl font-medium tracking-[-0.02em] text-ink">{node.name}</h3>
            <p className="mt-2 text-ink/65">{node.role}</p>
          </div>
          <ul className="space-y-2.5">
            {node.does.map((d) => (
              <li key={d} className="flex gap-3 text-[15px] text-ink">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
                {d}
              </li>
            ))}
          </ul>
          <div className="rounded-xl bg-mist p-4">
            <p className="text-xs text-ink/55">{data.exampleLabel}</p>
            <p className="mt-1.5 text-[15px] text-ink">{node.log}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ title, text, center = false }) {
  if (center) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-[2rem] font-medium leading-[1.08] tracking-[-0.03em] text-ink text-balance md:text-5xl">
          {title}
        </h2>
        {text && <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink/65 md:text-lg">{text}</p>}
      </div>
    );
  }
  return (
    <div className="grid gap-5 md:grid-cols-[1.15fr_1fr] md:items-end md:gap-16">
      <h2 className="font-display text-[2rem] font-medium leading-[1.08] tracking-[-0.03em] text-ink text-balance md:text-5xl">
        {title}
      </h2>
      {text && <p className="max-w-xl text-base leading-relaxed text-ink/65 md:text-lg">{text}</p>}
    </div>
  );
}

function FeatureRow({ row, flip }) {
  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
      <div className={flip ? "md:order-2" : ""}>
        <h3 className="font-display text-[1.75rem] font-medium leading-[1.1] tracking-[-0.025em] text-ink text-balance md:text-4xl">
          {row.title}
        </h3>
        <p className="mt-5 text-base leading-relaxed text-ink/65 md:text-lg">{row.text}</p>
        <ul className="mt-8 border-t border-line">
          {row.points.map((point) => (
            <li key={point} className="flex items-start gap-3 border-b border-line py-3.5 text-[15px] text-ink">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      <LoopVideo
        name={row.id}
        className={`aspect-square w-full overflow-hidden rounded-2xl border border-line ${flip ? "md:order-1" : ""}`}
      />
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState("ru");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("sales");
  const [openFaq, setOpenFaq] = useState(0);
  const [pauseModulesAutoplay, setPauseModulesAutoplay] = useState(false);
  const [heroVariant, setHeroVariant] = useState(() =>
    window.matchMedia("(max-width: 767px)").matches ? "adaptai-hero-mobile" : "adaptai-hero",
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setHeroVariant(mq.matches ? "adaptai-hero-mobile" : "adaptai-hero");
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const videoRef = useRef(null);
  const languageMenuRef = useRef(null);
  const t = translations[language];
  const tabs = [
    { id: "sales", label: t.tabs.sales, icon: Handshake },
    { id: "train", label: t.tabs.train, icon: Package },
    { id: "tasks", label: t.tabs.tasks, icon: ClipboardCheck },
    { id: "analyse", label: t.tabs.analyse, icon: Users },
    { id: "testing", label: t.tabs.testing, icon: Bot },
    { id: "deploy", label: t.tabs.deploy, icon: BarChart3 },
  ];

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

  const navLinks = [
    { href: "#modules", label: t.ui.navModules },
    { href: "#agents", label: t.ui.navAgents },
    { href: "#about", label: t.ui.navVideo },
    { href: "#faq", label: "FAQ" },
  ];
  const rows = t.showcase.rows.filter((row) => row.id !== "agents");

  return (
    <div className="relative min-h-screen bg-white text-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
        {t.ui.skip}
      </a>

      <FluidBackground />

      {/* первый экран: 3D-петля; белый фон видео растворяется в градиенте (multiply) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[860px] overflow-hidden mix-blend-multiply">
        <img
          src={`/hero/${heroVariant}-poster.webp`}
          alt=""
          aria-hidden="true"
          className="hero-poster absolute inset-0 h-full w-full object-cover"
        />
        <video
          key={heroVariant}
          poster={`/hero/${heroVariant}-poster.webp`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="hero-video relative h-full w-full object-cover"
        >
          <source src={`/hero/${heroVariant}.webm`} type="video/webm" />
          <source src={`/hero/${heroVariant}.mp4`} type="video/mp4" />
        </video>
      </div>

      <header className="sticky top-0 z-30 border-b border-line/80 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-6">
          <a href="#" className="flex items-center gap-2">
            <img src="/adaptai-logo.png" alt="" className="h-7 w-7 object-contain" />
            <span className="font-display text-[15px] font-semibold tracking-[-0.02em] text-ink">AdaptAI</span>
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-ink/65 transition-colors hover:text-ink">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative" ref={languageMenuRef}>
              <button
                onClick={() => setIsLangMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-medium text-ink/70 transition-colors hover:text-ink"
                aria-haspopup="menu"
                aria-expanded={isLangMenuOpen}
                aria-label="Language"
              >
                {language.toUpperCase()}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isLangMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-24 rounded-xl border border-line bg-white p-1">
                  {["ru", "en", "kz"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangMenuOpen(false);
                      }}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                        language === lang ? "bg-ink text-white" : "text-ink/70 hover:bg-mist"
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <a href="#" className="hidden text-sm text-ink/65 transition-colors hover:text-ink sm:inline">
              {t.nav.login}
            </a>
            <a
              href="#contacts"
              className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-deep"
            >
              {t.nav.started}
            </a>
          </div>
        </nav>
      </header>

      <main id="main" className="relative z-10 mx-auto max-w-7xl px-5 pb-20 md:px-6">
        {/* hero */}
        <section className="pt-14 text-center md:pt-24">
          <a
            href="#agents"
            className="hero-in inline-flex items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-3 text-sm text-ink/75 transition-colors hover:border-brand/60"
          >
            <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">{t.ui.badgeTag}</span>
            {t.ui.badge}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>

          <h1 className="hero-in mx-auto mt-8 max-w-5xl font-display text-[2.15rem] font-medium leading-[1.04] tracking-[-0.035em] text-ink text-balance sm:text-6xl lg:text-[4.6rem]">
            {t.heading1}
          </h1>
          <p className="hero-in mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink/65 md:text-xl">{t.heading2}</p>

          <div className="hero-in mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href="#contacts"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-brand-deep"
            >
              {t.cta}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-6 py-3.5 text-base font-medium text-ink transition-colors hover:border-ink/30"
            >
              <Play className="h-4 w-4" />
              {t.ui.watch}
            </a>
          </div>

          <div className="hero-in mt-16 md:mt-20">
            <AgentFeed data={t.console} />
          </div>
        </section>

        {/* интеграции */}
        <section className="mt-20 md:mt-28">
          <p className="text-center text-sm text-ink/55">{t.map.integrationsTitle}</p>
          <ul className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-white sm:grid-cols-4 lg:grid-cols-7">
            {INTEGRATIONS.map((item) => (
              <li
                key={item.name}
                className="logo-cell group -mb-px -mr-px flex h-20 items-center justify-center gap-2.5 border-b border-r border-line px-4 last:col-span-2 sm:last:col-span-1"
              >
                <img
                  src={item.src}
                  alt={item.mark ? "" : item.name}
                  className={`${item.mark ? "h-7 w-7" : item.small ? "h-[18px] w-auto" : "h-6 w-auto max-w-[120px]"} object-contain`}
                />
                {item.mark && <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink/85">{item.name}</span>}
              </li>
            ))}
          </ul>
        </section>

        {/* модули */}
        <section
          id="modules"
          className="mt-28 scroll-mt-24 md:mt-40"
          onMouseEnter={() => setPauseModulesAutoplay(true)}
          onMouseLeave={() => setPauseModulesAutoplay(false)}
        >
          <SectionHead title={t.ui.modulesTitle} text={t.ui.modulesText} />

          <div className="mt-10 overflow-hidden rounded-2xl border border-line">
            <div role="tablist" className="grid grid-cols-2 border-b border-line md:grid-cols-6">
              {tabs.map((tab, i) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center justify-center gap-2 border-line px-3 py-4 text-sm transition-colors ${
                      i % 2 === 0 ? "border-r" : ""
                    } ${i < 4 ? "border-b md:border-b-0" : ""} md:border-r md:last:border-r-0 ${
                      isActive ? "bg-mist font-medium text-ink" : "text-ink/55 hover:text-ink"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-brand" : ""}`} />
                    {tab.label}
                    {isActive && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand" />}
                  </button>
                );
              })}
            </div>

            <div className="relative h-[440px] overflow-hidden md:h-[540px]">
              <video ref={videoRef} autoPlay loop muted playsInline className="h-full w-full object-cover" />
              <div key={activeTab} className="absolute inset-0 animate-fade-in-overlay">
                <OverlayCard activeTab={activeTab} t={t} />
              </div>
            </div>
          </div>
        </section>

        {/* всё связано */}
        <section className="mt-28 md:mt-40">
          <SectionHead center title={t.showcase.orbit.title} text={t.showcase.orbit.text} />
          <LoopVideo name="orbit" fit="object-cover" className="-mx-5 mt-4 aspect-[16/10] sm:mx-0 sm:aspect-video md:aspect-[16/7]" />
        </section>

        <AgentMap data={t.map} />

        <section className="mt-28 space-y-24 md:mt-40 md:space-y-32">
          {rows.map((row, i) => (
            <FeatureRow key={row.id} row={row} flip={i % 2 === 1} />
          ))}
        </section>

        {/* партнёры */}
        <section id="partners" className="mt-28 md:mt-40">
          <p className="text-center text-sm text-ink/55">{t.ui.partners}</p>
          <div className="relative mt-5 overflow-hidden">
            <div className="marquee-track">
              {[...partnerLogos, ...partnerLogos].map((logo, index) => (
                <div key={`${logo.alt}-${index}`} className="mx-2 flex h-14 min-w-[180px] items-center justify-center px-4">
                  <img src={logo.src} alt={logo.alt} className="max-h-10 w-auto object-contain opacity-70 grayscale" />
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
          </div>
        </section>

        {/* видео */}
        <section id="about" className="mt-28 scroll-mt-24 md:mt-40">
          <SectionHead
            title="Узнайте больше об AdaptAI"
            text="Посмотрите видео-презентацию платформы и узнайте, как AdaptAI меняет бизнес-процессы."
          />
          <div className="mt-10 overflow-hidden rounded-2xl border border-line">
            <div className="relative w-full pb-[56.25%]">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/NG5hrOvnOrg"
                title="Узнайте больше об AdaptAI"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mt-28 grid scroll-mt-24 gap-10 md:mt-40 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <h2 className="font-display text-[2rem] font-medium tracking-[-0.03em] text-ink md:text-5xl">Частые вопросы</h2>
            <p className="mt-5 text-ink/65">О платформе, интеграциях и внедрении AdaptAI.</p>
          </div>

          <div className="border-t border-line">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={item.question} className="border-b border-line">
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="text-base font-medium text-ink md:text-lg">{item.question}</span>
                    <Plus className={`h-5 w-5 shrink-0 text-ink/50 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`} />
                  </button>
                  {isOpen && <p className="max-w-[65ch] pb-5 pr-8 leading-relaxed text-ink/70">{item.answer}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {/* финальный призыв */}
        <section className="mt-28 md:mt-40">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-mist">
            <div className="relative grid items-end gap-10 p-8 md:grid-cols-[1.4fr_1fr] md:p-14">
              <div>
                <h2 className="font-display text-[2rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink text-balance md:text-[3.4rem]">
                  {t.ui.finalTitle}
                </h2>
                <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink/65">{t.ui.finalText}</p>
                <a
                  href="mailto:ftt@fttclub.kz"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-brand-deep"
                >
                  {t.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="space-y-2 md:text-right">
                <a href="tel:+77010704342" className="block font-display text-2xl font-medium tracking-[-0.02em] text-ink tabular-nums hover:text-brand-deep md:text-3xl">
                  +7 701 070 4342
                </a>
                <a href="mailto:ftt@fttclub.kz" className="block text-lg text-ink/65 hover:text-ink">
                  ftt@fttclub.kz
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer id="contacts" className="mt-20 border-t border-line pt-10">
          <div className="grid grid-cols-1 gap-8 text-left md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <img src="/adaptai-logo.png" alt="" className="h-6 w-6 object-contain" />
                <span className="font-display text-sm font-semibold text-ink">AdaptAI</span>
              </div>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/60">
                ИИ-агенты и инструменты для продаж, склада, задач и команды. Продукт FTT, резидент Astana Hub.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-ink">Контакты</p>
              <ul className="mt-3 space-y-2 text-sm text-ink/60">
                <li><a href="tel:+77010704342" className="hover:text-ink">+7 701 070 4342</a></li>
                <li><a href="mailto:ftt@fttclub.kz" className="hover:text-ink">ftt@fttclub.kz</a></li>
                <li>г. Астана</li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium text-ink">Продукт</p>
              <ul className="mt-3 space-y-2 text-sm text-ink/60">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="transition-colors hover:text-ink">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium text-ink">Правовая информация</p>
              <ul className="mt-3 space-y-2 text-sm text-ink/60">
                <li>
                  <a href="https://fttclub.kz/privacy_policy.html" target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
                    Политика конфиденциальности
                  </a>
                </li>
                <li>
                  <a href="https://fttclub.kz/offer.html" target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
                    Публичная оферта
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col justify-between gap-2 border-t border-line py-5 text-xs text-ink/45 sm:flex-row">
            <span>© 2026 AdaptAI Platform. Все права защищены.</span>
            <span>{t.ui.status}</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
