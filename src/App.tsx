import { useState, useEffect } from 'react'
import './App.css'

// ========================
// NAVBAR
// ========================
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('profile')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      const sections = ['profile', 'certifications', 'summary', 'skills', 'education', 'contact']
      for (const id of sections.reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-brand">QUỲNH NGA BA</div>
      <ul className="navbar-nav">
        {[
          { id: 'profile', icon: 'person', label: 'Profile' },
          { id: 'certifications', icon: 'workspace_premium', label: 'Certifications' },
          { id: 'summary', icon: 'auto_awesome', label: 'Summary' },
          { id: 'skills', icon: 'psychology', label: 'Skills' },
          { id: 'education', icon: 'school', label: 'Education' },
          { id: 'contact', icon: 'mail', label: 'Contact' },
        ].map(({ id, icon, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={activeSection === id ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollTo(id) }}
            >
              <span className="nav-icon material-icons-round">{icon}</span>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// ========================
// HERO / PROFILE
// ========================
function Hero() {
  return (
    <section id="profile" className="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <div className="hero-label">
            <span className="material-icons-round">verified</span>
            Business Analyst — Portfolio 2024
          </div>

          <h1 className="hero-title">
            Nguyễn Thị<br />
            <span className="highlight">Quỳnh Nga</span>
          </h1>

          <p className="hero-role">Senior Business Analyst &amp; System Designer</p>

          <p className="hero-desc">
            Bridging the gap between complex business requirements and elegant software solutions.
            Specializing in Agile methodologies and user-centric design — I translate high-level
            vision into executable technical specifications.
          </p>

          <div className="hero-cta">
            <a href="#contact" className="btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}>
              <span className="btn-icon material-icons-round">mail</span>
              Get in Touch
            </a>
            <a href="#certifications" className="btn-secondary" onClick={(e) => { e.preventDefault(); document.getElementById('certifications')?.scrollIntoView({ behavior: 'smooth' }) }}>
              <span className="btn-icon material-icons-round">workspace_premium</span>
              View Certificates
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">6+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">30+</span>
              <span className="stat-label">Projects Delivered</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">3</span>
              <span className="stat-label">Certifications</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="avatar-container">
            <div className="avatar-ring">
              <div className="avatar-ring-inner" />
            </div>
            <div className="avatar-img">
              <img
                src="/avatar.png"
                alt="Nguyễn Thị Quỳnh Nga — Business Analyst"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
              />
            </div>

            <div className="badge-floating badge-top">
              <span className="badge-icon material-icons-round">workspace_premium</span>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--on-surface)' }}>IIBA Certified</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--on-surface-variant)' }}>Professional BA</div>
              </div>
            </div>

            <div className="badge-floating badge-bottom">
              <span className="badge-icon material-icons-round">account_tree</span>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--on-surface)' }}>Agile / Scrum</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--on-surface-variant)' }}>Practitioner</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ========================
// CERTIFICATIONS
// ========================
function Certifications() {
  const certs = [
    {
      icon: 'workspace_premium',
      title: 'Professional BA',
      issuer: 'International Institute of Business Analysis (IIBA)',
      badge: 'IIBA Certified',
    },
    {
      icon: 'design_services',
      title: 'UI/UX Design Master',
      issuer: 'Google Professional Certification',
      badge: 'Google Certified',
    },
    {
      icon: 'speed',
      title: 'Agile/Scrum Practitioner',
      issuer: 'Scrum.org Professional Level',
      badge: 'Scrum.org',
    },
  ]

  return (
    <section id="certifications" className="section">
      <div className="section-label">
        <span className="material-icons-round">workspace_premium</span>
        Credentials
      </div>
      <h2 className="section-title">Professional Certifications</h2>
      <p className="section-desc">
        Internationally recognized credentials that validate expertise across business analysis,
        design, and agile delivery.
      </p>

      <div className="certs-grid">
        {certs.map((cert) => (
          <div key={cert.title} className="cert-card">
            <div className="cert-icon-wrap">
              <span className="material-icons-round">{cert.icon}</span>
            </div>
            <div className="cert-title">{cert.title}</div>
            <div className="cert-issuer">{cert.issuer}</div>
            <div className="cert-badge">
              <span className="material-icons-round">verified</span>
              {cert.badge}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ========================
// ABOUT / SUMMARY
// ========================
function About() {
  const coreSkills = [
    'Software Design',
    'System Flows & Data Models',
    'Stakeholder Management',
    'Executive Communication',
    'Agile / Scrum',
    'UX Research',
    'BRD / FRD Writing',
    'Process Optimization',
  ]

  return (
    <div id="summary" className="about-section">
      <div className="about-inner">
        <div>
          <div className="section-label">
            <span className="material-icons-round">auto_awesome</span>
            About Me
          </div>
          <h2 className="section-title">Professional Summary</h2>
          <p className="section-desc" style={{ marginBottom: '1rem' }}>
            Business Analyst specializing in <strong>Software Design &amp; System Architecture</strong>. With
            a focus on Agile methodologies and user-centric design, I translate high-level vision
            into executable technical specifications that developers and stakeholders both understand.
          </p>
          <p style={{ fontSize: '0.9375rem', color: 'var(--on-surface-variant)', lineHeight: 1.75 }}>
            My approach combines analytical rigor with creative thinking — ensuring that every
            requirement is not just documented, but truly understood and actionable.
          </p>
        </div>

        <div>
          <div className="section-label" style={{ marginBottom: '1rem' }}>
            <span className="material-icons-round">category</span>
            Core Competencies
          </div>
          <div className="core-skills">
            {coreSkills.map((skill) => (
              <div key={skill} className="skill-pill">
                <span className="skill-dot" />
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ========================
// SKILLS
// ========================
function Skills() {
  const skills = [
    {
      icon: 'manage_search',
      title: 'Requirements Gathering',
      desc: 'Expert at eliciting complex needs from stakeholders through deep interviews, workshops, and observation techniques.',
    },
    {
      icon: 'design_services',
      title: 'Wireframing & Prototyping',
      desc: 'Low-fi and High-fi prototyping using Figma, Balsamiq, and Adobe XD for rapid validation cycles.',
    },
    {
      icon: 'handshake',
      title: 'Stakeholder Management',
      desc: 'Negotiation and conflict resolution across multi-disciplinary teams and executive stakeholders.',
    },
    {
      icon: 'article',
      title: 'User Stories & Documentation',
      desc: 'Detailed BRD, FRD, and INVEST-compliant user stories that guide teams to successful delivery.',
    },
    {
      icon: 'account_tree',
      title: 'System & Process Modeling',
      desc: 'BPMN 2.0, UML, sequence diagrams, data flow diagrams and entity-relationship modeling.',
    },
    {
      icon: 'query_stats',
      title: 'Data Analysis',
      desc: 'SQL queries, Excel Power Query, and business intelligence dashboards to support decision-making.',
    },
  ]

  return (
    <div id="skills" className="skills-section">
      <div className="skills-inner">
        <div className="section-label">
          <span className="material-icons-round">psychology</span>
          Expertise
        </div>
        <h2 className="section-title">Key Skills</h2>
        <p className="section-desc">
          A diverse toolkit spanning analytical, technical, and interpersonal domains — delivering
          comprehensive coverage across the software delivery lifecycle.
        </p>

        <div className="skills-grid">
          {skills.map((skill) => (
            <div key={skill.title} className="skill-card">
              <div className="skill-card-header">
                <div className="skill-card-icon">
                  <span className="material-icons-round">{skill.icon}</span>
                </div>
                <div>
                  <div className="skill-card-title">{skill.title}</div>
                  <div className="skill-card-desc">{skill.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ========================
// EDUCATION
// ========================
function Education() {
  const timeline = [
    {
      period: '2014 – 2018',
      degree: 'Bachelor of Science in Information Technology',
      school: 'Ho Chi Minh City University of Technology (HCMUT)',
      desc: 'Major in Software Engineering. Graduated with Distinction (GPA 8.4/10). Final thesis on "Applying UML in Agile Software Projects."',
    },
    {
      period: '2018 – 2019',
      degree: 'Diploma in Business Analysis',
      school: 'FPT Training Center, Ho Chi Minh City',
      desc: 'Intensive program covering requirements elicitation, process modeling, and business case development.',
    },
    {
      period: '2021 – 2022',
      degree: 'UX Design Professional Certificate',
      school: 'Google / Coursera Online Program',
      desc: 'Completed 7-course specialization on user experience research, wireframing, prototyping, and usability testing.',
    },
  ]

  return (
    <div id="education" className="education-section">
      <div className="section" style={{ paddingBottom: '4rem' }}>
        <div className="section-label">
          <span className="material-icons-round">school</span>
          Academic Background
        </div>
        <h2 className="section-title">Education</h2>
        <p className="section-desc">
          A solid academic foundation combined with continuous professional development ensures
          both theoretical depth and practical expertise.
        </p>

        <div className="timeline">
          {timeline.map((item) => (
            <div key={item.degree} className="timeline-item">
              <div className="timeline-period">
                <span className="material-icons-round">schedule</span>
                {item.period}
              </div>
              <div className="timeline-degree">{item.degree}</div>
              <div className="timeline-school">{item.school}</div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', marginTop: '0.625rem', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ========================
// CONTACT
// ========================
function Contact() {
  return (
    <div id="contact" className="contact-section">
      <div className="contact-inner">
        <div>
          <div className="section-label">
            <span className="material-icons-round">mail</span>
            Get In Touch
          </div>
          <h2 className="section-title">Let's Work Together</h2>
          <p style={{ fontSize: '1rem', color: 'var(--on-surface-variant)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
            Available for contract projects, consulting engagements, and full-time BA opportunities.
            I bring clarity to complexity and help teams deliver with confidence.
          </p>

          <div className="contact-availability">
            <div className="availability-dot" />
            Available for contract projects and consulting
          </div>
        </div>

        <div>
          <div className="contact-links">
            {[
              { icon: 'mail', label: 'Email', value: 'nga.quynh@example.com', href: 'mailto:nga.quynh@example.com' },
              { icon: 'share', label: 'LinkedIn', value: 'linkedin.com/in/quynhngaba', href: 'https://linkedin.com/in/quynhngaba' },
              { icon: 'location_on', label: 'Location', value: 'Ho Chi Minh City, Vietnam', href: '#' },
            ].map(({ icon, label, value, href }) => (
              <a key={label} href={href} className="contact-link-card" target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <div className="contact-link-icon">
                  <span className="material-icons-round">{icon}</span>
                </div>
                <div>
                  <div className="contact-link-label">{label}</div>
                  <div className="contact-link-value">{value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ========================
// FOOTER
// ========================
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">NGUYỄN THỊ QUỲNH NGA</div>
        <div className="footer-copy">© 2024 Professional Portfolio. AUTH_VERIFIED_2024_P_NGBA</div>
        <div className="footer-links">
          <a href="https://linkedin.com/in/quynhngaba" title="LinkedIn" target="_blank" rel="noreferrer" className="material-icons-round">share</a>
          <a href="https://github.com" title="GitHub" target="_blank" rel="noreferrer" className="material-icons-round">code</a>
          <a href="mailto:nga.quynh@example.com" title="Email" className="material-icons-round">mail</a>
        </div>
      </div>
    </footer>
  )
}

// ========================
// APP ROOT
// ========================
function App() {
  return (
    <>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
      <Navbar />
      <main>
        <Hero />
        <Certifications />
        <About />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
