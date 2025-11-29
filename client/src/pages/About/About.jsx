import "./About.css";

import { images } from "../../assets";
import { Filter, Map, Star, User, Heart, Zap } from "lucide-react";

export default function About() {
  const contributors = [
    {
      name: "Yaroslav",
      role: "HYF trainee",
      avatar: images.yaroslavAvatar,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
      gitHub: "https://github.com/YaroslavKazeev",
      linkedin: "https://www.linkedin.com/in/yaroslavkazeev/",
    },
    {
      name: "Hanna",
      role: "HYF trainee",
      avatar: images.hannaAvatar,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
      gitHub: "https://github.com/HannaInIT",
      linkedin: "https://www.linkedin.com/in/hanna-dubyna/",
    },

    {
      name: "Yahya",
      role: "HYF trainee",
      avatar: images.yahyaAvatar,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
      gitHub: "https://github.com/YahyaAl-Ademi",
      linkedin: "https://www.linkedin.com/in/yahya-al-ademi-12786555/",
    },
    {
      name: "Stas",
      role: "DevOps",
      avatar: images.stasAvatar,
      description:
        "He is the only person responsible for ensuring our deployments run smoothly.",
      gitHub: "https://github.com/stasel",
      linkedin: "https://www.linkedin.com/in/stasel/",
    },

    {
      name: "Jana Gombitová",
      role: "Product Owner",
      avatar: images.janaAvatar,
      description:
        "She is the only person who understands users’ needs better than anyone, and also serves as our Scrum Master — ensuring the team stays aligned, supported, and functioning effectively.",
      gitHub: "https://github.com/janagombitova",
      linkedin:
        "https://www.linkedin.com/in/jana-gombitova-42b08394?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    },

    {
      name: "Tim Lorent",
      role: "Tech lead",
      avatar: images.timAvatar,
      description:
        "He is the only person you can turn to whenever you need guidance or get stuck.",
      gitHub: "https://github.com/tlorent",
      linkedin: "https://www.linkedin.com/in/timlorent/",
    },
  ];

  const features = [
    {
      icon: <Filter size={28} />,
      title: "Advanced filtering",
      description:
        "Filter by job type, work mode, and experience level to find your perfect match",
    },
    {
      icon: <Zap size={28} />,
      title: "Smart matching",
      description: "Real-time job search with smart matching feature",
    },
    {
      icon: <Map size={28} />,
      title: "Commute calculator",
      description:
        "See travel time and number of transfers from your home to workplace",
    },
    {
      icon: <Star size={28} />,
      title: "Custom sorting",
      description:
        "Rank vacancies based on your personal priorities and preferences",
    },

    {
      icon: <Heart size={28} />,
      title: "Save to favorites",
      description: "Mark interesting job posts to easily view them later",
    },
    {
      icon: <User size={28} />,
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
                <a href={contributor.gitHub} className="link-button">
                  <span>GitHub</span>
                </a>
                <a href={contributor.linkedin} className="link-button">
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-section">
          <h2 className="contact-title">Get in touch?</h2>
          <p className="contact-text">
            Have questions or feedback? We would love to hear from you.
          </p>

          <button className="contact-button">Contact us</button>
        </div>
      </main>
    </div>
  );
}
