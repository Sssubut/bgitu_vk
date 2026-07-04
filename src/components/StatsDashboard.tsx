import React from 'react';
import { Vacancy, Application, Company, Faculty } from '../types';
import { 
  BarChart3, TrendingUp, Users, Coins, GraduationCap, Building, 
  ArrowUpRight, Award, PieChart, Briefcase, ChevronRight
} from 'lucide-react';

interface StatsDashboardProps {
  vacancies: Vacancy[];
  applications: Application[];
  companies: Company[];
}

export default function StatsDashboard({
  vacancies,
  applications,
  companies
}: StatsDashboardProps) {
  const [selectedFaculty, setSelectedFaculty] = React.useState<string>('all');

  // Filter data based on selected Faculty
  const activeVacancies = vacancies.filter(v => v.status === 'active');
  
  const filteredVacancies = activeVacancies.filter(v => 
    selectedFaculty === 'all' || v.requirements.faculty === selectedFaculty
  );

  const filteredApplications = applications.filter(app => 
    selectedFaculty === 'all' || app.studentFaculty === selectedFaculty
  );

  // 1. General counts
  const totalJobsCount = filteredVacancies.length;
  const totalAppliesCount = filteredApplications.length;
  const totalCompaniesCount = companies.filter(c => c.verified).length;
  
  // Invited count to show success rate
  const invitedCount = filteredApplications.filter(app => app.status === 'invited').length;
  const successRate = totalAppliesCount > 0 ? Math.round((invitedCount / totalAppliesCount) * 100) : 0;

  // 2. Average Salary calculations
  const vacanciesWithSalaries = filteredVacancies.filter(v => !v.salary.negotiable && v.salary.from);
  const avgSalary = vacanciesWithSalaries.length > 0 
    ? Math.round(vacanciesWithSalaries.reduce((sum, v) => sum + (v.salary.from || 0), 0) / vacanciesWithSalaries.length)
    : 0;

  // 3. Top Employers calculation
  const employerStats = companies.map(c => {
    const activeJobs = activeVacancies.filter(v => v.companyId === c.id).length;
    const appliesReceived = applications.filter(app => app.companyId === c.id).length;
    return {
      ...c,
      activeJobs,
      appliesReceived
    };
  }).sort((a, b) => b.appliesReceived - a.appliesReceived).slice(0, 5); // top 5

  // 4. Vacancies by Faculty (regardless of filter)
  const facultiesList: Faculty[] = ['IT', 'Economy', 'Design', 'Engineering', 'Humanities'];
  const facultyDistribution = facultiesList.map(f => {
    const count = activeVacancies.filter(v => v.requirements.faculty === f).length;
    return {
      name: f,
      label: f === 'IT' ? 'Информационные технологии' : 
             f === 'Economy' ? 'Экономика и менеджмент' : 
             f === 'Design' ? 'Дизайн и медиа' : 
             f === 'Engineering' ? 'Инженерия и физика' : 'Гуманитарные науки',
      count,
      percentage: activeVacancies.length > 0 ? Math.round((count / activeVacancies.length) * 100) : 0
    };
  }).sort((a, b) => b.count - a.count);

  // 5. Employment Types Distribution
  const typesList = [
    { key: 'internship', label: 'Стажировки' },
    { key: 'practice', label: 'Производственная практика' },
    { key: 'part-time', label: 'Частичная занятость' },
    { key: 'full-time', label: 'Полная занятость' },
    { key: 'project', label: 'Проектная работа' }
  ];
  const typeDistribution = typesList.map(t => {
    const count = filteredVacancies.filter(v => v.type === t.key).length;
    return {
      ...t,
      count,
      percentage: totalJobsCount > 0 ? Math.round((count / totalJobsCount) * 100) : 0
    };
  }).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      
      {/* Dashboard Filter Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="stats-filter-header">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-amber-500" />
            Аналитический отчет по трудоустройству
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Статистика взаимодействия студентов с работодателями по факультетам и направлениям.
          </p>
        </div>

        {/* Faculty Select */}
        <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Отчет по факультету:</span>
          <select
            id="stats-faculty-select"
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">Все факультеты (Вуз в целом)</option>
            <option value="IT">Информационные технологии</option>
            <option value="Economy">Экономика и менеджмент</option>
            <option value="Design">Дизайн и медиа</option>
            <option value="Engineering">Инженерия и физика</option>
            <option value="Humanities">Гуманитарные науки</option>
          </select>
        </div>
      </div>

      {/* Main Stats Row Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" id="stats-cards-grid">
        {/* Total jobs */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-lg">
            <Briefcase className="h-5.5 w-5.5 text-amber-600" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Активные вакансии</span>
            <span className="text-2xl font-bold text-slate-800 font-mono">{totalJobsCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">в каталоге предложений</span>
          </div>
        </div>

        {/* Total applications */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Users className="h-5.5 w-5.5 text-blue-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-sans">Отклики студентов</span>
            <span className="text-2xl font-bold text-slate-800 font-mono">{totalAppliesCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">всего заявок подано</span>
          </div>
        </div>

        {/* Average salary */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-50 rounded-lg">
            <Coins className="h-5.5 w-5.5 text-slate-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-sans">Средний оклад</span>
            <span className="text-2xl font-bold text-slate-800 font-mono">
              {avgSalary > 0 ? `${avgSalary.toLocaleString()} ₽` : '—'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">по платным вакансиям</span>
          </div>
        </div>

        {/* Hiring Success Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Award className="h-5.5 w-5.5 text-blue-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-sans">Процент приглашений</span>
            <span className="text-2xl font-bold text-slate-800 font-mono">{successRate}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{invitedCount} приглашений на интервью</span>
          </div>
        </div>
      </div>

      {/* Analytics bento row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="stats-charts-row">
        
        {/* Left Column - Top Employers and Distribution by Type */}
        <div className="space-y-6">
          {/* Top Employers */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                <Building className="h-4.5 w-4.5 text-amber-500" />
                Топ работодателей по активности откликов
              </h3>
              <span className="text-[10px] text-slate-400">Рейтинг партнёров</span>
            </div>

            <div className="space-y-4" id="top-employers-report">
              {employerStats.map((emp, index) => (
                <div key={emp.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-mono text-slate-300 font-bold text-sm w-4">#{index+1}</span>
                    <div className={`h-8 w-8 ${emp.logoColor} rounded flex items-center justify-center text-white font-bold`}>
                      {emp.name[0]}
                    </div>
                    <div>
                      <strong className="text-slate-800">{emp.name}</strong>
                      <span className="text-slate-400 block text-[10px]">Кол-во вакансий: {emp.activeJobs}</span>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <span className="font-bold text-indigo-600 block">{emp.appliesReceived}</span>
                    <span className="text-slate-400 text-[9px] block">откликов получено</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vacancy Format distribution */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                <PieChart className="h-4.5 w-4.5 text-indigo-500" />
                Распределение вакансий по типам занятости
              </h3>
            </div>

            <div className="space-y-3.5" id="vacancy-types-distribution">
              {typeDistribution.map(type => (
                <div key={type.key} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>{type.label}</span>
                    <span className="font-bold text-slate-800">{type.count} ({type.percentage}%)</span>
                  </div>
                  {/* Dynamic Progress Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${type.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Faculty distribution and Salary insights */}
        <div className="space-y-6">
          
          {/* Faculty distribution (Always absolute representation) */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                <GraduationCap className="h-4.5 w-4.5 text-purple-500" />
                Активность вакансий по факультетам вуза
              </h3>
              <span className="text-[10px] text-slate-400">Все предложения</span>
            </div>

            <div className="space-y-3.5" id="faculties-distribution">
              {facultyDistribution.map(fac => (
                <div key={fac.name} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-semibold text-slate-700">{fac.label}</span>
                    <span className="font-bold text-slate-800 font-mono">{fac.count} ({fac.percentage}%)</span>
                  </div>
                  {/* Dynamic Progress Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${fac.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Salary indicators and notes */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
              Финансовый мониторинг по рынку выпускников
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-lg space-y-1">
                <strong className="text-emerald-900 font-semibold block">Максимальный оклад:</strong>
                <span className="text-base font-extrabold text-emerald-800 font-mono">150 000 ₽</span>
                <p className="text-[10px] text-slate-400">В сфере IT-разработки (Junior Golang Developer)</p>
              </div>
              <div className="p-3 bg-blue-50/40 border border-blue-100 rounded-lg space-y-1">
                <strong className="text-blue-900 font-semibold block">Минимальный порог:</strong>
                <span className="text-base font-extrabold text-blue-800 font-mono">20 000 ₽</span>
                <p className="text-[10px] text-slate-400">Частичная занятость (Копирайтер на 1-2 курсах)</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-slate-500 text-[11px] leading-normal">
              <strong>Заметка Центра Карьеры:</strong> Студенты 3–4 курсов имеют средний стартовый оклад <strong className="text-slate-800">55,000 ₽ - 75,000 ₽</strong> при частичной занятости (совмещение с учёбой). Стажировки на младших курсах чаще оплачиваются по ставке 45,000 ₽ в месяц либо оформляются в рамках безвозмездной производственной практики с гарантией отзывов.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
