export type EmploymentType = 
  | 'internship'      // Стажировка
  | 'practice'        // Производственная практика
  | 'part-time'       // Частичная занятость (до 20 ч/нед)
  | 'full-time'       // Полная занятость
  | 'project';        // Проектная работа

export type JobSchedule = 
  | 'flexible'        // Гибкий график
  | 'shift'           // Сменный график
  | 'standard'        // 5/2
  | 'remote';         // Удалённо

export type Faculty = 
  | 'IT'              // Информационные технологии
  | 'Economy'         // Экономика и менеджмент
  | 'Design'          // Дизайн и медиа
  | 'Engineering'     // Инженерия и физика
  | 'Humanities';     // Гуманитарные науки

export type ApplicationStatus = 
  | 'new'             // Новый
  | 'viewed'          // Просмотрен
  | 'invited'         // Приглашён
  | 'rejected';       // Отказ

export type VacancyStatus = 
  | 'active'          // Опубликовано / Активно
  | 'pending'         // На модерации
  | 'rejected'        // Отклонено модератором
  | 'archived';       // В архиве

export interface Vacancy {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  type: EmploymentType;
  schedule: JobSchedule;
  salary: {
    from?: number;
    to?: number;
    currency: string;
    negotiable: boolean;
  };
  requirements: {
    courseFrom: number; // например, с 3 курса
    courseTo: number;
    faculty: Faculty;
    skills: string[];
  };
  duties: string[]; // Обязанности (буллиты)
  conditions: string[]; // Условия
  contactPerson: {
    name: string;
    email: string;
    phone?: string;
  };
  deadline: string; // Формат YYYY-MM-DD
  status: VacancyStatus;
  rejectionComment?: string;
  createdAt: string;
  views: number;
  appliesCount: number;
}

export interface Company {
  id: string;
  name: string;
  logoColor: string; // Tailwind color class for mock logo
  description: string;
  site: string;
  verified: boolean;
  createdAt: string;
  email?: string;
  password?: string;
  contactName?: string;
  contactPhone?: string;
}

export interface Application {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  companyId: string;
  companyName: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentFaculty: Faculty;
  studentGroup: string;
  studentCourse: number;
  resumeFileName?: string;
  resumeFileData?: string;
  resumeText?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  statusComment?: string;
  statusChangedAt: string;
  createdAt: string;
}

export interface StudentProfile {
  name: string;
  group: string;
  faculty: Faculty;
  course: number;
  email: string;
  phone: string;
  password?: string;
  resumeFileName?: string;
  resumeFileData?: string;
  resumeText?: string;
}

export type UserRole = 'student' | 'employer' | 'moderator' | 'stats';
