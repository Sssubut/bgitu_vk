import React, { useState } from 'react';
import { Faculty, StudentProfile, Company, UserRole } from '../types';
import { 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Building, 
  Globe, 
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface AuthScreenProps {
  currentRole: UserRole;
  companies: Company[];
  studentProfiles: StudentProfile[];
  onLoginStudent: (student: StudentProfile) => void;
  onRegisterStudent: (student: StudentProfile) => void;
  onLoginEmployer: (companyId: string) => void;
  onRegisterEmployer: (company: Company) => void;
  onLoginModerator: () => void;
  onClose?: () => void;
}

export default function AuthScreen({
  currentRole,
  companies,
  studentProfiles,
  onLoginStudent,
  onRegisterStudent,
  onLoginEmployer,
  onRegisterEmployer,
  onLoginModerator,
  onClose
}: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Student Register State
  const [stName, setStName] = useState('');
  const [stFaculty, setStFaculty] = useState<Faculty>('IT');
  const [stCourse, setStCourse] = useState<number>(3);
  const [stGroup, setStGroup] = useState('');
  const [stPhone, setStPhone] = useState('');
  const [stPassword, setStPassword] = useState('');

  // Employer Register State
  const [empName, setEmpName] = useState('');
  const [empSite, setEmpSite] = useState('');
  const [empDesc, setEmpDesc] = useState('');
  const [empContactName, setEmpContactName] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [empPassword, setEmpPassword] = useState('');

  // Trigger error helper
  const triggerError = (msg: string) => {
    setError(msg);
    setSuccessMsg(null);
    setTimeout(() => setError(null), 5000);
  };

  // Student Form Submissions
  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      triggerError('Пожалуйста, заполните все поля');
      return;
    }

    // Find student in local database
    const student = studentProfiles.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (!student) {
      triggerError('Студент с такой почтой не найден');
      return;
    }

    if (student.password && student.password !== password) {
      triggerError('Неверный пароль');
      return;
    }

    onLoginStudent(student);
  };

  const handleStudentRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stName || !email || !stPhone || !stGroup || !stPassword) {
      triggerError('Пожалуйста, заполните обязательные поля');
      return;
    }

    if (studentProfiles.some(s => s.email.toLowerCase() === email.toLowerCase())) {
      triggerError('Студент с такой почтой уже зарегистрирован');
      return;
    }

    const newStudent: StudentProfile = {
      name: stName,
      faculty: stFaculty,
      course: Number(stCourse),
      group: stGroup,
      email: email,
      phone: stPhone,
      password: stPassword,
      resumeFileName: 'Resume.md',
      resumeText: `Студент ${stCourse} курса направления подготовки ${stFaculty}. Ищу стажировку/практику.`
    };

    onRegisterStudent(newStudent);
    setSuccessMsg('Регистрация успешна! Вход выполнен.');
  };

  // Employer Form Submissions
  const handleEmployerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      triggerError('Пожалуйста, заполните все поля');
      return;
    }

    const company = companies.find(c => c.email?.toLowerCase() === email.toLowerCase());
    if (!company) {
      triggerError('Работодатель с такой почтой не зарегистрирован');
      return;
    }

    if (company.password && company.password !== password) {
      triggerError('Неверный пароль');
      return;
    }

    onLoginEmployer(company.id);
  };

  const handleEmployerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !email || !empSite || !empPassword || !empContactName) {
      triggerError('Пожалуйста, заполните обязательные поля');
      return;
    }

    if (companies.some(c => c.email?.toLowerCase() === email.toLowerCase())) {
      triggerError('Компания с такой почтой уже существует');
      return;
    }

    // Assign a nice random Tailwind background color for company icon
    const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-slate-900', 'bg-teal-600', 'bg-sky-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newCompany: Company = {
      id: `comp-${Date.now()}`,
      name: empName,
      logoColor: randomColor,
      description: empDesc || 'Новая инновационная компания, развивающая проекты и стажировки для студентов вуза.',
      site: empSite,
      verified: false, // Must be verified by Moderator!
      createdAt: new Date().toISOString().split('T')[0],
      email: email,
      password: empPassword,
      contactName: empContactName,
      contactPhone: empPhone
    };

    onRegisterEmployer(newCompany);
    setSuccessMsg('Компания зарегистрирована и отправлена на модерацию вуза! Вход выполнен.');
  };

  // Moderator Form Submission
  const handleModeratorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      triggerError('Введите логин и пароль');
      return;
    }

    // ONLY pre-configured credentials
    if (email.toLowerCase() === 'moderator@вуз.рф' && password === 'admin') {
      onLoginModerator();
    } else {
      triggerError('Неверные реквизиты доступа. Вход разрешён только для верифицированных сотрудников Центра карьеры.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-4 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden font-sans relative" id="auth-cabinet-box">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 font-bold font-mono text-xs z-50 p-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200/80 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
          type="button"
          aria-label="Закрыть"
        >
          ✕
        </button>
      )}
      
      {/* Decorative top strip */}
      <div className="h-1.5 bg-blue-600 w-full" />
      
      {/* Header Info */}
      <div className="px-6 pt-6 pb-4 text-center border-b border-slate-100 bg-slate-50/50">
        <div className="mx-auto h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
          {currentRole === 'student' && <GraduationCap className="h-6 w-6" />}
          {currentRole === 'employer' && <Briefcase className="h-6 w-6" />}
          {currentRole === 'moderator' && <ShieldCheck className="h-6 w-6" />}
        </div>
        
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          {currentRole === 'student' && 'Кабинет Студента'}
          {currentRole === 'employer' && 'Кабинет Работодателя'}
          {currentRole === 'moderator' && 'Вход для Модератора Вуза'}
        </h2>
        
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          {currentRole === 'student' && 'Разместите резюме, откликайтесь на стажировки и отслеживайте статусы приглашений.'}
          {currentRole === 'employer' && 'Публикуйте стажировки и вакансии, отбирайте лучших студентов и верифицируйте компанию.'}
          {currentRole === 'moderator' && 'Панель Центра карьеры вуза. Проверка работодателей и публикуемых вакансий.'}
        </p>
      </div>

      {/* Success or Error messages */}
      <div className="px-6 pt-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2 animate-fade-in" id="auth-error-box">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-start gap-2 animate-fade-in" id="auth-success-box">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Login / Register tab selection */}
      {currentRole !== 'moderator' && (
        <div className="flex px-6 pt-4">
          <button
            onClick={() => { setActiveTab('login'); setError(null); }}
            className={`flex-1 py-2 text-center text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'login' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
            id="auth-tab-login"
          >
            Вход в систему
          </button>
          <button
            onClick={() => { setActiveTab('register'); setError(null); }}
            className={`flex-1 py-2 text-center text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'register' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
            id="auth-tab-register"
          >
            Регистрация
          </button>
        </div>
      )}

      {/* Render Forms */}
      <div className="p-6">
        
        {/* STUDENT - LOGIN */}
        {currentRole === 'student' && activeTab === 'login' && (
          <form onSubmit={handleStudentLogin} className="space-y-4" id="student-login-form">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Электронная почта (ЭОС)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  id="student-login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full text-xs rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Пароль</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  id="student-login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer mt-2"
              id="student-login-submit"
            >
              Войти в кабинет
            </button>
          </form>
        )}

        {/* STUDENT - REGISTER */}
        {currentRole === 'student' && activeTab === 'register' && (
          <form onSubmit={handleStudentRegister} className="space-y-3.5" id="student-register-form">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">ФИО Студента *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="student-reg-name"
                  value={stName}
                  onChange={(e) => setStName(e.target.value)}
                  placeholder="Иванов Иван Иванович"
                  className="w-full text-xs rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Факультет *</label>
                <select
                  id="student-reg-faculty"
                  value={stFaculty}
                  onChange={(e) => setStFaculty(e.target.value as Faculty)}
                  className="w-full text-xs rounded-lg border border-slate-200 px-2 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                >
                  <option value="IT">Информационные технологии</option>
                  <option value="Economy">Экономика и менеджмент</option>
                  <option value="Design">Дизайн и медиа</option>
                  <option value="Engineering">Инженерия и физика</option>
                  <option value="Humanities">Гуманитарные науки</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Курс *</label>
                <select
                  id="student-reg-course"
                  value={stCourse}
                  onChange={(e) => setStCourse(Number(e.target.value))}
                  className="w-full text-xs rounded-lg border border-slate-200 px-2 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                >
                  <option value={1}>1 курс</option>
                  <option value={2}>2 курс</option>
                  <option value={3}>3 курс</option>
                  <option value={4}>4 курс</option>
                  <option value={5}>5 курс</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Академ. группа *</label>
                <input
                  type="text"
                  id="student-reg-group"
                  value={stGroup}
                  onChange={(e) => setStGroup(e.target.value)}
                  placeholder="ИВТ-301"
                  className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Контактный телефон *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
                    <Phone className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="text"
                    id="student-reg-phone"
                    value={stPhone}
                    onChange={(e) => setStPhone(e.target.value)}
                    placeholder="+7 (999) 111-22-33"
                    className="w-full text-xs rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Почта (Email) *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  id="student-reg-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full text-xs rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Придумайте пароль *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  id="student-reg-password"
                  value={stPassword}
                  onChange={(e) => setStPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer mt-3"
              id="student-register-submit"
            >
              Зарегистрироваться
            </button>
          </form>
        )}

        {/* EMPLOYER - LOGIN */}
        {currentRole === 'employer' && activeTab === 'login' && (
          <form onSubmit={handleEmployerLogin} className="space-y-4" id="employer-login-form">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Почта представителя компании</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  id="employer-login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hr@yandex-team.ru"
                  className="w-full text-xs rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Пароль</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  id="employer-login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer mt-2"
              id="employer-login-submit"
            >
              Войти как представитель
            </button>
          </form>
        )}

        {/* EMPLOYER - REGISTER */}
        {currentRole === 'employer' && activeTab === 'register' && (
          <form onSubmit={handleEmployerRegister} className="space-y-3.5" id="employer-register-form">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Название компании *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Building className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="employer-reg-name"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  placeholder="ООО ВебТехнологии"
                  className="w-full text-xs rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Сайт компании *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
                    <Globe className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="url"
                    id="employer-reg-site"
                    value={empSite}
                    onChange={(e) => setEmpSite(e.target.value)}
                    placeholder="https://company.ru"
                    className="w-full text-xs rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Почта представителя *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="email"
                    id="employer-reg-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hr@company.ru"
                    className="w-full text-xs rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">ФИО представителя (контактного лица) *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="employer-reg-contact"
                  value={empContactName}
                  onChange={(e) => setEmpContactName(e.target.value)}
                  placeholder="Кузнецова Анна Павловна"
                  className="w-full text-xs rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Телефон для связи</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Phone className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="employer-reg-phone"
                  value={empPhone}
                  onChange={(e) => setEmpPhone(e.target.value)}
                  placeholder="+7 (999) 444-55-66"
                  className="w-full text-xs rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Описание деятельности компании</label>
              <textarea
                id="employer-reg-desc"
                rows={3}
                value={empDesc}
                onChange={(e) => setEmpDesc(e.target.value)}
                placeholder="Расскажите о своей компании, её целях и возможностях стажировок..."
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Пароль для входа *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  id="employer-reg-password"
                  value={empPassword}
                  onChange={(e) => setEmpPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                  required
                />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-yellow-50/50 border border-yellow-100 text-[10px] text-yellow-800 leading-relaxed font-sans">
              ⚠️ <strong>Обратите внимание:</strong> Все новые компании регистрируются в статусе <strong>«Ожидает верификации»</strong>. Вы сразу сможете разместить вакансию на стажировку, но она появится в поиске только после того, как Модератор вуза верифицирует вашу компанию и одобрит публикацию.
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer"
              id="employer-register-submit"
            >
              Зарегистрировать компанию
            </button>
          </form>
        )}

        {/* MODERATOR - LOGIN */}
        {currentRole === 'moderator' && (
          <form onSubmit={handleModeratorLogin} className="space-y-4" id="moderator-login-form">
            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-blue-900 leading-relaxed font-sans">
              ⚙️ <strong>Доступ ограничен:</strong> Вход разрешён только для авторизованных модераторов Центра карьеры вуза. Регистрация закрыта.
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Рабочая почта модератора</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  id="moderator-login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="moderator@вуз.рф"
                  className="w-full text-xs rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white font-sans"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Служебный пароль</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  id="moderator-login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer mt-2"
              id="moderator-login-submit"
            >
              Подтвердить полномочия
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
