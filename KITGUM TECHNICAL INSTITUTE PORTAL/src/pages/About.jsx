import React from 'react';
import { 
  Award, Shield, Target, Eye, Heart, Compass, CheckCircle2, 
  Sparkles, Download, BookOpen, Wrench, Users, Building, 
  Lightbulb, ShieldCheck, Leaf, ArrowRight 
} from 'lucide-react';
import { exportToPDF } from '../utils/exportUtils';
import { Link } from 'react-router-dom';

const About = () => {
  const baseUrl = import.meta.env.BASE_URL;

  const coreValues = [
    {
      title: "Self-Reliance",
      acholi: "Lupwonye me Kwo",
      icon: <Wrench className="text-amber-400" size={26} />,
      gradient: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
      textColor: "text-amber-400",
      description: "Cultivating hands-on mastery and entrepreneurial skills that liberate trainees to establish independent enterprises, manufacture solutions, and drive their own livelihood."
    },
    {
      title: "Excellence & Craftsmanship",
      acholi: "Bedo maber loyo",
      icon: <Award className="text-cyan-400" size={26} />,
      gradient: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30",
      textColor: "text-cyan-400",
      description: "Adhering to rigorous UBTEB standards and international technical benchmarks, ensuring our graduates execute precision engineering and superior practical craftsmanship."
    },
    {
      title: "Integrity & Accountability",
      acholi: "Bedo lakit ata",
      icon: <ShieldCheck className="text-emerald-400" size={26} />,
      gradient: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
      textColor: "text-emerald-400",
      description: "Upholding absolute honesty, transparency in material estimation, strict workshop accountability, and ethical responsibility towards clients and society."
    },
    {
      title: "Innovation & Creativity",
      acholi: "Cwec manyen",
      icon: <Lightbulb className="text-purple-400" size={26} />,
      gradient: "from-purple-500/20 to-indigo-500/10 border-purple-500/30",
      textColor: "text-purple-400",
      description: "Transforming local materials into modern industrial answers through solar energy research, computer-aided drafting (CAD), and sustainable construction technologies."
    },
    {
      title: "Discipline & Safety",
      acholi: "Pwonye ki Gwokke",
      icon: <Shield className="text-rose-400" size={26} />,
      gradient: "from-rose-500/20 to-red-500/10 border-rose-500/30",
      textColor: "text-rose-400",
      description: "Inculcating zero-tolerance workshop safety, strict adherence to personal protective equipment (PPE), mutual respect, and disciplined punctuality."
    },
    {
      title: "Inclusivity & Community Service",
      acholi: "Ribbe Kacel",
      icon: <Heart className="text-blue-400" size={26} />,
      gradient: "from-blue-500/20 to-sky-500/10 border-blue-500/30",
      textColor: "text-blue-400",
      description: "Advancing affirmative action for women in engineering, providing bursaries for disadvantaged youths, and delivering community infrastructure projects across Acholi sub-region."
    }
  ];

  const pillars = [
    {
      title: "Modern Technical Workshops",
      desc: "Fully outfitted electrical machines, motor vehicle bays, carpentry benches, and bricklaying arenas.",
      image: `${baseUrl}images/workshop-1.jpg`,
      tag: "Applied Engineering"
    },
    {
      title: "Advanced ICT & Design Labs",
      desc: "High-speed internet laboratories offering AutoCAD, computer hardware troubleshooting, and software skills.",
      image: `${baseUrl}images/lab-session.jpg`,
      tag: "Digital Technology"
    },
    {
      title: "Student Leadership & Governance",
      desc: "Vibrant Students' Guild empowering student welfare, democratic debates, and community volunteer drives.",
      image: `${baseUrl}images/guild-event.jpg`,
      tag: "Student Guild"
    },
    {
      title: "Athletics & Warriors Sports",
      desc: "Champions in Northern Uganda technical games across football, netball, volleyball, and track events.",
      image: `${baseUrl}images/sports-football.jpg`,
      tag: "KTI Warriors"
    },
    {
      title: "Science & Innovation Galas",
      desc: "Annual regional showcases presenting solar dehydrators, smart irrigation models, and eco-briquettes.",
      image: `${baseUrl}images/exhibition.jpg`,
      tag: "TVET Innovations"
    },
    {
      title: "Accredited TVET Certifications",
      desc: "UBTEB and DIT accredited diplomas and certificates opening guaranteed industrial employment pathways.",
      image: `${baseUrl}images/graduation-alumni.jpg`,
      tag: "UBTEB Certification"
    }
  ];

  const handleDownloadCharter = () => {
    const charterData = [
      { section: 'Motto', content: 'Education for Self Reliance (Lupwonye me Kwo)' },
      { section: 'Vision', content: 'To be the premier center of technical and vocational excellence in Uganda and East Africa.' },
      { section: 'Mission', content: 'To provide accessible, quality, competency-based TVET skills training for sustainable self-reliance.' },
      { section: 'Core Value 1', content: 'Self-Reliance: Fostering enterprise, technical craftsmanship, and economic freedom.' },
      { section: 'Core Value 2', content: 'Excellence & Craftsmanship: Strict compliance with national TVET and industrial standards.' },
      { section: 'Core Value 3', content: 'Integrity: Transparent estimation, ethical conduct, and mutual accountability.' },
      { section: 'Core Value 4', content: 'Innovation: Practical engineering solving real community and environmental challenges.' },
      { section: 'Core Value 5', content: 'Discipline & Safety: Workshop safety first, professional discipline, and punctuality.' },
      { section: 'Core Value 6', content: 'Inclusivity: Gender equity in technical trades and community service.' }
    ];

    const columns = [
      { header: 'Institutional Pillar', key: 'section' },
      { header: 'Charter Declaration', key: 'content' }
    ];

    exportToPDF(charterData, 'KTI_Institutional_Charter', columns, 'Kitgum Technical Institute - Institutional Charter & Core Values');
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-500">
      
      {/* Top Welcoming Crest & Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 text-white p-8 sm:p-12 border border-cyan-500/20 shadow-2xl text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Majestic School Badge at the Top */}
          <div className="relative mb-6 group">
            <div className="absolute -inset-3 bg-gradient-to-r from-amber-500 via-cyan-400 to-blue-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-white p-2.5 shadow-2xl border-4 border-amber-400 flex items-center justify-center overflow-hidden">
              <img 
                src={`${baseUrl}badge-final.png`}
                alt="Kitgum Technical Institute Official Badge"
                className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.src = `${baseUrl}images/logo.jpg`; }}
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">
            <Sparkles size={16} className="text-amber-400" /> Monsignor Antonio Vignato Memorial
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase mb-2">
            Kitgum Technical <span className="bg-gradient-to-r from-cyan-300 via-blue-200 to-amber-300 bg-clip-text text-transparent">Institute</span>
          </h1>

          <div className="inline-block px-6 py-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-serif italic text-lg sm:text-xl font-bold tracking-wide shadow-inner mb-6">
            &ldquo;Education for Self Reliance&rdquo;
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            Established to impart practical technical competencies, vocational brilliance, and ethical values. Kitgum Technical Institute stands as Northern Uganda&apos;s flagship TVET sanctuary, empowering generations of technicians, engineers, and entrepreneurs.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 pt-6 border-t border-white/10 text-xs sm:text-sm text-cyan-200 font-semibold">
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">🏛️ Established 1978</span>
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">📜 UBTEB Center #UBT042</span>
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">📍 Kitgum Municipality, Uganda</span>
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">⚙️ 7 Technical Faculties</span>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button 
              onClick={handleDownloadCharter}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-105"
            >
              <Download size={18} /> Download Official Charter (PDF)
            </button>
            <Link 
              to="/admissions"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur transition-all"
            >
              <BookOpen size={18} /> Apply for Admission
            </Link>
          </div>

        </div>
      </div>

      {/* Vision & Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Our Vision Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-950/80 via-slate-900 to-slate-950 p-8 sm:p-10 border border-cyan-400/30 shadow-xl group hover:border-cyan-400/60 transition-all">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-lg">
              <Eye size={30} />
            </div>
            <div className="inline-block text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full">
              Strategic Vision Statement
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Our Vision</h2>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed italic font-serif">
              &ldquo;To be the premier center of technical and vocational excellence in Uganda and the wider East African region, generating highly skilled, innovative, ethical, and entrepreneurial technicians who spearhead sustainable industrialization and community self-reliance.&rdquo;
            </p>
            <div className="pt-4 border-t border-white/10 text-xs text-cyan-300 flex items-center gap-2 font-medium">
              <CheckCircle2 size={16} /> Regional TVET Leadership & Industrial Competence
            </div>
          </div>
        </div>

        {/* Our Mission Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-950 p-8 sm:p-10 border border-amber-400/30 shadow-xl group hover:border-amber-400/60 transition-all">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-lg">
              <Target size={30} />
            </div>
            <div className="inline-block text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">
              Institutional Mission Mandate
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Our Mission</h2>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed italic font-serif">
              &ldquo;To provide accessible, quality, competency-based technical and vocational education and training (TVET), practical workshop skills, and community-driven innovations that empower learners with self-reliance, entrepreneurship, and lifelong employability.&rdquo;
            </p>
            <div className="pt-4 border-t border-white/10 text-xs text-amber-300 flex items-center gap-2 font-medium">
              <CheckCircle2 size={16} /> Competency-Based Training (CBET) & Self-Reliance
            </div>
          </div>
        </div>

      </div>

      {/* Six Core Values Section */}
      <div className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs font-bold uppercase tracking-widest">
            <Compass size={14} /> Institutional Ethos & Philosophy
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Guiding Core Values
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            The fundamental cultural and professional principles that guide our instructors, apprentices, leadership, and industrial partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreValues.map((val, idx) => (
            <div 
              key={idx} 
              className={`rounded-3xl p-6 sm:p-7 border bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md">
                    {val.icon}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400">0{idx + 1}</span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900">{val.title}</h3>
                  <p className="text-xs font-semibold text-cyan-600 italic mt-0.5">
                    Acholi: &ldquo;{val.acholi}&rdquo;
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {val.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <CheckCircle2 size={14} className="text-emerald-500" /> Active Institutional Pillar
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Legacy & Campus Showcase with Real Images */}
      <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Building size={14} /> Heritage & Foundation
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Honoring the Legacy of <br />
              <span className="text-cyan-400">Monsignor Antonio Vignato</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Named in perpetual commemoration of Monsignor Antonio Vignato, a visionary missionary educator who championed technical empowerment and practical trade mastery as the ultimate vehicle for human dignity and community upliftment.
            </p>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              From its inception in Kitgum, the institute has weathered historical transitions to emerge as a premier government-aided technical sanctuary, continuously expanding its engineering workshops, solar laboratory, and agricultural farm to serve youths across Uganda and South Sudan.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-2xl sm:text-3xl font-black text-amber-400">45+ Years</p>
                <p className="text-xs text-slate-400 mt-1 font-semibold">Of Vocational Excellence</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-2xl sm:text-3xl font-black text-cyan-400">12,500+</p>
                <p className="text-xs text-slate-400 mt-1 font-semibold">Self-Reliant Graduates</p>
              </div>
            </div>
          </div>

          {/* Real Campus Image */}
          <div className="relative group rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl">
            <img 
              src={`${baseUrl}images/campus-main.jpg`} 
              alt="Kitgum Technical Institute Main Campus" 
              className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">Main Institutional Grounds</span>
              <h4 className="text-lg font-black text-white">Kitgum Technical Institute Campus</h4>
              <p className="text-xs text-slate-300">Spanning modern workshop blocks, administration quadrangle, and sports arena.</p>
            </div>
          </div>

        </div>

        {/* Six TVET Pillars Photo Showcase */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-black text-white">Pillars of TVET Training in Pictures</h3>
              <p className="text-xs text-slate-400">Authentic photographic documentation of learning, workshops, and student campus life.</p>
            </div>
            <Link 
              to="/departments" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Explore Departments <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p, idx) => (
              <div key={idx} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden group hover:border-cyan-400/40 transition-all shadow-lg flex flex-col justify-between">
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={p.image} 
                    alt={p.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                    {p.tag}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base mb-1.5">{p.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-cyan-300">
                    <span>Verified Facility</span>
                    <span>KTI Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default About;
