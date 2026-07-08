import React, { useState, useEffect } from 'react';
import { UserRole, Vacancy, Company, Application, StudentProfile } from './types';
import { 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_COMPANIES, 
  INITIAL_VACANCIES, 
  INITIAL_APPLICATIONS 
} from './mockData';
import { GraduationCap, Briefcase, ShieldCheck, BarChart3 } from 'lucide-react';
import StudentDashboard from './components/StudentDashboard';
import EmployerDashboard from './components/EmployerDashboard';
import ModeratorDashboard from './components/ModeratorDashboard';
import StatsDashboard from './components/StatsDashboard';
import AuthScreen from './components/AuthScreen';

export function formatFIO(fullName: string): string {
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

export default function App() {
  const [role, setRole] = useState<UserRole>('student');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('yandex');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<UserRole>('student');
  const [showQuickPanel, setShowQuickPanel] = useState(true);

  // List of registered student profiles
  const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('vk_student_profiles');
    if (saved) return JSON.parse(saved);
    return [INITIAL_STUDENT_PROFILE];
  });

  // Currently active student profile
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('vk_student_profile');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
  });

  // Persistent login session indicators (default to null for public use)
  const [loggedStudentEmail, setLoggedStudentEmail] = useState<string | null>(() => {
    return localStorage.getItem('vk_logged_student_email') || null;
  });

  const [loggedCompanyId, setLoggedCompanyId] = useState<string | null>(() => {
    return localStorage.getItem('vk_logged_company_id') || null;
  });

  const [isModeratorLoggedIn, setIsModeratorLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('vk_logged_moderator') === 'true';
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('vk_companies');
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [vacancies, setVacancies] = useState<Vacancy[]>(() => {
    const saved = localStorage.getItem('vk_vacancies');
    return saved ? JSON.parse(saved) : INITIAL_VACANCIES;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('vk_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('vk_student_profiles', JSON.stringify(studentProfiles));
  }, [studentProfiles]);

  useEffect(() => {
    localStorage.setItem('vk_student_profile', JSON.stringify(studentProfile));
  }, [studentProfile]);

  useEffect(() => {
    if (loggedStudentEmail) {
      localStorage.setItem('vk_logged_student_email', loggedStudentEmail);
    } else {
      localStorage.removeItem('vk_logged_student_email');
    }
  }, [loggedStudentEmail]);

  useEffect(() => {
    if (loggedCompanyId) {
      localStorage.setItem('vk_logged_company_id', loggedCompanyId);
    } else {
      localStorage.removeItem('vk_logged_company_id');
    }
  }, [loggedCompanyId]);

  useEffect(() => {
    localStorage.setItem('vk_logged_moderator', String(isModeratorLoggedIn));
  }, [isModeratorLoggedIn]);

  useEffect(() => {
    localStorage.setItem('vk_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('vk_vacancies', JSON.stringify(vacancies));
  }, [vacancies]);

  useEffect(() => {
    localStorage.setItem('vk_applications', JSON.stringify(applications));
  }, [applications]);

  // Auth Callbacks
  const handleLoginStudent = (profile: StudentProfile) => {
    setLoggedCompanyId(null);
    setIsModeratorLoggedIn(false);
    setStudentProfile(profile);
    setLoggedStudentEmail(profile.email);
  };

  const handleRegisterStudent = (newProfile: StudentProfile) => {
    setLoggedCompanyId(null);
    setIsModeratorLoggedIn(false);
    setStudentProfiles(prev => [...prev, newProfile]);
    setStudentProfile(newProfile);
    setLoggedStudentEmail(newProfile.email);
  };

  const handleLoginEmployer = (companyId: string) => {
    setLoggedStudentEmail(null);
    setIsModeratorLoggedIn(false);
    setSelectedCompanyId(companyId);
    setLoggedCompanyId(companyId);
  };

  const handleRegisterEmployer = (newCompany: Company) => {
    setLoggedStudentEmail(null);
    setIsModeratorLoggedIn(false);
    setCompanies(prev => [newCompany, ...prev]);
    setSelectedCompanyId(newCompany.id);
    setLoggedCompanyId(newCompany.id);
  };

  const handleLoginModerator = () => {
    setLoggedStudentEmail(null);
    setLoggedCompanyId(null);
    setIsModeratorLoggedIn(true);
  };

  // Sync profile editing back to students list
  const handleUpdateStudentProfile = (updatedProfile: StudentProfile) => {
    setStudentProfile(updatedProfile);
    setStudentProfiles(prev => prev.map(s => 
      s.email.toLowerCase() === updatedProfile.email.toLowerCase() ? updatedProfile : s
    ));
  };

  // Handle student quick apply
  const handleApply = (vacancyId: string, coverLetter: string) => {
    const matchedVacancy = vacancies.find(v => v.id === vacancyId);
    if (!matchedVacancy) return;

    // 1. Create new Application
    const newApp: Application = {
      id: `app-${Date.now()}`,
      vacancyId: matchedVacancy.id,
      vacancyTitle: matchedVacancy.title,
      companyId: matchedVacancy.companyId,
      companyName: matchedVacancy.companyName,
      studentName: studentProfile.name,
      studentEmail: studentProfile.email,
      studentPhone: studentProfile.phone,
      studentFaculty: studentProfile.faculty,
      studentGroup: studentProfile.group,
      studentCourse: studentProfile.course,
      resumeFileName: studentProfile.resumeFileName,
      resumeText: studentProfile.resumeText,
      coverLetter: coverLetter || undefined,
      status: 'new',
      statusChangedAt: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0]
    };

    // 2. Increment appliesCount on Vacancy
    setVacancies(prev => prev.map(v => 
      v.id === vacancyId ? { ...v, appliesCount: v.appliesCount + 1 } : v
    ));

    // 3. Append to Applications list
    setApplications(prev => [newApp, ...prev]);
  };

  // Handle employer adding a vacancy
  const handleAddVacancy = (newVacData: Omit<Vacancy, 'id' | 'companyId' | 'companyName' | 'views' | 'appliesCount' | 'createdAt'>) => {
    const activeCompanyId = loggedCompanyId || selectedCompanyId;
    const matchedCompany = companies.find(c => c.id === activeCompanyId) || companies[0];
    
    const newVacancy: Vacancy = {
      ...newVacData,
      id: `vac-${Date.now()}`,
      companyId: matchedCompany.id,
      companyName: matchedCompany.name,
      views: 0,
      appliesCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setVacancies(prev => [newVacancy, ...prev]);
  };

  // Handle employer updating vacancy status (e.g. archiving/activating)
  const handleUpdateVacancyStatus = (id: string, status: Vacancy['status']) => {
    setVacancies(prev => prev.map(v => 
      v.id === id ? { ...v, status } : v
    ));
  };

  // Handle employer deleting vacancy
  const handleDeleteVacancy = (id: string) => {
    setVacancies(prev => prev.filter(v => v.id !== id));
    // also remove related applications
    setApplications(prev => prev.filter(app => app.vacancyId !== id));
  };

  // Handle employer updating applicant's status with comments
  const handleUpdateApplicationStatus = (id: string, status: Application['status'], comment?: string) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { 
        ...app, 
        status, 
        statusComment: comment || undefined,
        statusChangedAt: new Date().toISOString().split('T')[0]
      } : app
    ));
  };

  // Handle moderator verifying a company
  const handleVerifyCompany = (id: string, verified: boolean) => {
    if (!verified) {
      // If rejected, we remove the company (or keep unverified)
      setCompanies(prev => prev.filter(c => c.id !== id));
    } else {
      setCompanies(prev => prev.map(c => 
        c.id === id ? { ...c, verified: true } : c
      ));
    }
  };

  // Handle moderator approving/rejecting a vacancy in queue
  const handleModerateVacancy = (id: string, status: Vacancy['status'], comment?: string) => {
    setVacancies(prev => prev.map(v => 
      v.id === id ? { ...v, status, rejectionComment: comment || undefined } : v
    ));
  };

  // Handle moderator emergency edit on vacancy
  const handleEmergencyEditVacancy = (id: string, updatedFields: Partial<Vacancy>) => {
    setVacancies(prev => prev.map(v => 
      v.id === id ? { ...v, ...updatedFields } : v
    ));
  };

  const activeCompanyId = loggedCompanyId || selectedCompanyId;
  const currentEmployerCompany = companies.find(c => c.id === activeCompanyId) || companies[0];

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans text-slate-900 selection:bg-blue-500 selection:text-white">

      {/* Main Corporate Header of the University Career site */}
      <header className="bg-white border-b border-slate-200 py-3 shadow-xs" id="main-portal-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base tracking-tight shadow-sm">
              В
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight block uppercase">
                Вуз.Карьера
              </span>
              <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase font-mono block">
                Центр содействия трудоустройству студентов
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl" id="portal-navigation">
            <button
              onClick={() => setRole('student')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                role === 'student' 
                  ? 'bg-white text-blue-600 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Вакансии</span>
            </button>
            {loggedCompanyId && (
              <button
                onClick={() => setRole('employer')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  role === 'employer' 
                    ? 'bg-white text-blue-600 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" />
                <span>Работодателям</span>
              </button>
            )}
            {isModeratorLoggedIn && (
              <button
                onClick={() => setRole('moderator')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  role === 'moderator' 
                    ? 'bg-white text-blue-600 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Панель модератора</span>
              </button>
            )}
            <button
              onClick={() => setRole('stats')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                role === 'stats' 
                  ? 'bg-white text-blue-600 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Аналитика</span>
            </button>
          </nav>

          <div className="flex items-center gap-6">
            {role === 'student' && loggedStudentEmail && (
              <div className="hidden md:flex items-center gap-3 border-r border-slate-200 pr-6" id="header-student-profile-info">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">{formatFIO(studentProfile.name)}</div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                    {studentProfile.faculty === 'IT' ? 'ИТ-ФАКУЛЬТЕТ' : 
                     studentProfile.faculty === 'Economy' ? 'ЭКОНОМИКА' : 
                     studentProfile.faculty === 'Design' ? 'ДИЗАЙН' : 'ИНЖЕНЕРИЯ'} • {studentProfile.course} КУРС
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs uppercase shadow-xs">
                  {studentProfile.name[0]}
                </div>
                <button
                  onClick={() => {
                    setLoggedStudentEmail(null);
                    setRole('student');
                  }}
                  className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer ml-2 pl-3 border-l border-slate-200 font-sans"
                  id="header-logout-student-btn"
                >
                  Выйти
                </button>
              </div>
            )}

            {role === 'student' && !loggedStudentEmail && (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => {
                    setAuthModalRole('student');
                    setShowAuthModal(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Войти в кабинет
                </button>
              </div>
            )}

            {role === 'employer' && loggedCompanyId && (
              <div className="hidden md:flex items-center gap-3 border-r border-slate-200 pr-6" id="header-employer-profile-info">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">{currentEmployerCompany.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                    Кабинет работодателя
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-lg ${currentEmployerCompany.logoColor} flex items-center justify-center text-white font-extrabold text-xs shadow-xs`}>
                  {currentEmployerCompany.name[0]}
                </div>
                <button
                  onClick={() => {
                    setLoggedCompanyId(null);
                    setRole('student');
                  }}
                  className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer ml-2 pl-3 border-l border-slate-200 font-sans"
                  id="header-logout-employer-btn"
                >
                  Выйти
                </button>
              </div>
            )}

            {role === 'employer' && !loggedCompanyId && (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => {
                    setAuthModalRole('employer');
                    setShowAuthModal(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Войти как представитель
                </button>
              </div>
            )}

            {role === 'moderator' && isModeratorLoggedIn && (
              <div className="hidden md:flex items-center gap-3 border-r border-slate-200 pr-6" id="header-moderator-profile-info">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800 font-sans">Центр Карьеры</div>
                  <div className="text-[10px] text-blue-500 font-bold uppercase tracking-wider font-mono">
                    Модератор вуза
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 font-extrabold text-xs shadow-xs">
                  M
                </div>
                <button
                  onClick={() => {
                    setIsModeratorLoggedIn(false);
                    setRole('student');
                  }}
                  className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer ml-2 pl-3 border-l border-slate-200 font-sans"
                  id="header-logout-moderator-btn"
                >
                  Выйти
                </button>
              </div>
            )}

            {role === 'moderator' && !isModeratorLoggedIn && (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => {
                    setAuthModalRole('moderator');
                    setShowAuthModal(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Войти как модератор
                </button>
              </div>
            )}
            
          </div>

        </div>
      </header>

      {/* Mobile sub-navigation bar */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-3 py-2 flex items-center justify-center gap-4 overflow-x-auto scrollbar-none" id="portal-mobile-navigation">
        <button
          onClick={() => setRole('student')}
          className={`flex items-center gap-1 px-4 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
            role === 'student' ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <GraduationCap className="h-3.5 w-3.5 shrink-0" />
          <span>Вакансии</span>
        </button>
        {loggedCompanyId && (
          <button
            onClick={() => setRole('employer')}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              role === 'employer' ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5 shrink-0" />
            <span>Работодателям</span>
          </button>
        )}
        {isModeratorLoggedIn && (
          <button
            onClick={() => setRole('moderator')}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              role === 'moderator' ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span>Панель модератора</span>
          </button>
        )}
        <button
          onClick={() => setRole('stats')}
          className={`flex items-center gap-1 px-4 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
            role === 'stats' ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5 shrink-0" />
          <span>Аналитика</span>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {role === 'student' && (
          <StudentDashboard
            vacancies={vacancies}
            applications={applications}
            studentProfile={loggedStudentEmail ? studentProfile : null}
            onUpdateProfile={handleUpdateStudentProfile}
            onApply={handleApply}
            onLoginPrompt={() => {
              setAuthModalRole('student');
              setShowAuthModal(true);
            }}
          />
        )}

        {role === 'employer' && (
          loggedCompanyId ? (
            <EmployerDashboard
              company={currentEmployerCompany}
              vacancies={vacancies}
              applications={applications}
              onAddVacancy={handleAddVacancy}
              onUpdateVacancyStatus={handleUpdateVacancyStatus}
              onUpdateApplicationStatus={handleUpdateApplicationStatus}
              onDeleteVacancy={handleDeleteVacancy}
            />
          ) : (
            <AuthScreen
              currentRole="employer"
              companies={companies}
              studentProfiles={studentProfiles}
              onLoginStudent={handleLoginStudent}
              onRegisterStudent={handleRegisterStudent}
              onLoginEmployer={handleLoginEmployer}
              onRegisterEmployer={handleRegisterEmployer}
              onLoginModerator={handleLoginModerator}
            />
          )
        )}

        {role === 'moderator' && (
          isModeratorLoggedIn ? (
            <ModeratorDashboard
              vacancies={vacancies}
              companies={companies}
              onVerifyCompany={handleVerifyCompany}
              onModerateVacancy={handleModerateVacancy}
              onEmergencyEditVacancy={handleEmergencyEditVacancy}
            />
          ) : (
            <AuthScreen
              currentRole="moderator"
              companies={companies}
              studentProfiles={studentProfiles}
              onLoginStudent={handleLoginStudent}
              onRegisterStudent={handleRegisterStudent}
              onLoginEmployer={handleLoginEmployer}
              onRegisterEmployer={handleRegisterEmployer}
              onLoginModerator={handleLoginModerator}
            />
          )
        )}

        {role === 'stats' && (
          <StatsDashboard
            vacancies={vacancies}
            applications={applications}
            companies={companies}
          />
        )}

      </main>

      {/* University Footer */}
      <footer className="bg-white border-t border-slate-150 py-6 text-center text-xs text-slate-400 mt-12 mb-20 md:mb-0" id="portal-footer">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Цифровая карьерная среда «Вуз-Карьера». Интегрировано с Единой образовательной системой (ЭОС).</p>
          <p className="mt-1 text-slate-300">Платформа содействия занятости выпускников, производственной практики и стажировок.</p>
        </div>
      </footer>

      {/* Login Modal Overlay */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-[100] backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto relative z-50">
            <AuthScreen
              currentRole={authModalRole}
              companies={companies}
              studentProfiles={studentProfiles}
              onLoginStudent={(profile) => {
                handleLoginStudent(profile);
                setRole('student');
                setShowAuthModal(false);
              }}
              onRegisterStudent={(newProfile) => {
                handleRegisterStudent(newProfile);
                setRole('student');
                setShowAuthModal(false);
              }}
              onLoginEmployer={(companyId) => {
                handleLoginEmployer(companyId);
                setRole('employer');
                setShowAuthModal(false);
              }}
              onRegisterEmployer={(newCompany) => {
                handleRegisterEmployer(newCompany);
                setRole('employer');
                setShowAuthModal(false);
              }}
              onLoginModerator={() => {
                handleLoginModerator();
                setRole('moderator');
                setShowAuthModal(false);
              }}
              onClose={() => setShowAuthModal(false)}
            />
          </div>
        </div>
      )}

      {/* Quick Login Helper Panel at the bottom */}
      {showQuickPanel ? (
        <div className="fixed bottom-4 right-4 max-w-[280px] md:max-w-xs bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-40" id="quick-demo-login-panel">
          <div className="flex items-center justify-between gap-4 mb-2 border-b border-slate-100 pb-1.5">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span>Быстрый тест-вход</span>
            </span>
            <button 
              onClick={() => setShowQuickPanel(false)}
              className="text-[10px] text-slate-400 hover:text-slate-600 font-bold font-mono px-1 cursor-pointer"
            >
              [Скрыть]
            </button>
          </div>
          <div className="space-y-1.5">
            {/* Student quick-click */}
            <button
              onClick={() => {
                const matched = studentProfiles.find(s => s.email === 'zalupovnikolaj7@gmail.com') || studentProfiles[0];
                handleLoginStudent(matched);
                setRole('student');
              }}
              className="w-full text-left bg-slate-50 hover:bg-blue-50/50 p-2 rounded-lg border border-slate-150 flex items-center justify-between text-xs cursor-pointer group transition-colors"
            >
              <div>
                <span className="font-bold text-slate-800 text-[11px] block">Студент (ЭОС)</span>
                <span className="text-[10px] text-slate-500 font-mono block">zalupovnikolaj7@gmail.com</span>
              </div>
              <span className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold text-[10px] shrink-0">
                Вход
              </span>
            </button>

            {/* Employer quick-click */}
            <button
              onClick={() => {
                handleLoginEmployer('yandex');
                setRole('employer');
              }}
              className="w-full text-left bg-slate-50 hover:bg-blue-50/50 p-2 rounded-lg border border-slate-150 flex items-center justify-between text-xs cursor-pointer group transition-colors"
            >
              <div>
                <span className="font-bold text-slate-800 text-[11px] block">Работодатель (Яндекс)</span>
                <span className="text-[10px] text-slate-500 font-mono block">yandex@career.ru</span>
              </div>
              <span className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold text-[10px] shrink-0">
                Вход
              </span>
            </button>

            {/* Moderator quick-click */}
            <button
              onClick={() => {
                handleLoginModerator();
                setRole('moderator');
              }}
              className="w-full text-left bg-slate-50 hover:bg-blue-50/50 p-2 rounded-lg border border-slate-150 flex items-center justify-between text-xs cursor-pointer group transition-colors"
            >
              <div>
                <span className="font-bold text-slate-800 text-[11px] block">Модератор вуза</span>
                <span className="text-[10px] text-slate-500 font-mono block">moderator@вуз.рф</span>
              </div>
              <span className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold text-[10px] shrink-0">
                Вход
              </span>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowQuickPanel(true)}
          className="fixed bottom-4 right-4 bg-slate-900 text-white hover:bg-slate-800 p-2 rounded-xl shadow-lg z-40 text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 border border-slate-800"
          id="quick-demo-login-collapsed-btn"
        >
          <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span>Быстрый вход</span>
        </button>
      )}

    </div>
  );
}
