import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, LogIn, Menu, X, Search, Sparkles, Loader2, ShieldAlert, AlertTriangle } from 'lucide-react';
import axios from 'axios';

// 🌐 إصلاح الرابط الافتراضي ليكون صالحاً للاتصال بالمنفذ المحلي 8000 بدقة
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0";

const pageTransition = {
  initial: { opacity: 0, scale: 0.99, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.99, y: -8, transition: { duration: 0.25 } }
};

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 text-stone-800 font-sans antialiased" dir="rtl">
        <nav className="bg-white border-b border-amber-100/50 sticky top-0 z-50 backdrop-blur-md bg-white/90 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <div className="flex items-center gap-2 font-bold text-xl text-red-800">
                <div className="bg-red-800 p-2 rounded-xl text-amber-400 border border-amber-500/30 shadow-md">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-red-950">منصتي الملكية</span>
              </div>
              
              <div className="hidden md:flex items-center gap-8">
                <NavLink to="/">الرئيسية</NavLink>
                <NavLink to="/companies">الشركات المعتمدة</NavLink>
                <NavLink to="/locations">المواقع والفروع</NavLink>
                <Link to="/login" className="bg-gradient-to-r from-red-800 to-red-900 text-amber-100 font-medium px-5 py-2.5 rounded-xl border border-amber-500/30 transition-all flex items-center gap-2 shadow-lg">
                  <LogIn className="w-4 h-4 text-amber-400" /> دخول الأعضاء
                </Link>
              </div>

              <div className="md:hidden">
                <button onClick={() => setIsOpen(!isOpen)} aria-label="فتح القائمة" className="text-stone-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg p-1">
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white border-t border-amber-100 px-6 py-4 space-y-3 flex flex-col shadow-inner">
                <Link to="/" onClick={() => setIsOpen(false)} className="py-2 font-medium hover:text-red-800 focus:text-red-800">الرئيسية</Link>
                <Link to="/companies" onClick={() => setIsOpen(false)} className="py-2 font-medium hover:text-red-800 focus:text-red-800">الشركات</Link>
                <Link to="/locations" onClick={() => setIsOpen(false)} className="py-2 font-medium hover:text-red-800 focus:text-red-800">المواقع</Link>
                <Link to="/login" onClick={() => setIsOpen(false)} className="bg-red-800 text-amber-100 text-center py-3 rounded-xl font-medium focus:ring-2 focus:ring-amber-500">دخول الأعضاء</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} className="text-stone-600 hover:text-red-800 focus:text-red-800 font-semibold transition-colors duration-300 relative group py-2 rounded focus:outline-none">
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 group-hover:w-full group-focus:w-full"></span>
    </Link>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/companies" element={<PageWrapper><Companies /></PageWrapper>} />
        <Route path="/locations" element={<PageWrapper><Locations /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageTransition}>
      {children}
    </motion.div>
  );
}

function Home() {
  return (
    <div className="text-center py-24 space-y-8 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/60 px-4 py-1.5 rounded-full text-amber-800 text-xs font-bold shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" /> منصة متطورة وجاهزة للإنتاج الفعلي
      </div>
      <h1 className="text-5xl md:text-7xl font-black text-stone-900 leading-tight">
        مرحباً بكم في فضاء <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-800 via-red-900 to-amber-600">الفخامة والأتمتة الذكية</span>
      </h1>
      <p className="text-base md:text-lg text-stone-600 max-w-2xl mx-auto font-medium">
        نظام سحابي مرن تمت مراجعته وتطويره بالكامل لتقديم أعلى مستويات الاستقرار والأمان البرمجي.
      </p>
      <div className="flex justify-center pt-6">
        <Link to="/companies" className="bg-gradient-to-r from-red-800 to-red-900 text-amber-100 px-8 py-4 rounded-xl font-bold border border-amber-500/30 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
          اكتشف الشركات المعتمدة
        </Link>
      </div>
    </div>
  );
}

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // حقل صريح لحالة أخطاء الـ API

  useEffect(() => {
    // 🛡️ معالجة البيانات بنمط آمن ونظيف عبر async/try-catch
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/companies`);
        setCompanies(response.data ?? []);
        setError(null);
      } catch (err) {
        console.error("API error:", err);
        setError("تعذر تحميل البيانات. حاول مرة أخرى لاحقاً.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // ⚡ تبسيط وتبديل منطق الفلترة المعقد بأسلوب نظيف وسريع وقوي
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredCompanies = companies.filter(company => 
    company?.name?.toLowerCase().includes(normalizedSearch) || 
    company?.type?.toLowerCase().includes(normalizedSearch) ||
    company?.city?.toLowerCase().includes(normalizedSearch)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-100 pb-6">
        <h2 className="text-3xl font-black text-stone-900 flex items-center gap-3">
          <Building2 className="text-red-800 w-8 h-8" /> سجل الشركات المعتمدة
        </h2>
        <div className="relative max-w-md w-full">
          <Search className="absolute right-4 top-3.5 w-5 h-5 text-stone-400" />
          <input 
            type="text" 
            aria-label="ابحث عن شركة أو مجال أو مدينة"
            placeholder="ابحث عن شركة، مجال، أو مدينة..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium text-sm shadow-sm" 
          />
        </div>
      </div>

      {/* 1. حالة التحميل النشط من السيرفر */}
      {isLoading && (
        <div className="flex justify-center py-20 items-center gap-2 text-red-800" role="status">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          <span className="font-medium">جاري جلب البيانات من السيرفر الملكي...</span>
        </div>
      )}

      {/* 2. حالة حدوث خطأ في الاتصال بالـ API */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-red-50 border border-red-100 rounded-2xl text-red-800 max-w-md mx-auto text-center gap-3 shadow-sm">
          <AlertTriangle className="w-10 h-10 text-red-600 animate-pulse" />
          <p className="font-bold text-lg">{error}</p>
        </div>
      )}

      {/* 3. حالة نجاح الاتصال ولكن لا توجد شركات مطابقة للبحث */}
      {!isLoading && !error && filteredCompanies.length === 0 && (
        <div className="text-center py-20 bg-stone-50 border border-stone-100 rounded-2xl max-w-md mx-auto p-8 shadow-inner">
          <Building2 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-500 font-bold text-lg">لا توجد شركات مطابقة للبحث</p>
        </div>
      )}

      {/* 4. عرض كروت الشركات عند استقرار البيانات وعثورها */}
      {!isLoading && !error && filteredCompanies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredCompanies.map((company) => (
