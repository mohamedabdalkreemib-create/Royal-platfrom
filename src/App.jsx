import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, LogIn, Menu, X, Search, Sparkles, Loader2, ShieldAlert, LayoutDashboard, PlusCircle, Phone, Globe, Briefcase } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0";

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } }
};

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 text-stone-800 font-sans antialiased" dir="rtl">
        {/* شريط التنقل الملكي */}
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
                <NavLink to="/locations">الموقع الجغرافي</NavLink>
                {isLoggedIn && <NavLink to="/admin-dashboard">لوحة الإدارة</NavLink>}
                
                <Link to="/login" onClick={() => { if(isLoggedIn) { localStorage.removeItem('token'); setIsLoggedIn(false); } }} className="bg-gradient-to-r from-red-800 to-red-900 text-amber-100 font-medium px-5 py-2.5 rounded-xl border border-amber-500/30 transition-all flex items-center gap-2 shadow-lg shadow-red-900/10">
                  <LogIn className="w-4 h-4 text-amber-400" /> {isLoggedIn ? "تسجيل الخروج" : "دخول الأعضاء"}
                </Link>
              </div>

              <div className="md:hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="text-stone-600 hover:text-red-800 p-1">
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white border-t border-amber-100 px-6 py-4 space-y-3 flex flex-col shadow-inner">
                <Link to="/" onClick={() => setIsOpen(false)} className="py-2 font-medium hover:text-red-800">الرئيسية</Link>
                <Link to="/companies" onClick={() => setIsOpen(false)} className="py-2 font-medium hover:text-red-800">الشركات</Link>
                <Link to="/locations" onClick={() => setIsOpen(false)} className="py-2 font-medium hover:text-red-800">المواقع</Link>
                {isLoggedIn && <Link to="/admin-dashboard" onClick={() => setIsOpen(false)} className="py-2 font-medium hover:text-red-800">لوحة الإدارة</Link>}
                <Link to="/login" onClick={() => { setIsOpen(false); if(isLoggedIn) { localStorage.removeItem('token'); setIsLoggedIn(false); } }} className="bg-red-800 text-amber-100 text-center py-3 rounded-xl font-medium">{isLoggedIn ? "تسجيل الخروج" : "دخول الأعضاء"}</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnimatedRoutes setIsLoggedIn={setIsLoggedIn} />
        </main>
      </div>
    </Router>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} className="text-stone-600 hover:text-red-800 font-semibold transition-colors duration-300 relative group py-2">
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}

function AnimatedRoutes({ setIsLoggedIn }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/companies" element={<PageWrapper><Companies /></PageWrapper>} />
        <Route path="/locations" element={<PageWrapper><Locations /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login setIsLoggedIn={setIsLoggedIn} /></PageWrapper>} />
        <Route path="/admin-dashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
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

/* ================= الصفحات الفردية بالهيكل الملكي الجديد ================= */

function Home() {
  return (
    <div className="text-center py-24 space-y-8 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/60 px-4 py-1.5 rounded-full text-amber-800 text-xs font-bold shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" /> منصة النخبة السحابية المؤتمتة حية الآن
      </div>
      <h1 className="text-5xl md:text-7xl font-black text-stone-900 leading-tight">
        مرحباً بكم في فضاء <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-800 via-red-900 to-amber-600">الفخامة والأتمتة الذكية</span>
      </h1>
      <p className="text-base md:text-lg text-stone-600 max-w-2xl mx-auto font-medium">
        نظام سحابي ذكي ومستقر لإدارة الشركات والبيانات والمواقع الجغرافية بكفاءة مطلقة وأمان مشفر.
      </p>
      <div className="flex justify-center pt-6">
        <Link to="/companies" className="bg-gradient-to-r from-red-800 to-red-900 text-amber-100 px-8 py-4 rounded-xl font-bold border border-amber-500/30 shadow-xl transition-all hover:scale-[1.02]">
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

  useEffect(() => {
    axios.get(`${API_BASE_URL}/companies`)
      .then(response => {
        setCompanies(response.data || []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        // بيانات احتياطية ذكية لعرض التصميم في حال غياب الإنترنت
        setCompanies([
          { id: 1, name: "مجموعة العليان للاستثمار", type: "خدمات مالية وعقارية", city: "الرياض", phone: "+9661100000", website: "olayan.com" },
          { id: 2, name: "شركة الابتكار اللامتناهي", type: "تقنيات الذكاء الاصطناعي", city: "دبي", phone: "+971400000", website: "innovation.ae" }
        ]);
      });
  }, []);

  const filteredCompanies = companies.filter(c => 
    c?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c?.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-100 pb-6">
        <h2 className="text-3xl font-black text-stone-900 flex items-center gap-3">
          <Building2 className="text-red-800 w-8 h-8" /> سجل النخبة للشركات
        </h2>
        <div className="relative max-w-md w-full">
          <Search className="absolute right-4 top-3.5 w-5 h-5 text-stone-400" />
          <input type="text" placeholder="ابحث عن شركة، مجال..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-4 pr-12 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-amber-500 transition-all font-medium text-sm shadow-sm" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20 items-center gap-2 text-red-800">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          <span className="font-medium">جاري المزامنة مع قاعدة البيانات...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredCompanies.map((company) => (
              <motion.div key={company.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} whileHover={{ y: -8, boxShadow: "0 20px 30px -10px rgba(153, 27, 27, 0.08)", borderColor: "rgba(245, 158, 11, 0.4)" }} className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm relative overflow-hidden group transition-all duration-300">
                <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-red-50 text-red-800 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-amber-100">
                  <Building2 className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-extrabold text-xl text-stone-900 group-hover:text-red-800 transition-colors">{company.name}</h3>
