import { Vacancy, Company, Application, StudentProfile } from './types';

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  name: "Николай Залупов",
  group: "ИВТ-301",
  faculty: "IT",
  course: 3,
  email: "zalupovnikolaj7@gmail.com",
  phone: "+7 (999) 123-45-67",
  password: "student",
  resumeFileName: "Nikolay_Zalupov_CV.pdf",
  resumeText: "Студент 3 курса направления 'Информатика и вычислительная техника'. Уверенные знания HTML, CSS, JavaScript, React, Tailwind CSS. Базовые навыки Node.js, Git. Опыт командной разработки учебных проектов. Ищу стажировку на лето."
};

export const INITIAL_COMPANIES: Company[] = [
  {
    id: "yandex",
    name: "Яндекс",
    logoColor: "bg-red-500",
    description: "Ведущая российская IT-компания, развивающая поисковую систему, интернет-порталы и службы, а также искусственный интеллект, беспилотные технологии и облачные сервисы.",
    site: "https://yandex.ru/jobs",
    verified: true,
    createdAt: "2026-01-10",
    email: "yandex@career.ru",
    password: "employer",
    contactName: "Ольга Смирнова",
    contactPhone: "+7 (495) 739-70-00"
  },
  {
    id: "tinkoff",
    name: "Т-Банк (Тинькофф)",
    logoColor: "bg-yellow-500",
    description: "Современная экосистема финансовых и лайфстайл-услуг для частных лиц и бизнеса. Крупнейший независимый онлайн-банк в мире.",
    site: "https://career.tbank.ru",
    verified: true,
    createdAt: "2026-02-15",
    email: "tinkoff@career.ru",
    password: "employer",
    contactName: "Дмитрий Воронов",
    contactPhone: "+7 (800) 555-77-78"
  },
  {
    id: "sber",
    name: "Сбер",
    logoColor: "bg-emerald-600",
    description: "Крупнейший банк и технологический лидер страны, активно развивающий искусственный интеллект, облачные решения и цифровые сервисы для миллионов пользователей.",
    site: "https://sbergraduate.ru",
    verified: true,
    createdAt: "2026-03-01",
    email: "sber@career.ru",
    password: "employer",
    contactName: "Михаил Петров",
    contactPhone: "+7 (495) 500-55-50"
  },
  {
    id: "pixel_studio",
    name: "Студия Пиксель",
    logoColor: "bg-purple-600",
    description: "Креативное дизайн-агентство полного цикла. Занимаемся разработкой айдентики, веб-дизайном, созданием мобильных приложений и 3D-графики для бизнеса.",
    site: "https://pixeldesign.ru",
    verified: true,
    createdAt: "2026-04-12",
    email: "pixel@career.ru",
    password: "employer",
    contactName: "Анна Кузнецова",
    contactPhone: "+7 (903) 987-65-43"
  },
  {
    id: "smart_eng",
    name: "Умные Инженерные Системы",
    logoColor: "bg-blue-600",
    description: "Научно-производственное предприятие, разрабатывающее датчики, автоматизированные системы управления технологическими процессами и робототехнику.",
    site: "https://smartsystems.ru",
    verified: false,
    createdAt: "2026-06-28",
    email: "smart@career.ru",
    password: "employer",
    contactName: "Иван Федорович",
    contactPhone: "+7 (812) 333-22-11"
  },
  {
    id: "crypto_pay",
    name: "КриптоПей Солюшнс",
    logoColor: "bg-orange-500",
    description: "Блокчейн-стартап в сфере финтеха, создающий децентрализованные платежные шлюзы для международного рынка.",
    site: "https://cryptopay.net",
    verified: false,
    createdAt: "2026-07-02",
    email: "crypto@career.ru",
    password: "employer",
    contactName: "Алексей Смирнов",
    contactPhone: "+7 (999) 777-88-99"
  }
];

export const INITIAL_VACANCIES: Vacancy[] = [
  {
    id: "vac-1",
    title: "Стажёр Frontend-разработчик (React)",
    companyId: "yandex",
    companyName: "Яндекс",
    type: "internship",
    schedule: "flexible",
    salary: {
      from: 45000,
      to: 60000,
      currency: "₽",
      negotiable: false
    },
    requirements: {
      courseFrom: 3,
      courseTo: 4,
      faculty: "IT",
      skills: ["React", "TypeScript", "TailwindCSS", "REST API", "Git"]
    },
    duties: [
      "Разработка интерфейсов внутренних сервисов Яндекса под руководством опытного ментора.",
      "Покрытие кода юнит-тестами и участие в код-ревью.",
      "Верстка адаптивных и кроссбраузерных веб-страниц.",
      "Интеграция с бэкенд-сервисами по API."
    ],
    conditions: [
      "Оплачиваемая стажировка с возможностью перехода в штат по результатам.",
      "Полная совместимость с учёбой (гибкий график от 20 часов в неделю).",
      "Бесплатные обеды в офисе, кофе-пойнты и комфортная рабочая зона.",
      "Доступ к обучающей платформе Яндекса."
    ],
    contactPerson: {
      name: "Ольга Смирнова",
      email: "hr-intern@yandex-team.ru",
      phone: "+7 (495) 739-70-00"
    },
    deadline: "2026-08-31",
    status: "active",
    createdAt: "2026-06-15",
    views: 124,
    appliesCount: 15
  },
  {
    id: "vac-2",
    title: "Стажёр-аналитик данных (Python/SQL)",
    companyId: "tinkoff",
    companyName: "Т-Банк (Тинькофф)",
    type: "internship",
    schedule: "remote",
    salary: {
      currency: "₽",
      negotiable: true
    },
    requirements: {
      courseFrom: 3,
      courseTo: 5,
      faculty: "IT",
      skills: ["Python", "SQL", "Pandas", "PowerBI", "Математическая статистика"]
    },
    duties: [
      "Сбор данных из различных СУБД (PostgreSQL, ClickHouse).",
      "Очистка, обработка и анализ показателей продуктовых метрик.",
      "Построение интерактивных дашбордов для продуктовой команды.",
      "Проверка продуктовых гипотез с помощью A/B-тестирования."
    ],
    conditions: [
      "Полностью удаленный формат работы или гибрид (офисы в Москве и Санкт-Петербурге).",
      "Гибкий график: можно работать от 25 часов в неделю в удобное время.",
      "Сильное комьюнити аналитиков, регулярные митапы и внутреннее обучение.",
      "Оформление по ТК РФ с первого дня стажировки."
    ],
    contactPerson: {
      name: "Дмитрий Воронов",
      email: "d.voronov@tbank.ru"
    },
    deadline: "2026-07-25",
    status: "active",
    createdAt: "2026-06-18",
    views: 98,
    appliesCount: 8
  },
  {
    id: "vac-3",
    title: "Производственная практика по направлению UX/UI дизайн",
    companyId: "pixel_studio",
    companyName: "Студия Пиксель",
    type: "practice",
    schedule: "flexible",
    salary: {
      currency: "₽",
      negotiable: true
    },
    requirements: {
      courseFrom: 2,
      courseTo: 4,
      faculty: "Design",
      skills: ["Figma", "CUSTDEV", "UI-Kit", "UX-исследования", "Адаптивный дизайн"]
    },
    duties: [
      "Проведение исследований пользовательского опыта для текущих коммерческих сайтов.",
      "Отрисовка wireframe-ов и кликабельных прототипов в Figma.",
      "Участие в брейнштормах дизайн-команды по улучшению интерфейсов.",
      "Подготовка отчета по производственной практике для вуза."
    ],
    conditions: [
      "Официальное оформление договора практики с вузом.",
      "Предоставление всех необходимых характеристик, отзывов и подписей для учебной части.",
      "Возможность получения коммерческого кейса в портфолио.",
      "Гибкий график (согласуем индивидуально, чтобы не пропускать лекции)."
    ],
    contactPerson: {
      name: "Анна Кузнецова",
      email: "hr@pixeldesign.ru",
      phone: "+7 (903) 987-65-43"
    },
    deadline: "2026-07-20",
    status: "active",
    createdAt: "2026-06-25",
    views: 45,
    appliesCount: 3
  },
  {
    id: "vac-4",
    title: "Финансовый аналитик (Младший специалист)",
    companyId: "sber",
    companyName: "Сбер",
    type: "part-time",
    schedule: "standard",
    salary: {
      from: 55000,
      currency: "₽",
      negotiable: false
    },
    requirements: {
      courseFrom: 4,
      courseTo: 5,
      faculty: "Economy",
      skills: ["Excel (Макросы, ВПР)", "Корпоративные финансы", "Экономика предприятия", "PowerPoint"]
    },
    duties: [
      "Участие в подготовке консолидированной финансовой отчетности подразделения.",
      "Анализ отклонений фактических показателей бюджета от плановых.",
      "Подготовка презентаций и аналитических справок для руководства.",
      "Работа с большими массивами данных в Excel."
    ],
    conditions: [
      "Частичная занятость (20-30 часов в неделю), график согласуется.",
      "Современный офис в Сбер-Сити (м. Кутузовская).",
      "Корпоративный фитнес-центр и льготная ипотека для сотрудников.",
      "Уникальная база знаний и курсы Корпоративного Университета Сбера."
    ],
    contactPerson: {
      name: "Михаил Петров",
      email: "petrov-m@sber.ru"
    },
    deadline: "2026-08-15",
    status: "active",
    createdAt: "2026-06-20",
    views: 82,
    appliesCount: 5
  },
  {
    id: "vac-5",
    title: "Младший инженер по автоматизации (АСУ ТП)",
    companyId: "smart_eng",
    companyName: "Умные Инженерные Системы",
    type: "full-time",
    schedule: "shift",
    salary: {
      from: 70000,
      to: 90000,
      currency: "₽",
      negotiable: false
    },
    requirements: {
      courseFrom: 4,
      courseTo: 5,
      faculty: "Engineering",
      skills: ["Контроллеры ПЛК", "SCADA", "Чтение электросхем", "C++ / ST", "Компас-3D"]
    },
    duties: [
      "Участие в пусконаладочных работах промышленного оборудования на объектах.",
      "Разработка и корректировка прикладного ПО для контроллеров ПЛК.",
      "Конфигурирование систем диспетчеризации (SCADA).",
      "Оформление технической документации."
    ],
    conditions: [
      "Официальное оформление по ТК РФ, полный соцпакет.",
      "Возможность совмещения с написанием диплома (предоставляем научные данные).",
      "Выдача спецодежды, оплата командировочных расходов.",
      "Наставничество со стороны опытных инженеров-конструкторов."
    ],
    contactPerson: {
      name: "Иван Федорович",
      email: "i.fedorov@smartsystems.ru",
      phone: "+7 (812) 333-22-11"
    },
    deadline: "2026-07-30",
    status: "active",
    createdAt: "2026-06-29",
    views: 31,
    appliesCount: 2
  },
  {
    id: "vac-pending-1",
    title: "Junior Golang Developer (Web3 / Crypto)",
    companyId: "crypto_pay",
    companyName: "КриптоПей Солюшнс",
    type: "full-time",
    schedule: "remote",
    salary: {
      from: 100000,
      to: 150000,
      currency: "₽",
      negotiable: false
    },
    requirements: {
      courseFrom: 3,
      courseTo: 5,
      faculty: "IT",
      skills: ["Go", "Docker", "PostgreSQL", "gRPC", "Solidity"]
    },
    duties: [
      "Разработка высоконагруженных микросервисов для обработки транзакций.",
      "Написание смарт-контрактов и интеграция их с Go-сервисами.",
      "Оптимизация SQL-запросов и структуры базы данных."
    ],
    conditions: [
      "Полностью удаленная работа, гибкое начало дня.",
      "Оплата в криптовалюте или рублях по выбору.",
      "Оплачиваемый отпуск и больничные."
    ],
    contactPerson: {
      name: "Алексей Смирнов",
      email: "hr@cryptopay.net"
    },
    deadline: "2026-09-01",
    status: "pending", // На модерации!
    createdAt: "2026-07-02",
    views: 0,
    appliesCount: 0
  },
  {
    id: "vac-pending-2",
    title: "Копирайтер / Наполнитель контента",
    companyId: "crypto_pay",
    companyName: "КриптоПей Солюшнс",
    type: "part-time",
    schedule: "remote",
    salary: {
      from: 20000,
      to: 35000,
      currency: "₽",
      negotiable: true
    },
    requirements: {
      courseFrom: 1,
      courseTo: 5,
      faculty: "Humanities",
      skills: ["Копирайтинг", "Грамотный русский язык", "SEO", "Креативность"]
    },
    duties: [
      "Написание статей про блокчейн-технологии простым языком для корпоративного блога.",
      "Создание постов в социальные сети компании.",
      "Вычитка и корректировка текстов интерфейса."
    ],
    conditions: [
      "Свободный график, занятость около 10-15 часов в неделю.",
      "Идеально подходит для студентов гуманитарных направлений с 1 курса.",
      "Быстрое обучение основам финтеха за счет компании."
    ],
    contactPerson: {
      name: "Алексей Смирнов",
      email: "hr@cryptopay.net"
    },
    deadline: "2026-08-01",
    status: "pending", // На модерации!
    createdAt: "2026-07-02",
    views: 0,
    appliesCount: 0
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: "app-1",
    vacancyId: "vac-1",
    vacancyTitle: "Стажёр Frontend-разработчик (React)",
    companyId: "yandex",
    companyName: "Яндекс",
    studentName: "Николай Залупов",
    studentEmail: "zalupovnikolaj7@gmail.com",
    studentPhone: "+7 (999) 123-45-67",
    studentFaculty: "IT",
    studentGroup: "ИВТ-301",
    studentCourse: 3,
    resumeFileName: "Nikolay_Zalupov_CV.pdf",
    resumeText: "Студент 3 курса направления 'Информатика и вычислительная техника'. Уверенные знания HTML, CSS, JavaScript, React, Tailwind CSS. Ищу стажировку на лето.",
    coverLetter: "Здравствуйте! Буду очень рад пройти стажировку в команде Яндекса. Имею опыт учебных проектов на React и TypeScript, готов активно учиться и работать над реальными сервисами.",
    status: "invited", // Приглашен!
    statusComment: "Николай, добрый день! Ваше резюме нас заинтересовало. Приглашаем вас на техническое собеседование в Zoom 8 июля в 15:00. Ссылка отправлена вам на почту.",
    statusChangedAt: "2026-06-20",
    createdAt: "2026-06-16"
  },
  {
    id: "app-2",
    vacancyId: "vac-2",
    vacancyTitle: "Стажёр-аналитик данных (Python/SQL)",
    companyId: "tinkoff",
    companyName: "Т-Банк (Тинькофф)",
    studentName: "Николай Залупов",
    studentEmail: "zalupovnikolaj7@gmail.com",
    studentPhone: "+7 (999) 123-45-67",
    studentFaculty: "IT",
    studentGroup: "ИВТ-301",
    studentCourse: 3,
    resumeFileName: "Nikolay_Zalupov_CV.pdf",
    resumeText: "Студент 3 курса направления 'Информатика и вычислительная техника'. Уверенные знания HTML, CSS, JavaScript, React, Tailwind CSS. Ищу стажировку на лето.",
    coverLetter: "Здравствуйте! Интересуюсь аналитикой данных. Знаю основы Python и умею писать несложные SQL-запросы SELECT/JOIN. Хотел бы применить свои математические навыки в Т-Банке.",
    status: "viewed", // Просмотрен
    statusChangedAt: "2026-06-22",
    createdAt: "2026-06-19"
  }
];
