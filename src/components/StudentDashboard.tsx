import React from 'react';
import { Vacancy, Application, StudentProfile, Faculty, EmploymentType, JobSchedule } from '../types';

function formatFIO(fullName: string): string {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  
  if (parts.length >= 3) {
    const surname = parts[0];
    const nameInit = parts[1][0] ? `${parts[1][0]}.` : '';
    const patInit = parts[2][0] ? `${parts[2][0]}.` : '';
    return `${surname} ${nameInit}${patInit ? ' ' + patInit : ''}`;
  }
  
  if (parts.length === 2) {
    const p1 = parts[0];
    const p2 = parts[1];
    
    const surnameEndings = ['ов', 'ова', 'ев', 'ева', 'ин', 'ина', 'их', 'ых', 'ский', 'ская', 'цкий', 'цкая', 'юк', 'ук', 'енко'];
    const isP2Surname = surnameEndings.some(ending => p2.toLowerCase().endsWith(ending));
    const isP1Surname = surnameEndings.some(ending => p1.toLowerCase().endsWith(ending));
    
    if (isP2Surname && !isP1Surname) {
      return `${p2} ${p1[0]}.`;
    } else {
      return `${p1} ${p2[0]}.`;
    }
  }
  
  return fullName;
}
import { 
  Search, Filter, Briefcase, Calendar, MapPin, Coins, BookOpen, 
  CheckCircle, ArrowRight, User, Upload, FileText, Check, AlertCircle, Clock, Bell
} from 'lucide-react';

interface StudentDashboardProps {
  vacancies: Vacancy[];
  applications: Application[];
  studentProfile: StudentProfile | null;
  onUpdateProfile?: (profile: StudentProfile) => void;
  onApply: (vacancyId: string, coverLetter: string, resumeFile?: File | null) => void;
  onLoginPrompt?: () => void;
}

export default function StudentDashboard({
  vacancies,
  applications,
  studentProfile,
  onUpdateProfile,
  onApply,
  onLoginPrompt
}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = React.useState<'catalog' | 'profile'>('catalog');
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<string>('all');
  const [selectedFaculty, setSelectedFaculty] = React.useState<string>('all');
  const [selectedSchedule, setSelectedSchedule] = React.useState<string>('all');
  const [compatibleOnly, setCompatibleOnly] = React.useState(false);

  // Selected Job for detail view Modal
  const [selectedVacancy, setSelectedVacancy] = React.useState<Vacancy | null>(null);
  const [coverLetter, setCoverLetter] = React.useState('');
  const [uploadedFileName, setUploadedFileName] = React.useState<string | null>(null);
  const [applySuccess, setApplySuccess] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);

  // Resume state in profile edit
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  const [editedPhone, setEditedPhone] = React.useState(studentProfile ? studentProfile.phone : '');
  const [editedResume, setEditedResume] = React.useState(studentProfile ? (studentProfile.resumeText || '') : '');

  // Subscription Settings state
  const [subscribingIT, setSubscribingIT] = React.useState(true);
  const [subscribingInternships, setSubscribingInternships] = React.useState(true);
  const [subStatus, setSubStatus] = React.useState<'idle' | 'saved'>('idle');

  // Filter approved/active vacancies
  const activeVacancies = vacancies.filter(v => v.status === 'active');

  const filteredVacancies = activeVacancies.filter(v => {
    const matchesSearch = 
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.requirements.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'all' || v.type === selectedType;
    const matchesFaculty = selectedFaculty === 'all' || v.requirements.faculty === selectedFaculty;
    const matchesSchedule = selectedSchedule === 'all' || v.schedule === selectedSchedule;
    
    // "Compatible with study" check: Internship, Practice, Part-time, or Flexible/Remote
    const isCompatible = 
      v.type === 'internship' || 
      v.type === 'practice' || 
      v.type === 'part-time' || 
      v.schedule === 'flexible' || 
      v.schedule === 'remote';
    
    const matchesCompatibility = !compatibleOnly || isCompatible;

    return matchesSearch && matchesType && matchesFaculty && matchesSchedule && matchesCompatibility;
  });

  // Handle uploader
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const triggerApply = () => {
    if (!selectedVacancy) return;
    onApply(selectedVacancy.id, coverLetter);
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setSelectedVacancy(null);
      setCoverLetter('');
      setUploadedFileName(null);
    }, 2000);
  };

  const saveProfile = () => {
    onUpdateProfile({
      ...studentProfile,
      phone: editedPhone,
      resumeText: editedResume,
      resumeFileName: uploadedFileName || studentProfile.resumeFileName
    });
    setIsEditingProfile(false);
  };

  const saveSubscription = () => {
    setSubStatus('saved');
    setTimeout(() => setSubStatus('idle'), 2000);
  };

  const getFacultyBadgeColor = (fac: Faculty) => {
    switch(fac) {
      case 'IT': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Economy': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Design': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Engineering': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getEmploymentTypeName = (type: EmploymentType) => {
    switch(type) {
      case 'internship': return 'Стажировка';
      case 'practice': return 'Практика';
      case 'part-time': return 'Частичная занятость';
      case 'full-time': return 'Полная занятость';
      case 'project': return 'Проектная работа';
    }
  };

  const getScheduleName = (sch: JobSchedule) => {
    switch(sch) {
      case 'flexible': return 'Гибкий график';
      case 'shift': return 'Сменный график';
      case 'standard': return 'Офис 5/2';
      case 'remote': return 'Удалённо';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">● Отправлен</span>;
      case 'viewed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-100">● Просмотрен</span>;
      case 'invited':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">✓ Приглашён</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">✕ Отказ</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Student Welcome Banner */}
      <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800 relative overflow-hidden" id="student-welcome-banner">
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-5 pointer-events-none">
          <BookOpen className="h-64 w-64 text-white" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border border-blue-500/30">
                {studentProfile ? 'Кабинет Студента (ЭОС авторизация)' : 'Гостевой просмотр'}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {studentProfile ? `Здравствуйте, ${formatFIO(studentProfile.name)}!` : 'Цифровая карьерная среда'}
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              {studentProfile ? (
                <>Факультет: <strong className="text-slate-200">{studentProfile.faculty}</strong> • Группа: <strong className="text-slate-200">{studentProfile.group}</strong> • Курс: <strong className="text-slate-200">{studentProfile.course}</strong></>
              ) : (
                'Ознакомьтесь с актуальными вакансиями и стажировками. Войдите в кабинет, чтобы отправить отклик на вакансию.'
              )}
            </p>
          </div>
          
          {studentProfile && (
            <div className="flex gap-2">
              <button
                id="tab-profile-btn"
                onClick={() => setActiveTab(activeTab === 'profile' ? 'catalog' : 'profile')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'profile' 
                    ? 'bg-white text-slate-950 shadow-sm border border-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-transparent'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>{activeTab === 'profile' ? 'Вернуться к вакансиям' : `Личный кабинет (${applications.length})`}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {activeTab === 'catalog' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-5 h-fit" id="job-filters-panel">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                <Filter className="h-4 w-4 text-indigo-500" />
                Фильтры поиска
              </h2>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setSelectedFaculty('all');
                  setSelectedSchedule('all');
                  setCompatibleOnly(false);
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              >
                Сбросить
              </button>
            </div>

            {/* Compatible with Study Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-indigo-50/50 border border-indigo-100 cursor-pointer hover:bg-indigo-50 transition-colors">
                <input
                  type="checkbox"
                  id="compatible-study-checkbox"
                  checked={compatibleOnly}
                  onChange={(e) => setCompatibleOnly(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <div>
                  <span className="text-xs font-semibold text-indigo-900 block">Совместимо с учёбой</span>
                  <span className="text-[10px] text-indigo-600 block leading-tight">Практика, стажировка, гибкий/удалённый график</span>
                </div>
              </label>
            </div>

            {/* Employment Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Тип занятости</label>
              <select
                id="filter-type-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Все форматы</option>
                <option value="internship">Стажировка</option>
                <option value="practice">Производственная практика</option>
                <option value="part-time">Частичная (до 20 ч/нед)</option>
                <option value="full-time">Полная занятость</option>
                <option value="project">Проектная работа</option>
              </select>
            </div>

            {/* Faculty */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Направление / Факультет</label>
              <select
                id="filter-faculty-select"
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Любое направление</option>
                <option value="IT">IT-технологии / Программирование</option>
                <option value="Economy">Экономика и менеджмент</option>
                <option value="Design">Дизайн и медиа</option>
                <option value="Engineering">Инженерия и физика</option>
                <option value="Humanities">Гуманитарные науки</option>
              </select>
            </div>

            {/* Schedule */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">График работы</label>
              <select
                id="filter-schedule-select"
                value={selectedSchedule}
                onChange={(e) => setSelectedSchedule(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Все графики</option>
                <option value="flexible">Гибкий график</option>
                <option value="shift">Сменный график</option>
                <option value="standard">Офис 5/2</option>
                <option value="remote">Удалённая работа</option>
              </select>
            </div>

            {/* Profile sync note */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 text-[11px] text-slate-500 leading-normal">
              <div className="flex gap-1.5 items-center mb-1 text-slate-700 font-medium">
                <AlertCircle className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0" />
                <span>Ограничения вуза</span>
              </div>
              {studentProfile ? (
                <>Система автоматически выделяет теги на соответствие вашему курсу (<strong className="text-indigo-600">{studentProfile.course} курс</strong>) и направлению подготовки.</>
              ) : (
                <>Войдите в систему, чтобы автоматически подсвечивать вакансии, подходящие под ваш курс и направление подготовки.</>
              )}
            </div>

          </div>

          {/* Job Listings Loop */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                id="job-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по должности, компании, ключевым навыкам..."
                className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Найдено вакансий: <strong>{filteredVacancies.length}</strong></span>
              {compatibleOnly && <span className="text-indigo-600 font-medium">Включен фильтр совместимости с учебой</span>}
            </div>

            {/* Cards Grid */}
            {filteredVacancies.length > 0 ? (
              <div className="space-y-4" id="vacancy-cards-list">
                {filteredVacancies.map(v => {
                  const alreadyApplied = applications.some(app => app.vacancyId === v.id);
                  const isMatchingCourse = studentProfile ? (studentProfile.course >= v.requirements.courseFrom && studentProfile.course <= v.requirements.courseTo) : false;
                  const isMatchingFaculty = studentProfile ? (studentProfile.faculty === v.requirements.faculty) : false;

                  return (
                    <div 
                      key={v.id}
                      id={`vacancy-card-${v.id}`}
                      onClick={() => setSelectedVacancy(v)}
                      className="group bg-white rounded-xl border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 cursor-pointer relative overflow-hidden"
                    >
                      {/* Left color strip */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 group-hover:bg-indigo-600 transition-colors"></div>

                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                              {v.companyName}
                            </span>
                            <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${getFacultyBadgeColor(v.requirements.faculty)}`}>
                              {v.requirements.faculty}
                            </span>
                            <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded">
                              {getEmploymentTypeName(v.type)}
                            </span>
                          </div>

                          <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                            {v.title}
                          </h3>

                          {/* Stats and metadata row */}
                          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium flex-wrap">
                            <span className="flex items-center gap-1.5">
                              <Coins className="h-3.5 w-3.5 text-slate-400" />
                              {v.salary.negotiable 
                                ? 'по договорённости' 
                                : `${v.salary.from ? `от ${v.salary.from.toLocaleString()}` : ''} ${v.salary.to ? `до ${v.salary.to.toLocaleString()}` : ''} ${v.salary.currency}`}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              {getScheduleName(v.schedule)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                              Рекомендовано: {v.requirements.courseFrom}–{v.requirements.courseTo} курс
                            </span>
                          </div>

                          {/* Skills tags */}
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {v.requirements.skills.map((skill, index) => (
                              <span key={index} className="text-[10px] font-mono bg-slate-50 border border-slate-150 text-slate-600 px-2 py-0.5 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Apply badge / Date */}
                        <div className="flex flex-col items-end justify-between h-full min-w-[100px] flex-shrink-0 text-right gap-3">
                          <span className="text-[11px] text-slate-400 font-mono">
                            До {new Date(v.deadline).toLocaleDateString('ru-RU')}
                          </span>
                          
                          {alreadyApplied ? (
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-1 rounded border border-emerald-100 flex items-center gap-1">
                              ✓ Отклик отправлен
                            </span>
                          ) : (
                            <span className="text-xs text-indigo-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                              Подробнее <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          )}

                          {/* Faculty compatibility highlight */}
                          <div className="flex gap-1.5">
                            {isMatchingFaculty && isMatchingCourse && (
                              <span className="text-[9px] bg-green-500/10 text-green-700 px-1.5 py-0.5 rounded font-medium">
                                Полное совпадение
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-slate-200 py-12 px-4 text-center">
                <p className="text-slate-500 text-sm">Нет вакансий, соответствующих вашим критериям фильтрации.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                    setSelectedFaculty('all');
                    setSelectedSchedule('all');
                    setCompatibleOnly(false);
                  }}
                  className="mt-3 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Сбросить все фильтры
                </button>
              </div>
            )}

          </div>

        </div>
      ) : (
        
        /* STUDENT PROFILE & APPLICATIONS CABINET */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="student-cabinet-view">
          
          {/* Active Applications Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2 border-b border-slate-150 pb-3">
                <Briefcase className="h-5 w-5 text-indigo-500" />
                История моих откликов ({applications.length})
              </h2>

              {applications.length > 0 ? (
                <div className="space-y-4" id="applications-list">
                  {applications.map(app => {
                    const matchedVacancy = vacancies.find(v => v.id === app.vacancyId);
                    return (
                      <div 
                        key={app.id} 
                        id={`application-item-${app.id}`}
                        className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-bold text-sm text-slate-800">
                              {app.vacancyTitle}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                              Компания: <span className="text-slate-700 font-semibold">{app.companyName}</span>
                            </p>
                          </div>
                          <div>
                            {getStatusBadge(app.status)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2 mt-2">
                          <span>Отправлен: {new Date(app.createdAt).toLocaleDateString('ru-RU')}</span>
                          {app.resumeFileName && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3 text-slate-400" />
                              Резюме: {app.resumeFileName}
                            </span>
                          )}
                        </div>

                        {/* Employer Feedback Block */}
                        {app.statusComment && (
                          <div className="mt-3 p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-xs text-indigo-950">
                            <strong className="block text-indigo-900 mb-1">
                              📨 Ответ представителя компании:
                            </strong>
                            <p className="italic leading-normal text-indigo-950">« {app.statusComment} »</p>
                            <span className="text-[10px] text-indigo-500 mt-1.5 block">
                              Изменено: {new Date(app.statusChangedAt).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-400 text-sm">Вы ещё не откликались на вакансии.</p>
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="mt-4 text-xs bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors"
                  >
                    Перейти в каталог вакансий
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Student CV / Profile Management */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-slate-900 tracking-tight border-b border-slate-150 pb-2">
                📂 Резюме и подписки (ЭОС)
              </h2>

              {isEditingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Телефон для связи</label>
                    <input
                      type="text"
                      id="edit-profile-phone"
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Текст резюме</label>
                    <textarea
                      id="edit-profile-resume-text"
                      rows={6}
                      value={editedResume}
                      onChange={(e) => setEditedResume(e.target.value)}
                      placeholder="Расскажите о своих навыках, технологиях, опыте учебных проектов..."
                      className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      id="save-profile-btn"
                      onClick={saveProfile}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 block">Загруженный файл:</span>
                    <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 border border-indigo-100 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 w-full">
                      <FileText className="h-4 w-4" />
                      {studentProfile.resumeFileName || 'Резюме не прикреплено'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 block">Краткое резюме:</span>
                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-150 leading-relaxed max-h-40 overflow-y-auto">
                      {studentProfile.resumeText || 'Ничего не заполнено.'}
                    </p>
                  </div>

                  <button
                    id="edit-profile-btn"
                    onClick={() => {
                      setEditedPhone(studentProfile.phone);
                      setEditedResume(studentProfile.resumeText || '');
                      setIsEditingProfile(true);
                    }}
                    className="w-full text-xs border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 text-indigo-600 font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Редактировать резюме
                  </button>
                </div>
              )}
            </div>

            {/* Notification Subscription Setup */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Bell className="h-4 w-4 text-slate-500" />
                Настройка подписки на новые вакансии
              </h3>
              <p className="text-[11px] text-slate-400">
                Получайте рассылку на почту <strong className="text-slate-600">{studentProfile.email}</strong> по заданным критериям вуза.
              </p>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subscribingIT}
                    onChange={(e) => setSubscribingIT(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Все IT-вакансии для моего факультета</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subscribingInternships}
                    onChange={(e) => setSubscribingInternships(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Стажировки и практики для 3 курса</span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  id="save-subscription-btn"
                  onClick={saveSubscription}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors"
                >
                  {subStatus === 'saved' ? '✓ Сохранено!' : 'Сохранить настройки'}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* DETAILED VACANCY MODAL OVERLAY */}
      {selectedVacancy && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs" id="job-detail-modal">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-150 relative">
              <button 
                id="close-modal-btn"
                onClick={() => setSelectedVacancy(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 text-base font-bold font-mono px-2"
              >
                ✕
              </button>
              
              <div className="flex items-center gap-2.5 mb-2">
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {selectedVacancy.companyName}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getFacultyBadgeColor(selectedVacancy.requirements.faculty)}`}>
                  {selectedVacancy.requirements.faculty}
                </span>
                <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded">
                  {getEmploymentTypeName(selectedVacancy.type)}
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {selectedVacancy.title}
              </h2>

              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                Компания: <strong className="text-slate-800">{selectedVacancy.companyName}</strong> • Опубликовано: {new Date(selectedVacancy.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              
              {/* Core Parameters grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-150">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Оплата</span>
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
                    <Coins className="h-3.5 w-3.5 text-indigo-500" />
                    {selectedVacancy.salary.negotiable 
                      ? 'Договорная' 
                      : `${selectedVacancy.salary.from ? `от ${selectedVacancy.salary.from.toLocaleString()}` : ''} ${selectedVacancy.salary.to ? `до ${selectedVacancy.salary.to.toLocaleString()}` : ''} ${selectedVacancy.salary.currency}`}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Рекомендованный курс</span>
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                    {selectedVacancy.requirements.courseFrom}–{selectedVacancy.requirements.courseTo} курсы
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Режим работы</span>
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-indigo-500" />
                    {getScheduleName(selectedVacancy.schedule)}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Срок подачи заявок</span>
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                    До {new Date(selectedVacancy.deadline).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>

              {/* Duties */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-800 tracking-tight">📝 Обязанности:</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600 leading-normal pl-1">
                  {selectedVacancy.duties.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>

              {/* Conditions */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-800 tracking-tight">💼 Условия работы и развития:</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600 leading-normal pl-1">
                  {selectedVacancy.conditions.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>

              {/* Skills required */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-800 tracking-tight">🛠️ Требуемые навыки и технологии:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVacancy.requirements.skills.map((skill, index) => (
                    <span key={index} className="text-xs font-mono bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact person */}
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                <strong className="text-slate-700 text-xs block">📞 Контакты работодателя:</strong>
                <p className="text-slate-600">
                  {selectedVacancy.contactPerson.name} • Email: <a href={`mailto:${selectedVacancy.contactPerson.email}`} className="text-indigo-600 font-semibold hover:underline">{selectedVacancy.contactPerson.email}</a>
                  {selectedVacancy.contactPerson.phone && ` • Тел: ${selectedVacancy.contactPerson.phone}`}
                </p>
              </div>

              {/* APPLY FORM ENGINE (Only show if not already applied) */}
              <div className="border-t border-slate-150 pt-5 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
                  📬 Отправка отклика работодателю
                </h3>

                {!studentProfile ? (
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl text-center space-y-3">
                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">Требуется авторизация</h4>
                      <p className="text-[10px] text-slate-500 mt-1 max-w-sm mx-auto leading-normal">
                        Чтобы отправить резюме на эту вакансию, пожалуйста, войдите в свой личный кабинет студента.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedVacancy(null);
                        onLoginPrompt?.();
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-lg transition-colors cursor-pointer inline-block"
                    >
                      Войти и откликнуться
                    </button>
                  </div>
                ) : applications.some(app => app.vacancyId === selectedVacancy.id) ? (
                  <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl text-center text-emerald-800">
                    <p className="font-bold text-xs flex items-center justify-center gap-1.5">
                      <CheckCircle className="h-4 w-4" /> Вы уже отправляли отклик на эту вакансию!
                    </p>
                    <p className="text-[11px] mt-1 text-emerald-600">Статус отклика можно отслеживать в личном кабинете.</p>
                  </div>
                ) : applySuccess ? (
                  <div className="bg-emerald-500 text-white p-4 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-2 animate-bounce">
                    <Check className="h-4 w-4" /> Отклик успешно доставлен работодателю через ЭОС!
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-[11px] text-indigo-950 leading-normal">
                      <strong>Автозаполнение вуза:</strong> При отправке отклика работодатель автоматически получит ваш профиль студента: <strong className="text-indigo-900">{studentProfile.name}</strong>, группа {studentProfile.group}, факультет {studentProfile.faculty}, курс {studentProfile.course}, email {studentProfile.email}.
                    </div>

                    {/* Resume Source selector */}
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1">Файл резюме:</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Profile Resume */}
                        <div className="p-3 border border-indigo-200 rounded-lg bg-indigo-50/25 space-y-1 flex flex-col justify-between">
                          <div>
                            <span className="font-bold text-xs text-indigo-900 block">По умолчанию из ЭОС</span>
                            <span className="text-[10px] text-indigo-600 block leading-snug">Прикрепится ваше резюме: {studentProfile.resumeFileName}</span>
                          </div>
                          <span className="text-[10px] text-indigo-500 italic block mt-1">✓ Выбрано по умолчанию</span>
                        </div>

                        {/* File Uploader box */}
                        <div 
                          className={`p-3 border rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                            dragActive ? 'border-indigo-600 bg-indigo-50/20' : 'border-dashed border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                          }`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                        >
                          <input 
                            type="file" 
                            id="resume-upload" 
                            className="hidden" 
                            accept=".pdf,.docx,.doc" 
                            onChange={handleFileChange}
                          />
                          <label htmlFor="resume-upload" className="cursor-pointer text-center flex flex-col items-center">
                            <Upload className="h-4 w-4 text-slate-400 mb-1" />
                            <span className="font-semibold text-[10px] text-slate-700 block">Загрузить другой файл</span>
                            <span className="text-[9px] text-slate-400 block leading-none mt-0.5">PDF/DOCX до 5MB</span>
                          </label>
                          {uploadedFileName && (
                            <span className="text-[9px] text-emerald-600 font-semibold mt-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              Файл: {uploadedFileName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Cover Letter text area */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                        Сопроводительное письмо (Опционально):
                      </label>
                      <textarea
                        id="apply-cover-letter"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Здравствуйте! Хочу откликнуться на вакансию. Имею релевантный опыт..."
                        rows={3}
                        className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      ></textarea>
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                      <button
                        onClick={() => setSelectedVacancy(null)}
                        className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Закрыть
                      </button>
                      <button
                        id="apply-submit-btn"
                        onClick={triggerApply}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Откликнуться на вакансию</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
