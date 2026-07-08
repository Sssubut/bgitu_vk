import React from 'react';
import { Vacancy, Application, Company, Faculty, EmploymentType, JobSchedule } from '../types';
import { renderMd } from './MarkdownRenderer';
import { 
  Plus, Briefcase, Eye, Users, Calendar, AlertCircle, Clock, Coins, 
  CheckSquare, FileText, Send, User, ChevronRight, CheckCircle, XCircle, 
  BarChart2, FileUp, ShieldAlert, Archive, Trash2
} from 'lucide-react';

interface EmployerDashboardProps {
  company: Company;
  vacancies: Vacancy[];
  applications: Application[];
  onAddVacancy: (vacancy: Omit<Vacancy, 'id' | 'companyId' | 'companyName' | 'views' | 'appliesCount' | 'createdAt'>) => void;
  onUpdateVacancyStatus: (id: string, status: Vacancy['status']) => void;
  onUpdateApplicationStatus: (id: string, status: Application['status'], comment?: string) => void;
  onDeleteVacancy: (id: string) => void;
}

export default function EmployerDashboard({
  company,
  vacancies,
  applications,
  onAddVacancy,
  onUpdateVacancyStatus,
  onUpdateApplicationStatus,
  onDeleteVacancy
}: EmployerDashboardProps) {
  const [activeTab, setActiveTab] = React.useState<'jobs' | 'applications' | 'create'>('jobs');
  
  // Selected Application for detail/response view
  const [selectedApp, setSelectedApp] = React.useState<Application | null>(null);
  const [feedbackComment, setFeedbackComment] = React.useState('');
  const [feedbackSuccess, setFeedbackSuccess] = React.useState(false);

  // Form states for creating a new vacancy
  const [formTitle, setFormTitle] = React.useState('');
  const [formType, setFormType] = React.useState<EmploymentType>('internship');
  const [formSchedule, setFormSchedule] = React.useState<JobSchedule>('flexible');
  const [formSalaryFrom, setFormSalaryFrom] = React.useState('');
  const [formSalaryTo, setFormSalaryTo] = React.useState('');
  const [formSalaryNegotiable, setFormSalaryNegotiable] = React.useState(false);
  
  const [formCourseFrom, setFormCourseFrom] = React.useState('3');
  const [formCourseTo, setFormCourseTo] = React.useState('4');
  const [formFaculty, setFormFaculty] = React.useState<Faculty>('IT');
  const [formSkills, setFormSkills] = React.useState('');
  const [formDuties, setFormDuties] = React.useState('');
  const [formConditions, setFormConditions] = React.useState('');
  const [formContactName, setFormContactName] = React.useState('');
  const [formContactEmail, setFormContactEmail] = React.useState('');
  const [formContactPhone, setFormContactPhone] = React.useState('');
  const [formDeadline, setFormDeadline] = React.useState('2026-08-31');

  const [createSuccess, setCreateSuccess] = React.useState(false);

  // Filter vacancies and applications for this company
  const companyVacancies = vacancies.filter(v => v.companyId === company.id);
  const companyApplications = applications.filter(app => app.companyId === company.id);

  // Metrics
  const totalViews = companyVacancies.reduce((sum, v) => sum + v.views, 0);
  const totalApplies = companyApplications.length;
  const conversionRate = totalViews > 0 ? Math.round((totalApplies / totalViews) * 100) : 0;
  
  const pendingVacancies = companyVacancies.filter(v => v.status === 'pending').length;

  const handleCreateVacancy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formContactName || !formContactEmail) {
      alert('Пожалуйста, заполните обязательные поля (Должность, Контактное лицо и Email)');
      return;
    }

    onAddVacancy({
      title: formTitle,
      type: formType,
      schedule: formSchedule,
      salary: {
        from: formSalaryFrom ? parseInt(formSalaryFrom) : undefined,
        to: formSalaryTo ? parseInt(formSalaryTo) : undefined,
        currency: '₽',
        negotiable: formSalaryNegotiable
      },
      requirements: {
        courseFrom: parseInt(formCourseFrom),
        courseTo: parseInt(formCourseTo),
        faculty: formFaculty,
        skills: formSkills.split(',').map(s => s.trim()).filter(s => s !== '')
      },
      duties: formDuties.split('\n').map(d => d.trim()).filter(d => d !== ''),
      conditions: formConditions.split('\n').map(c => c.trim()).filter(c => c !== ''),
      contactPerson: {
        name: formContactName,
        email: formContactEmail,
        phone: formContactPhone || undefined
      },
      deadline: formDeadline,
      status: 'pending' // New jobs go to moderation!
    });

    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setActiveTab('jobs');
      // Reset form
      setFormTitle('');
      setFormSkills('');
      setFormDuties('');
      setFormConditions('');
      setFormSalaryFrom('');
      setFormSalaryTo('');
      setFormSalaryNegotiable(false);
    }, 2000);
  };

  const submitApplicationFeedback = (status: Application['status']) => {
    if (!selectedApp) return;
    onUpdateApplicationStatus(selectedApp.id, status, feedbackComment);
    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setSelectedApp(null);
      setFeedbackComment('');
    }, 1500);
  };

  const getStatusLabel = (status: Vacancy['status']) => {
    switch(status) {
      case 'active':
        return <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">Активна / Опубликована</span>;
      case 'pending':
        return <span className="bg-yellow-50 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-200">На модерации вуза</span>;
      case 'rejected':
        return <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200">Отклонена модератором</span>;
      case 'archived':
        return <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">В архиве</span>;
    }
  };

  const getApplicationStatusLabel = (status: Application['status']) => {
    switch(status) {
      case 'new':
        return <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">Новый</span>;
      case 'viewed':
        return <span className="bg-orange-50 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-orange-100">Просмотрен</span>;
      case 'invited':
        return <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-100">Приглашён</span>;
      case 'rejected':
        return <span className="bg-rose-50 text-rose-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-rose-100">Отказ</span>;
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

  const getFacultyName = (fac: Faculty) => {
    switch(fac) {
      case 'IT': return 'IT-технологии';
      case 'Economy': return 'Экономика и менеджмент';
      case 'Design': return 'Дизайн';
      case 'Engineering': return 'Инженерия';
      default: return 'Гуманитарные науки';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Company Cover Banner */}
      <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800 relative overflow-hidden" id="employer-welcome-banner">
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none">
          <Briefcase className="h-64 w-64 text-white" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`h-14 w-14 ${company.logoColor} rounded-xl flex items-center justify-center font-extrabold text-xl border border-white/10 shadow-sm`}>
              {company.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">{company.name}</h1>
                {company.verified ? (
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-semibold px-2.5 py-0.5 rounded border border-blue-500/30 font-mono">
                    ✓ ВЕРИФИЦИРОВАНО ВУЗОМ
                  </span>
                ) : (
                  <span className="bg-yellow-500/20 text-yellow-200 text-[10px] font-semibold px-2.5 py-0.5 rounded border border-yellow-500/30 flex items-center gap-1 font-mono">
                    <ShieldAlert className="h-3 w-3" /> ОЖИДАЕТ ВЕРИФИКАЦИИ
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-xs mt-1 max-w-xl truncate leading-relaxed">
                {company.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Outside the banner) */}
      <div className="flex flex-wrap gap-2 pb-1 border-b border-slate-200" id="employer-navigation-tabs">
        <button
          id="emp-tab-jobs"
          onClick={() => { setActiveTab('jobs'); setSelectedApp(null); }}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition-all cursor-pointer border-b-2 -mb-[5px] ${
            activeTab === 'jobs' 
              ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          Мои вакансии ({companyVacancies.length})
        </button>
        <button
          id="emp-tab-applies"
          onClick={() => { setActiveTab('applications'); setSelectedApp(null); }}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition-all cursor-pointer border-b-2 -mb-[5px] flex items-center gap-1.5 ${
            activeTab === 'applications' 
              ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <span>Отклики студентов ({companyApplications.length})</span>
        </button>
        <button
          id="emp-tab-create"
          onClick={() => { setActiveTab('create'); setSelectedApp(null); }}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition-all cursor-pointer border-b-2 -mb-[5px] flex items-center gap-1.5 ${
            activeTab === 'create' 
              ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Разместить вакансию</span>
        </button>
      </div>

      {/* Analytics Mini Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" id="employer-metrics-row">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg">
            <Briefcase className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Всего вакансий</span>
            <span className="text-xl font-bold text-slate-800">{companyVacancies.length}</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Eye className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Просмотры</span>
            <span className="text-xl font-bold text-slate-800">{totalViews}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Отклики студентов</span>
            <span className="text-xl font-bold text-slate-800">{totalApplies}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-lg">
            <BarChart2 className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Конверсия отклика</span>
            <span className="text-xl font-bold text-slate-800">{conversionRate}%</span>
          </div>
        </div>
      </div>

      {/* Main Panel views */}
      {activeTab === 'jobs' && (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-150 pb-3">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              📂 Список размещённых вакансий
            </h2>
            {pendingVacancies > 0 && (
              <span className="text-xs bg-yellow-50 text-yellow-800 border border-yellow-200 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> {pendingVacancies} ожидают модерации вуза
              </span>
            )}
          </div>

          {companyVacancies.length > 0 ? (
            <div className="divide-y divide-slate-100" id="employer-vacancies-list">
              {companyVacancies.map(v => {
                const appliesForThisVacancy = companyApplications.filter(app => app.vacancyId === v.id);
                return (
                  <div key={v.id} id={`emp-vacancy-item-${v.id}`} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm text-slate-800 hover:text-emerald-600 transition-colors">
                          {v.title}
                        </h3>
                        {getStatusLabel(v.status)}
                      </div>
                      
                      <p className="text-xs text-slate-500 font-medium">
                        {getEmploymentTypeName(v.type)} • {getScheduleName(v.schedule)} • Курс: {v.requirements.courseFrom}–{v.requirements.courseTo} • Факультет: {v.requirements.faculty}
                      </p>

                      <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-400 font-mono">
                        <span>Дедлайн: {new Date(v.deadline).toLocaleDateString('ru-RU')}</span>
                        <span>Добавлена: {new Date(v.createdAt).toLocaleDateString('ru-RU')}</span>
                      </div>

                      {v.rejectionComment && v.status === 'rejected' && (
                        <div className="mt-2 p-2 bg-rose-50 border border-rose-100 text-[11px] text-rose-800 rounded leading-relaxed">
                          <strong>Комментарий модератора вуза:</strong> « {v.rejectionComment} »
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Views/Applies counts */}
                      <div className="flex gap-4 text-xs">
                        <div className="text-center">
                          <span className="text-slate-400 block text-[10px]">Просмотры</span>
                          <span className="font-bold text-slate-700 font-mono">{v.views}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-slate-400 block text-[10px]">Отклики</span>
                          <span className="font-bold text-emerald-600 font-mono">{appliesForThisVacancy.length}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5">
                        {v.status === 'active' && (
                          <button
                            id={`archive-btn-${v.id}`}
                            onClick={() => onUpdateVacancyStatus(v.id, 'archived')}
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 cursor-pointer"
                            title="В архив"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        )}
                        {v.status === 'archived' && (
                          <button
                            id={`unarchive-btn-${v.id}`}
                            onClick={() => onUpdateVacancyStatus(v.id, 'active')}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded hover:bg-emerald-50 cursor-pointer"
                            title="Активировать"
                          >
                            <CheckSquare className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          id={`delete-btn-${v.id}`}
                          onClick={() => {
                            if(confirm('Вы уверены, что хотите удалить вакансию?')) {
                              onDeleteVacancy(v.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer"
                          title="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
              <p className="text-slate-400 text-sm">У вас ещё нет опубликованных вакансий.</p>
              <button
                onClick={() => setActiveTab('create')}
                className="mt-4 text-xs bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg cursor-pointer"
              >
                Разместить первую вакансию
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Applications Left Column List */}
          <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
              📥 Поступившие отклики ({companyApplications.length})
            </h2>

            {companyApplications.length > 0 ? (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto" id="employer-applications-list">
                {companyApplications.map(app => {
                  const isSelected = selectedApp?.id === app.id;
                  return (
                    <div
                      key={app.id}
                      id={`app-row-${app.id}`}
                      onClick={() => {
                        setSelectedApp(app);
                        setFeedbackComment(app.statusComment || '');
                      }}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-50/30' 
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <strong className="text-slate-800">{app.studentName}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(app.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      
                      <p className="text-slate-500 font-medium truncate mb-1.5">
                        {app.vacancyTitle}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                          {app.studentFaculty} • {app.studentCourse} курс
                        </span>
                        <span>{getApplicationStatusLabel(app.status)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-400 text-xs py-6 text-center">Откликов от студентов пока нет.</p>
            )}
          </div>

          {/* Application Detail Right Column View */}
          <div className="lg:col-span-2">
            {selectedApp ? (
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6" id="app-detail-card">
                
                {/* Header info */}
                <div className="border-b border-slate-150 pb-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold border border-indigo-100">
                      Студент {getFacultyName(selectedApp.studentFaculty)} • Группа {selectedApp.studentGroup}
                    </span>
                    <span>{getApplicationStatusLabel(selectedApp.status)}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {selectedApp.studentName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Отклик на вакансию: <strong className="text-slate-700">{selectedApp.vacancyTitle}</strong>
                  </p>
                </div>

                {/* Candidate Contact info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                  <div>
                    <span className="text-slate-400 block">Электронная почта (ЭОС):</span>
                    <a href={`mailto:${selectedApp.studentEmail}`} className="text-indigo-600 font-semibold hover:underline">{selectedApp.studentEmail}</a>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Номер телефона:</span>
                    <span className="text-slate-700 font-semibold">{selectedApp.studentPhone}</span>
                  </div>
                </div>

                {/* Cover Letter */}
                {selectedApp.coverLetter && (
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-xs text-slate-700">✉ Сопроводительное письмо:</h4>
                    <p className="text-xs text-slate-600 bg-slate-50/50 p-3 rounded-lg border border-slate-150 leading-relaxed italic">
                      « {selectedApp.coverLetter} »
                    </p>
                  </div>
                )}

                {/* Resume text from uploader */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-emerald-500" />
                    Текст прикрепленного резюме:
                  </h4>
                  <div className="md-content text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-150 leading-relaxed max-h-56 overflow-y-auto">
                    {selectedApp.resumeText ? (
                      <div dangerouslySetInnerHTML={{ __html: renderMd(selectedApp.resumeText) }} />
                    ) : (
                      <p className="m-0">Файл резюме пуст или не содержит текстового описания.</p>
                    )}
                  </div>
                  {selectedApp.resumeFileName && (
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Имя файла резюме: {selectedApp.resumeFileName}
                    </span>
                  )}
                </div>

                {/* Status Toggler / Feedback Form */}
                <div className="border-t border-slate-150 pt-5 space-y-4">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1">
                    📬 Изменить статус рассмотрения и направить ответ
                  </h4>

                  {feedbackSuccess ? (
                    <div className="bg-emerald-500 text-white p-3 rounded-lg text-center text-xs font-bold animate-pulse">
                      Статус успешно сохранен! Студент мгновенно увидит его в ЛК.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Comment text area */}
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                          Комментарий / Приглашение на собеседование / Причина отказа (Студент увидит это письмо):
                        </label>
                        <textarea
                          id="feedback-comment-textarea"
                          value={feedbackComment}
                          onChange={(e) => setFeedbackComment(e.target.value)}
                          placeholder="Николай, добрый день! Рады пригласить вас на встречу 12 июля в 12:00..."
                          rows={3}
                          className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        ></textarea>
                      </div>

                      {/* Status select buttons */}
                      <div className="flex flex-wrap gap-2 justify-end">
                        <button
                          id="status-btn-viewed"
                          onClick={() => {
                            onUpdateApplicationStatus(selectedApp.id, 'viewed', feedbackComment);
                            setFeedbackSuccess(true);
                            setTimeout(() => {
                              setFeedbackSuccess(false);
                              setSelectedApp(prev => prev ? { ...prev, status: 'viewed', statusComment: feedbackComment } : null);
                            }, 1000);
                          }}
                          className="bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          Отметить: Просмотрено
                        </button>
                        
                        <button
                          id="status-btn-rejected"
                          onClick={() => submitApplicationFeedback('rejected')}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Направить отказ</span>
                        </button>

                        <button
                          id="status-btn-invited"
                          onClick={() => submitApplicationFeedback('invited')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 shadow"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Пригласить на собеседование</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-white py-16 px-4 border border-dashed border-slate-200 rounded-xl text-center h-full flex flex-col items-center justify-center">
                <FileText className="h-10 w-10 text-slate-300 mb-2 animate-pulse" />
                <p className="text-slate-400 text-xs">Выберите отклик студента из списка слева, чтобы просмотреть его подробное резюме, сопроводительное письмо и отправить решение.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {activeTab === 'create' && (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-5" id="emp-vacancy-form-panel">
          <div className="border-b border-slate-150 pb-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              ➕ Размещение нового предложения (вакансии)
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Все новые вакансии автоматически направляются модератору Центра карьеры вуза на соответствие стандартам обучения.
            </p>
          </div>

          {createSuccess ? (
            <div className="bg-emerald-50 border border-emerald-150 p-6 rounded-xl text-center text-emerald-800 space-y-2">
              <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-sm">Вакансия создана и отправлена на модерацию!</p>
              <p className="text-xs text-emerald-600">Обычно сотрудники Центра карьеры одобряют вакансию в течение 2-х часов. Автоматический редирект на список...</p>
            </div>
          ) : (
            <form onSubmit={handleCreateVacancy} className="space-y-4">
              
              {/* Position and Faculty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Название вакансии (Должность) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    id="form-vacancy-title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Например: Стажёр-разработчик Java"
                    required
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Релевантный факультет / Кафедра</label>
                  <select
                    id="form-vacancy-faculty"
                    value={formFaculty}
                    onChange={(e) => setFormFaculty(e.target.value as Faculty)}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="IT">IT-технологии / Программирование</option>
                    <option value="Economy">Экономика и менеджмент</option>
                    <option value="Design">Дизайн и медиа</option>
                    <option value="Engineering">Инженерия и физика</option>
                    <option value="Humanities">Гуманитарные науки</option>
                  </select>
                </div>
              </div>

              {/* Type and Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Формат трудоустройства</label>
                  <select
                    id="form-vacancy-type"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as EmploymentType)}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 bg-white focus:outline-none"
                  >
                    <option value="internship">Стажировка</option>
                    <option value="practice">Производственная практика</option>
                    <option value="part-time">Частичная занятость (до 20 ч/нед)</option>
                    <option value="full-time">Полная занятость</option>
                    <option value="project">Проектная работа</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">График работы</label>
                  <select
                    id="form-vacancy-schedule"
                    value={formSchedule}
                    onChange={(e) => setFormSchedule(e.target.value as JobSchedule)}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 bg-white focus:outline-none"
                  >
                    <option value="flexible">Гибкий график</option>
                    <option value="shift">Сменный график</option>
                    <option value="standard">Офис 5/2</option>
                    <option value="remote">Удалённо</option>
                  </select>
                </div>
              </div>

              {/* Salary Section */}
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Финансовые условия (Зарплата)</span>
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      id="form-vacancy-negotiable"
                      checked={formSalaryNegotiable}
                      onChange={(e) => setFormSalaryNegotiable(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>По договорённости / По результатам собеседования</span>
                  </label>
                </div>
                {!formSalaryNegotiable && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="number"
                        id="form-vacancy-salary-from"
                        placeholder="Оплата ОТ (например, 40000)"
                        value={formSalaryFrom}
                        onChange={(e) => setFormSalaryFrom(e.target.value)}
                        className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 bg-white"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        id="form-vacancy-salary-to"
                        placeholder="Оплата ДО (например, 60000)"
                        value={formSalaryTo}
                        onChange={(e) => setFormSalaryTo(e.target.value)}
                        className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Course range requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Рекомендованный курс обучения</label>
                  <div className="flex items-center gap-2">
                    <select
                      id="form-vacancy-course-from"
                      value={formCourseFrom}
                      onChange={(e) => setFormCourseFrom(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 bg-white"
                    >
                      <option value="1">С 1 курса</option>
                      <option value="2">С 2 курса</option>
                      <option value="3">С 3 курса</option>
                      <option value="4">С 4 курса</option>
                      <option value="5">С 5 курса</option>
                    </select>
                    <span className="text-slate-400">до</span>
                    <select
                      id="form-vacancy-course-to"
                      value={formCourseTo}
                      onChange={(e) => setFormCourseTo(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 bg-white"
                    >
                      <option value="2">2 курса</option>
                      <option value="3">3 курса</option>
                      <option value="4">4 курса</option>
                      <option value="5">5 курса (Магистратура)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Ключевые слова и стек (через запятую)</label>
                  <input
                    type="text"
                    id="form-vacancy-skills"
                    placeholder="Например: HTML, CSS, JavaScript, React"
                    value={formSkills}
                    onChange={(e) => setFormSkills(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Duties & Conditions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Обязанности (каждая обязанность с новой строки)</label>
                  <textarea
                    id="form-vacancy-duties"
                    rows={4}
                    placeholder="Верстка макетов&#10;Участие в ежедневных созвонах&#10;Разработка UI компонентов"
                    value={formDuties}
                    onChange={(e) => setFormDuties(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Условия работы (каждое условие с новой строки)</label>
                  <textarea
                    id="form-vacancy-conditions"
                    rows={4}
                    placeholder="Официальный договор стажировки&#10;Возможность совмещения с учебой&#10;Бесплатные обеды и парковка"
                    value={formConditions}
                    onChange={(e) => setFormConditions(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Contacts info */}
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-3">
                <span className="text-xs font-bold text-slate-700 block border-b border-slate-200 pb-1">📞 Данные контактного лица</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      id="form-vacancy-contact-name"
                      placeholder="ФИО контактного лица *"
                      required
                      value={formContactName}
                      onChange={(e) => setFormContactName(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      id="form-vacancy-contact-email"
                      placeholder="Email для резюме *"
                      required
                      value={formContactEmail}
                      onChange={(e) => setFormContactEmail(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      id="form-vacancy-contact-phone"
                      placeholder="Телефон (Опционально)"
                      value={formContactPhone}
                      onChange={(e) => setFormContactPhone(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Deadline & Submit */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-150">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700">Срок подачи резюме:</label>
                  <input
                    type="date"
                    id="form-vacancy-deadline"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="text-xs rounded-lg border border-slate-200 px-3 py-1.5 text-slate-800 bg-white focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('jobs')}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    id="submit-vacancy-form-btn"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-xl text-xs shadow cursor-pointer transition-colors"
                  >
                    Отправить на модерацию вуза
                  </button>
                </div>
              </div>

            </form>
          )}
        </div>
      )}

    </div>
  );
}
