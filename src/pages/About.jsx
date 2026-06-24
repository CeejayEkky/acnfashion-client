// frontend/src/pages/About.js
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaRocket, FaShieldAlt, FaHeart, FaUsers, 
  FaGem, FaStar, FaHandshake 
} from "react-icons/fa";

const About = () => {
  const [isVisible, setIsVisible] = useState({});
  const statsRef = useRef(null);

  // ✅ Format number with commas
  const formatNumber = (num) => {
    if (num >= 1000) {
      return num.toLocaleString();
    }
    return num;
  };

  useEffect(() => {
    // Scroll reveal observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll('.reveal-scale, .reveal-left-strong, .reveal-right-strong, .stagger-children')
      .forEach(el => observer.observe(el));

    // ✅ Stats counter animation - FIXED
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const statEls = entry.target.querySelectorAll('.stat-number');
            statEls.forEach((el, index) => {
              const target = parseFloat(el.dataset.target);
              const suffix = el.dataset.suffix || '';
              setTimeout(() => animateNumber(el, target, suffix), index * 200);
            });
            setIsVisible(prev => ({ ...prev, stats: true }));
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      statsObserver.observe(statsRef.current);
    }

    return () => {
      observer.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  // ✅ Number animation - FIXED
  const animateNumber = (el, target, suffix) => {
    let current = 0;
    const steps = 60;
    const increment = target / steps;
    let count = 0;
    
    const timer = setInterval(() => {
      count++;
      current += increment;
      
      if (count >= steps) {
        current = target;
        clearInterval(timer);
      }
      
      // ✅ Handle decimal numbers (like 4.9)
      const displayValue = Number.isInteger(target) ? Math.floor(current) : current.toFixed(1);
      el.textContent = displayValue + suffix;
    }, 20);
  };

  // ✅ Stats data with suffix
  const stats = [
    { number: 12, label: "Happy Customers", icon: <FaUsers className="text-blue-400" />, suffix: "+" },
    { number: 40, label: "Products", icon: <FaGem className="text-blue-400" />, suffix: "+" },
    { number: 4.9, label: "Average Rating", icon: <FaStar className="text-blue-400" />, suffix: "★" },
    { number: 98, label: "Satisfaction", icon: <FaHeart className="text-blue-400" />, suffix: "%" },
  ];

  const values = [
    { 
      icon: <FaRocket />, 
      title: "Innovation", 
      desc: "Pushing boundaries with cutting-edge fashion trends and designs.",
      color: "from-blue-500/20 to-blue-400/10"
    },
    { 
      icon: <FaShieldAlt />, 
      title: "Quality", 
      desc: "Premium materials and craftsmanship in every piece we create.",
      color: "from-blue-400/20 to-blue-300/10"
    },
    { 
      icon: <FaHeart />, 
      title: "Passion", 
      desc: "Driven by a deep love for fashion and customer satisfaction.",
      color: "from-purple-500/20 to-blue-400/10"
    },
    { 
      icon: <FaHandshake />, 
      title: "Trust", 
      desc: "Building lasting relationships through honesty and reliability.",
      color: "from-blue-300/20 to-blue-500/10"
    },
  ];

  const timeline = [
    { year: "2026", title: "Founded", desc: "A.C.N Fashion House was born" },
    { year: "2027", title: "First Collection", desc: "Launched our debut fashion line" },
    { year: "2028", title: "Expansion", desc: "Opened 3 new locations" },
    { year: "2029", title: "Digital Store", desc: "Launched our online platform" },
  ];

  return (
    <main className="aura-bg cyber-grid relative min-h-screen overflow-x-hidden">
      {/* Glowing Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="aura-orb-glow" />
        <div className="aura-orb-glow" />
        <div className="aura-orb-glow" />
        <div className="aura-orb-glow" />
        <div className="aura-orb-glow" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-20">
        {/* ===== HERO ===== */}
        <div className="text-center mb-16">
          <div className="aura-float inline-block">
            <span className="text-6xl md:text-7xl">✨</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold gradient-text mt-4">
            About A.C.N
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mt-4 glow-text-strong">
            Crafting the future of fashion, one piece at a time.
          </p>
          <div className="w-24 h-1 bg-linear-to-r from-blue-400 to-blue-600 rounded-full mx-auto mt-6" />
        </div>

        {/* ===== STATS - With Number Animation ===== */}
        <div 
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 stagger-children"
        >
          {stats.map((stat, index) => (
            <div key={index} className="aura-card rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2 icon-pulse">{stat.icon}</div>
              <div 
                className="stat-number text-3xl md:text-4xl font-bold text-blue-600"
                data-target={stat.number}
                data-suffix={stat.suffix || ''}
              >
                0{stat.suffix}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ===== STORY ===== */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
          <div className="reveal-left-strong">
            <span className="text-sm font-semibold text-blue-500 uppercase tracking-wider">Our Story</span>
            <h2 className="text-3xl font-bold mt-2 glow-text-strong">From Vision to Reality</h2>
            <p className="text-gray-600 leading-relaxed mt-4">
              Founded with a vision to redefine fashion, A.C.N Fashion House has 
              grown from a small boutique to a premier fashion destination. We believe 
              fashion is more than clothing — it's a form of self-expression, 
              confidence, and art.
            </p>
            <p className="text-gray-600 leading-relaxed mt-2">
              Every piece we create tells a story of craftsmanship, innovation, 
              and a deep understanding of what makes people feel extraordinary.
            </p>
          </div>
          <div className="reveal-right-strong">
            <div className="aura-pulse-border rounded-2xl p-8 text-center aura-shimmer">
              <span className="text-7xl md:text-8xl block">🌟</span>
              <p className="text-sm text-gray-500 mt-4">Est. 2026 — Lagos, Nigeria</p>
            </div>
          </div>
        </div>

        {/* ===== TIMELINE ===== */}
        <div className="mb-16">
          <h2 className="reveal-scale text-3xl font-bold text-center mb-10 glow-text-strong">
            Our Journey
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {timeline.map((item, index) => (
              <div 
                key={index} 
                className={`reveal-scale aura-card rounded-2xl p-6 text-center`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="text-2xl font-bold text-blue-500">{item.year}</div>
                <h3 className="font-semibold text-blue-700 mt-2">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== VALUES ===== */}
        <div className="mb-16">
          <h2 className="reveal-scale text-3xl font-bold text-center mb-10 glow-text-strong">
            What Drives Us
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div 
                key={index} 
                className={`reveal-scale aura-card rounded-2xl p-6 flex gap-4 items-start`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${value.color} flex items-center justify-center text-2xl text-blue-500 shrink-0 icon-pulse`}>
                  {value.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700">{value.title}</h3>
                  <p className="text-sm text-gray-500">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== CTA ===== */}
        <div className="reveal-scale">
          <div className="aura-pulse-border rounded-3xl p-10 md:p-14 text-center bg-linear-to-br from-blue-50/50 to-transparent">
            <h2 className="text-3xl font-bold glow-text-strong mb-4">
              Ready to Elevate Your Style?
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Join thousands of satisfied customers experiencing the A.C.N difference.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/discover/all" 
                className="bg-linear-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-lg shadow-blue-500/30"
              >
                Shop Now →
              </Link>
              <Link 
                to="/contacts" 
                className="border-2 border-blue-500 text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;