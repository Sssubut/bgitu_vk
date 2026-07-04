import React from 'react';
import { Vacancy, Company, Faculty, EmploymentType, JobSchedule } from '../types';
import { 
  ShieldCheck, AlertCircle, CheckCircle, XCircle, Building, 
  FileText, ShieldAlert, Edit3, ArrowRight, Coins, Clock, Calendar, BookOpen
} from 'lucide-react';

interface ModeratorDashboardProps {
  vacancies: Vacancy[];
  companies: Company[];
  onVerifyCompany: (id: string, verified: boolean) => void;
  onModerateVacancy: (id: string, status: Vacancy['status'], comment?: string) => void;
  onEmergencyEditVacancy: (id: string, updatedFields: Partial<Vacancy>) => void;
}

export default function ModeratorDashboard({
  vacancies,
  companies,
  onVerifyCompany,
  onModerateVacancy,
  onEmergencyEditVacancy
}: ModeratorDashboardProps) {
  const [activeTab, setActiveTab] = React.useState<'vacancies' | 'companies'>('vacancies');
  
  // Selected Vacancy for detailed inspection / action
  const [selectedVacancy, setSelectedVacancy] = React.useState<Vacancy | null>(null);
  const [rejectionComment, setRejectionComment] = React.useState('');
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);

  // Emergency Editing states
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState('');
  const [editSalaryFrom, setEditSalaryFrom] = React.useState('');
  const [editSalaryTo, setEditSalaryTo] = React.useState('');
  const [editType, setEditType] = React.useState<EmploymentType>('internship');

  // Filter queues
  const pendingVacancies = vacancies.filter(v => v.status === 'pending');
  const pendingCompanies = companies.filter(c => !c.verified);

  const triggerApprove = (id: string) => {
    onModerateVacancy(id, 'active');
    setActionSuccess('approved');
    setTimeout(() => {
      setActionSuccess(null);
      setSelectedVacancy(null);
    }, 1500);
  };

  const triggerReject = (id: string) => {
    if (!rejectionComment) {
      alert('Пожалуйста, введите комментарий с указанием причины отклонения вакансии.');
      return;
    }
    onModerateVacancy(id, 'rejected', rejectionComment);
    setActionSuccess('rejected');
    setTimeout(() => {
      setActionSuccess(null);
      setSelectedVacancy(null);
      setRejectionComment('');
    }, 1500);
  };

  const saveEmergencyEdit = () => {
    if (!selectedVacancy) return;
    onEmergencyEditVacancy(selectedVacancy.id, {
      title: editTitle,
      type: editType,
      salary: {
        ...selectedVacancy.salary,
        from: editSalaryFrom ? parseInt(editSalaryFrom) : undefined,
        to: editSalaryTo ? parseInt(editSalaryTo) : undefined
      }
    });
    setIsEditing(false);
    // Refresh modal info
    setSelectedVacancy(prev => prev ? {
      ...prev,
      title: editTitle,
      type: editType,
      salary: {
        ...prev.salary,
        from: editSalaryFrom ? parseInt(editSalaryFrom) : undefined,
        to: editSalaryTo ? parseInt(editSalaryTo) : undefined
      }
    } : null);
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
      
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800 relative overflow-hidden" id="moderator-welcome-banner">
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none">
          <ShieldCheck className="h-64 w-64 text-white" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2.5 py-0.5 rounded border border-blue-500/30 uppercase tracking-wider block w-fit mb-1.5 font-mono">
              Модератор Центра Карьеры Вуза
            </span>
            <h1 className="text-xl font-bold tracking-tight text-white">Панель управления и модерации</h1>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Проверяйте благонадежность работодателей и соответствие вакансий уровню подготовки студентов.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              id="mod-tab-vacancies"
              onClick={() => { setActiveTab('vacancies'); setSelectedVacancy(null); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'vacancies' 
                  ? 'bg-white text-slate-950 shadow-sm border border-white' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-transparent'
              }`}
            >
              <span>Очередь вакансий ({pendingVacancies.length})</span>
            </button>
            <button
              id="mod-tab-companies"
              onClick={() => { setActiveTab('companies'); setSelectedVacancy(null); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'companies' 
                  ? 'bg-white text-slate-950 shadow-sm border border-white' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-transparent'
              }`}
            >
              <span>Новые компании ({pendingCompanies.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'vacancies' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Vacancy Queue List */}
          <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-violet-500" />
              Вакансии на проверку ({pendingVacancies.length})
            </h2>

            {pendingVacancies.length > 0 ? (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto" id="pending-vacancies-list">
                {pendingVacancies.map(v => {
                  const isSelected = selectedVacancy?.id === v.id;
                  return (
                    <div
                      key={v.id}
                      id={`pending-vac-row-${v.id}`}
                      onClick={() => {
                        setSelectedVacancy(v);
                        setIsEditing(false);
                      }}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-50/20' 
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <strong className="text-slate-800">{v.title}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(v.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      
                      <p className="text-slate-500 font-medium truncate mb-2">
                        Компания: <strong className="text-slate-700">{v.companyName}</strong>
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                          {v.requirements.faculty} • {v.requirements.courseFrom}-{v.requirements.courseTo} курс
                        </span>
                        <span className="text-violet-600 font-bold flex items-center gap-0.5">
                          Смотреть <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-400 text-xs">Нет вакансий, ожидающих модерации.</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-tight">Когда работодатели отправляют новые вакансии, они появляются здесь.</p>
              </div>
            )}
          </div>

          {/* Vacancy Inspection Window */}
          <div className="lg:col-span-2">
            {selectedVacancy ? (
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6" id="vacancy-inspection-panel">
                
                {/* Header and Emergency Edit button */}
                <div className="border-b border-slate-150 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {selectedVacancy.companyName}
                      </span>
                      <span className="bg-yellow-50 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-200">
                        Ожидает публикации
                      </span>
                    </div>
                    
                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-lg font-bold text-slate-800 border border-slate-300 rounded px-2 py-1 w-full max-w-md focus:outline-none"
                      />
                    ) : (
                      <h3 className="text-lg font-extrabold text-slate-900 tracking-tight leading-snug">
                        {selectedVacancy.title}
                      </h3>
                    )}
                  </div>

                  <button
                    id="emergency-edit-btn"
                    onClick={() => {
                      if (!isEditing) {
                        setEditTitle(selectedVacancy.title);
                        setEditSalaryFrom(selectedVacancy.salary.from?.toString() || '');
                        setEditSalaryTo(selectedVacancy.salary.to?.toString() || '');
                        setEditType(selectedVacancy.type);
                        setIsEditing(true);
                      } else {
                        setIsEditing(false);
                      }
                    }}
                    className="text-xs border border-slate-200 hover:border-violet-200 hover:bg-violet-50 text-slate-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>{isEditing ? 'Отменить правку' : 'Экстренная правка'}</span>
                  </button>
                </div>

                {/* Emergency Editor view */}
                {isEditing ? (
                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-4">
                    <h4 className="font-bold text-xs text-slate-700">✏ Экстренное редактирование параметров вакансии</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-500 mb-1">Формат работы</label>
                        <select
                          value={editType}
                          onChange={(e) => setEditType(e.target.value as EmploymentType)}
                          className="w-full rounded border border-slate-300 p-2 bg-white"
                        >
                          <option value="internship">Стажировка</option>
                          <option value="practice">Практика</option>
                          <option value="part-time">Частичная</option>
                          <option value="full-time">Полная</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1">Оплата от</label>
                        <input
                          type="number"
                          value={editSalaryFrom}
                          onChange={(e) => setEditSalaryFrom(e.target.value)}
                          className="w-full rounded border border-slate-300 p-2 bg-white"
                        />
                      </div>
                    </div>
                    <button
                      id="save-emergency-btn"
                      onClick={saveEmergencyEdit}
                      className="bg-violet-600 text-white font-bold text-xs px-4 py-2 rounded shadow hover:bg-violet-750 cursor-pointer"
                    >
                      Сохранить изменения
                    </button>
                  </div>
                ) : null}

                {/* Core parameters details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Предлагаемая оплата</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Coins className="h-3.5 w-3.5 text-violet-600" />
                      {selectedVacancy.salary.negotiable 
                        ? 'Договорная' 
                        : `${selectedVacancy.salary.from ? `от ${selectedVacancy.salary.from.toLocaleString()}` : ''} ${selectedVacancy.salary.to ? `до ${selectedVacancy.salary.to.toLocaleString()}` : ''} ${selectedVacancy.salary.currency}`}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Рекомендуемый курс</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-violet-600" />
                      {selectedVacancy.requirements.courseFrom}–{selectedVacancy.requirements.courseTo} курс
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Режим работы</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-violet-600" />
                      {getScheduleName(selectedVacancy.schedule)}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Срок подачи</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-violet-600" />
                      До {new Date(selectedVacancy.deadline).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>

                {/* Duties / Conditions info */}
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <strong className="text-slate-700 block">📝 Обязанности студента:</strong>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 leading-normal pl-1">
                      {selectedVacancy.duties.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <strong className="text-slate-700 block">💼 Предлагаемые условия:</strong>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 leading-normal pl-1">
                      {selectedVacancy.conditions.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>

                  <div className="p-3 bg-indigo-50/40 border border-indigo-150 rounded-lg text-[11px] text-indigo-950">
                    <strong>Анализ совместимости с учебой:</strong> Вакансия помечена как {getEmploymentTypeName(selectedVacancy.type)} ({getScheduleName(selectedVacancy.schedule)}). Это <strong className="text-emerald-700">совместимо с академической нагрузкой</strong> студентов. Рекомендуемый факультет: <strong className="text-indigo-900">{getFacultyName(selectedVacancy.requirements.faculty)}</strong>.
                  </div>
                </div>

                {/* Moderator Decision Action Box */}
                <div className="border-t border-slate-150 pt-5 space-y-4">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    🛡️ Принятие решения по публикации
                  </h4>

                  {actionSuccess ? (
                    <div className={`p-4 rounded-xl text-center text-white font-bold text-xs animate-pulse ${
                      actionSuccess === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}>
                      {actionSuccess === 'approved' 
                        ? '✓ Вакансия успешно одобрена и опубликована в каталоге!' 
                        : '✓ Вакансия отклонена. Работодателю отправлено уведомление.'}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Reason for Rejection text area */}
                      <div className="text-xs">
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                          Комментарий / Замечание по вакансии (обязательно только при отклонении):
                        </label>
                        <textarea
                          id="rejection-comment-textarea"
                          value={rejectionComment}
                          onChange={(e) => setRejectionComment(e.target.value)}
                          placeholder="Рекомендуем изменить тип занятости на Частичную, так как вакансия предназначается для 1-2 курсов..."
                          rows={2.5}
                          className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                        ></textarea>
                      </div>

                      <div className="flex gap-2.5 justify-end">
                        <button
                          id="moderate-reject-btn"
                          onClick={() => triggerReject(selectedVacancy.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Отклонить с замечанием</span>
                        </button>

                        <button
                          id="moderate-approve-btn"
                          onClick={() => triggerApprove(selectedVacancy.id)}
                          className="bg-violet-600 hover:bg-violet-750 text-white font-bold px-5 py-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 shadow"
                        >
                          <ShieldCheck className="h-4 w-4" />
                          <span>Одобрить и Опубликовать</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-white py-16 px-4 border border-dashed border-slate-200 rounded-xl text-center h-full flex flex-col items-center justify-center">
                <ShieldAlert className="h-10 w-10 text-slate-300 mb-2 animate-pulse" />
                <p className="text-slate-400 text-xs">Выберите предложение работодателя из списка слева для проведения экспертизы и публикации.</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        
        /* Companies Verification Queue */
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4" id="companies-verification-panel">
          <div className="border-b border-slate-150 pb-3">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Building className="h-5 w-5 text-violet-500" />
              Очередь верификации компаний-партнеров
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Компании, проходящие проверку службой безопасности и Центром карьеры вуза перед допуском к размещению стажировок.
            </p>
          </div>

          {pendingCompanies.length > 0 ? (
            <div className="divide-y divide-slate-100 space-y-4">
              {pendingCompanies.map(c => (
                <div key={c.id} id={`pending-company-item-${c.id}`} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 ${c.logoColor} rounded flex items-center justify-center text-white font-bold font-mono`}>
                        {c.name[0]}
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm">{c.name}</h3>
                      <span className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-[10px] px-2 py-0.5 rounded font-medium">Новый партнёр</span>
                    </div>
                    <p className="text-slate-600 leading-normal max-w-2xl">{c.description}</p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Сайт: <a href={c.site} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{c.site}</a> • Регистрация: {new Date(c.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      id={`verify-approve-btn-${c.id}`}
                      onClick={() => onVerifyCompany(c.id, true)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Одобрить</span>
                    </button>
                    <button
                      id={`verify-reject-btn-${c.id}`}
                      onClick={() => {
                        if (confirm('Отклонить регистрацию компании?')) {
                          onVerifyCompany(c.id, false);
                        }
                      }}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Отклонить</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-150 rounded-xl">
              <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2 animate-bounce" />
              <p className="text-slate-500 text-sm font-semibold">Все компании успешно верифицированы!</p>
              <p className="text-[11px] text-slate-400 mt-1">В настоящее время нет новых заявок от компаний на проверку.</p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
