import "./About.css";

import { images } from "../../assets";
import { Filter, Map, Lock, User, Heart, Zap } from "lucide-react";

export default function About() {
  const contributors = [
    {
      name: "Yaroslav Kazeev",
      role: "HYF trainee",
      avatar: images.yaroslavAvatar,
      description:
        "The main instigator and disruptor of the project. He realized that many job search sites produce results that are irrelevant to the applicant, and figured out how to make them customizable. Combined big-picture vision with the hands-on implementation of core features.",
      gitHub: "https://github.com/YaroslavKazeev",
      linkedin: "https://www.linkedin.com/in/yaroslavkazeev/",
    },
    {
      name: "Hanna Dubyna",
      role: "HYF trainee",
      avatar: images.hannaAvatar,
      description:
        "Led UI/UX design and brought key features to life — from route calculation and Firebase-powered avatar uploads to LinkedIn API integration, guest user experience, and database connection. Also built the About page and core navigation.",
      gitHub: "https://github.com/HannaInIT",
      linkedin: "https://www.linkedin.com/in/hanna-dubyna/",
    },

    {
      name: "Yahya Al-Ademi",
      role: "HYF trainee",
      avatar: images.yahyaAvatar,
      description:
        "Designed and implemented the full authentication architecture for the application, covering secure backend workflows (user registration, login, hashing, token-based password reset, email delivery) and complete frontend integration using React Context, ensuring seamless communication between client and server.",
      gitHub: "https://github.com/YahyaAl-Ademi",
      linkedin: "https://www.linkedin.com/in/yahya-al-ademi-12786555/",
    },
    {
      name: "Stas Seldin",
      role: "DevOps",
      avatar: images.stasAvatar,
      description:
        "Our DevOps, Education Director and technical compass who provided invaluable guidance on everything from database configuration to deployment strategies during weekly Tech Hours, ensuring that the team could tackle any challenge with confidence.",
      gitHub: "https://github.com/stasel",
      linkedin: "https://www.linkedin.com/in/stasel/",
    },

    {
      name: "Jana Gombitová",
      role: "Product Owner",
      avatar: images.janaAvatar,
      description:
        "Our Product Owner, Scrum Master and guiding light — translating user needs into clear features, providing invaluable design feedback, teaching us industry best practices, keeping the team aligned, and helping us build a product that truly serves its users.",
      gitHub: "https://github.com/janagombitova",
      linkedin:
        "https://www.linkedin.com/in/jana-gombitova-42b08394?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    },

    {
      name: "Tim Lorent",
      role: "Tech lead",
      avatar: images.timAvatar,
      description:
        "Our Tech Lead who guided us through technical sessions, helping us navigate challenges, distribute responsibilities, and establish effective development workflows — especially during the critical early stages of the project.",

      gitHub: "https://github.com/tlorent",
      linkedin: "https://www.linkedin.com/in/timlorent/",
    },
  ];

  const features = [
    {
      icon: <Filter className="feature-icon" />,
      title: "Smart filtering and sorting",
      description:
        "Filter by job type, work mode, and experience level, and sort listings based on what matters most to you — all in one flexible tool.",
    },
    {
      icon: <Zap className="feature-icon" />,
      title: "Smart matching",
      description: "Real-time job search with smart matching feature",
    },
    {
      icon: <Map className="feature-icon" />,
      title: "Commute calculator",
      description:
        "See travel time and number of transfers from your home to workplace",
    },

    {
      icon: <Heart className="feature-icon" />,
      title: "Save to favorites",
      description: "Mark interesting job posts to easily view them later",
    },

    {
      icon: <Lock className="feature-icon" />,
      title: "Secure and modern architecture",
      description:
        "Meets modern security standards, secure authentication, and protection against malicious scripts.",
    },

    {
      icon: <User className="feature-icon" />,
      title: "User-friendly interface",
      description: "Intuitive design makes job discovery fast and efficient",
    },
  ];

  return (
    <div className="about-page content-container">
      <main className="about-main">
        <h1 className="about-title">About the project</h1>

        {/* Project Overview */}
        <div className="project-overview">
          <div className="overview-item">
            <div className="overview-text">
              <h3>What We Do</h3>
              <p>
                We help you find ideal positions with advanced filtering
                capabilities that go beyond traditional job boards. Our platform
                offers a comprehensive search experience tailored to your needs.
              </p>
            </div>
          </div>

          <div className="overview-item">
            <div className="overview-text">
              <h3>Our mission</h3>
              <p>
                Connect talented professionals with opportunities that match
                their skills, preferences, and career goals.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <h2>Key Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="icon-wrapper">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <h2 className="contributors-title">Contributors</h2>

        <div className="contributor-grid-flex">
          {contributors.map((contributor, index) => (
            <div key={index} className="contributor-card">
              <div className="contributor-content">
                <div className="contributor-heading">
                  <img
                    src={contributor.avatar}
                    alt={`${contributor.name}'s avatar`}
                    className="contributor-avatar"
                  />
                  <div className="name-and-role">
                    <h3 className="contributor-name">{contributor.name}</h3>
                    <p className="contributor-role">{contributor.role}</p>
                  </div>
                </div>

                <p className="contributor-description">
                  {contributor.description}
                </p>
              </div>

              <div className="contributor-links">
                <a
                  href={contributor.gitHub}
                  className="link-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>GitHub</span>
                </a>
                <a
                  href={contributor.linkedin}
                  className="link-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-section">
          <h2 className="contact-title">Get in touch?</h2>
          <p className="contact-text-primary">
            Have questions or feedback? We would love to hear from you.
          </p>

          <p className="contact-text-secondary">
            Drop us a line at{" "}
            <a
              href="mailto:jobcompass2025@gmail.com?subject=Question about JobCompass"
              className="email-link"
            >
              jobcompass2025@gmail.com
            </a>{" "}
            and we will get back to you as soon as possible!
          </p>
        </div>
      </main>
    </div>
  );
}
