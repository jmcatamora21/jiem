"use client";
import { useState, useEffect, useRef, forwardRef } from "react";
import projects from "./projects.json";
import icons from "./tech_icons.json";
import ReactDOM from "react-dom";
import { motion, useAnimation } from "motion/react";
import { useInView } from "react-intersection-observer";
import 'react-loading-skeleton/dist/skeleton.css';
import Slider from "react-slick";
import { supabase } from "./lib/supabase";
import { getAnonId } from "./lib/anon";

const sections = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "tech-stack", label: "Tech Stack" },
  { id: "contact", label: "Contact" },
];

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

    media.addEventListener("change", listener); 
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

interface AppProps {
  activeIndex: number,
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  loaded: boolean,
}

function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null);

    useEffect(() => {
      let lastScrollY = window.scrollY;

      const updateScrollDirection = () => {
        const currentScrollY = window.scrollY;
        const direction = currentScrollY > lastScrollY ? "down" : "up";

        if (direction !== scrollDirection && Math.abs(currentScrollY - lastScrollY) > 10) {
          setScrollDirection(direction);
        }

        lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
      };

      window.addEventListener("scroll", updateScrollDirection);

      return () => {
        window.removeEventListener("scroll", updateScrollDirection);
      };
    }, [scrollDirection]);

    return scrollDirection;
  }

function Header({ activeIndex, setActiveIndex, loaded }: AppProps) {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", inline: "start", block: "end"});
  };

  const scrollDirection = useScrollDirection();
  

  useEffect(() => {
    if (scrollDirection === "down") {
      //down
    }
    else if (scrollDirection === "up") {
    
    }
  }, [scrollDirection]);

  return (
  <>
  
      {isSmallScreen ? (
        <div className="mobile-menu-wrapper">
          <div className="close-menu" onClick={() => {document.querySelector(".mobile-menu-wrapper")?.classList.remove("active");document.querySelector(".mobile-menu-wrapper")?.classList.add("inactive")}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24" fill="none"><path d="m13 16 4-4-4-4M7 16l4-4-4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <ul className="ms">
            {sections.map((section, index) => (
              <li 
              key={index} 
              className={index === activeIndex ? 'active' : ''}
              onClick={() => {
                setActiveIndex(index);
                scrollTo(section.id);
              }}
              >{section.label}</li>
            ))}
            <li>
              <a href="/catamora cv.pdf" download={true}>
              <button className="cv-d-btn active-btn ms fs-13 mt-5"><img src="/download_icon2.svg"/> Download CV</button></a>
            </li>
          </ul>
        </div>
      ) : null}
  <div className={scrollDirection === "down" ? 'header hide' : 'header'} style={{  transform: scrollDirection === "up" ? "translateY(-100%)" : "translateY(0%)"}}>
    <div className="header-left">
      <h1 style={{ fontFamily: "var(--font-imperial)" }}>Jiem</h1>
      <ul className="ls">
        {sections.map((section, index) => (
          <li 
          key={index} 
          className={index === activeIndex ? 'active fs-13' : 'fs-13'}
          onClick={() => {
            setActiveIndex(index);
            scrollTo(section.id)
          }}
          >{section.label}</li>
        ))}
      </ul>
    </div>
    <div className="ms open-side-bar mobile-open-menu" onClick={() => {document.querySelector(".mobile-menu-wrapper")?.classList.add("active");document.querySelector(".mobile-menu-wrapper")?.classList.remove("inactive")}}>
      <img src="/bars_icon.svg"/>
    </div>
    <div className="header-right ls">
      <a href="/catamora cv.pdf" download={true}><button className="cv-d-btn active-btn"><img src="/download_icon2.svg"/> Download CV</button></a>
    </div>
  </div>
  </>
 )
}




function Intro({ activeIndex, setActiveIndex, loaded }: AppProps) {
  const [homeRef, homeInView] = useInView({ threshold: .8 });

  useEffect(() => {
    if (homeInView) {
      setActiveIndex(0);
    }
  })

  return (
    <div className="hero-wrapper" id="home" ref={homeRef}>
      <div className={loaded ? 'img-container' : ''}>
        <div className="bg-circle ms"></div>
        <img src="/cartoonme.png" alt=""/>
      </div>
      <div className="hero-texts-wrapper">
        <div className={loaded ? 'hero-upper-text' : ''}>
          <h1 className="">Hi there!</h1>
          <h2 className="">&nbsp;&nbsp;I'm John,</h2>
        </div>
        <div className={loaded ? 'hero-lower-text ac hero-fs ls' : ''}>
          <p>a Software Developer who builds fast, </p>
          <p>&nbsp; reliable, and user-friendly web apps</p>
        </div>
        <div className={loaded ? 'hero-lower-text hero-fs ms' : ''}>
          <h3 style={{fontWeight:"200"}}>a Software Developer</h3>
        </div>
        <div>
          <a href="/resume.pdf" download={true}><button className="cv-d-btn active-btn ms fs-13 mt-5"><img src="/download_icon2.svg"/>Download CV</button></a>
        </div>
        <div className={loaded ? 'hero-lower-text-2 hero-fs ls' : ''}>
          <p>I create custom web applications, automation tools,</p>
          <p>&nbsp;and interfaces, that make technology work for you</p>
          <p>&nbsp;not against you</p>
        </div>
        <button onClick={() => {document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", inline: "start", block: "end"});}} className={loaded ? 'view-projects-btn active-btn mt-15 ls' : ''}><img src="/folders_icon.svg"/> View Projects</button>
      </div>
    </div>
  )
}

function Projects({ activeIndex, setActiveIndex, loaded }: AppProps) {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const isLargeScreen = useMediaQuery("(min-width: 769px)");
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [projectsRef, projectsInView] = useInView({ threshold: .5});

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (projectsInView) {
      setActiveIndex(1);
    }
    if (inView) {
      if (!hasAnimated && loaded) {
        controls.set({opacity:0, y: isLargeScreen ? 20 : 0})
        controls.start({ opacity: 1, y: 0 });
        setHasAnimated(true);
      }
    };
  }, [inView, controls, projectsInView]);

  type Group = {
    group: string,
    list: string[]
  }

  const [group, setGroup] = useState<object[]>([]);
  const [currentGroup, setCurrentGroup] = useState("tools");
  const [currentGroupObject, setCurrentGroupObject] = useState<Group | null>(null);
  const menuList = ['Browser Tools', 'Mobile Apps', 'UI/UX Designs', 'Websites'];
  const menuListKeys = ['tools', 'm_apps', 'ui_ux', 'web'];
  const [activeIndex2, setActiveIndex2] = useState(0);
  const [innerMenuActiveIndex, setInnerMenuActiveIndex] = useState(0);
  useEffect(() => {
    const uniqueSections: string[] = [];
    const uniqueGroup: Group[] = [];
    projects.forEach((project) => {
      let sections = project.sections;
      if (!uniqueGroup.some(g => g.group === project.group)) {
        uniqueGroup.push({group: project.group, list: []});
      }
      sections.forEach(function(section){
        if (!uniqueSections.includes(section)) {
          uniqueSections.push(section);
        }
        let group = uniqueGroup.find(g => g.group === project.group);
        if (!group?.list.includes(section)) {
          group?.list.push(section);
          group?.list.sort((a, b) => {
            if (a === "All") return -1;
            if (b === "All") return 1;
            return a.localeCompare(b);
          });
        }
      });
    });
    setGroup(uniqueGroup);

    let curGroup = uniqueGroup.find(g => g.group === currentGroup) || null;
    setCurrentGroupObject(curGroup);
  
  }, []);

  const handleMenu = (e: React.MouseEvent<HTMLLIElement>) => {
    const idx = Number((e.currentTarget as HTMLElement).dataset.idx);
    const id = (e.currentTarget as HTMLElement).dataset.id as string;
    setActiveIndex2(idx);
    setCurrentGroup(id);

    const curGroup = (group as Group[]).find(g => g.group === id) || null;
    setCurrentGroupObject(curGroup);

    setInnerMenuActiveIndex(0);
    setCurrentSection("All");
  }

  const [gridview, setGridview] = useState(true);
  const [currentSection, setCurrentSection] = useState("All");

  const handleInnerMenu = (e: React.MouseEvent<HTMLLIElement>) => {
    const idx = Number((e.currentTarget as HTMLElement).dataset.idx);
    const section = (e.currentTarget as HTMLElement).dataset.section as string;
    setInnerMenuActiveIndex(idx);
    setCurrentSection(section);
  }

  const [isOpen, setIsOpen] = useState(false);
  const [currentId, setCurrentId] = useState(0);

  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  type Project = {
    "id": number,
    "name": string,
    "path": string,
    "group": string,
    "description": string,
    "sections" : string[],
    "images" : string[],
    "hasLiveDemo":boolean,
    "hasGithubRepo": boolean,
    "repoUrl" : string,
    "liveUrl":string,
    "dateCreated":string,
    "isClientProject": boolean,
    "client_feedback": string
  }

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  function Modal({ isOpen, onClose, children }: { 
    isOpen: boolean; 
    onClose: () => void; 
    children: React.ReactNode 
  }) {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
      <div className="modal" onClick={onClose}>
        <div 
          className="modal-content" 
          onClick={(e) => e.stopPropagation()} 
        >
          <div className="close-modal" style={{display:"flex",justifyContent:"end"}}>
            <div onClick={onClose} style={{cursor:"pointer"}}>
              <svg width="clamp(0.9375rem, 0.75rem + 1vw, 1.875rem)" height="clamp(0.9375rem, 0.75rem + 1vw, 1.875rem)" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.2998 38.376L38.6998 5.97601" stroke="#FABC52" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.2998 5.97601L38.6998 38.376" stroke="#FABC52" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h2 className="fs-13 text-center" style={{fontWeight:"400"}}>{selectedProject?.name}</h2>
          <h4 className="fs-10 text-center" style={{fontWeight:"200"}}>{selectedProject?.dateCreated}</h4>
          <br></br>
          
          {children}
          
        </div>
      </div>,
      document.body 
    );
  }

  useEffect(() => {
    if (isOpen) {
      let p = projects.find(project => project.id === currentId) || null;
      setSelectedProject(p);

      const scrollBarWidth = getScrollbarWidth();
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`; // prevent layout shift
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      document.body.style.overflowY = "auto";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);


  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };


  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {setIsOpen(false)}}>

        <div className="modalImageWrapper">
          <Slider className="" {...settings}>
            {selectedProject?.images.map((src, i) => (
             
                <img key={i} src={src}  />
         
             
            
            ))}


            {/* {
            selectedProject?.hasLiveDemo ? (
            <div className="fs-9 live-demo-btn" style={{color:"#000",cursor:"pointer"}}>Live Demo</div> 
            ) : null
            } */}
          </Slider>
          {selectedProject?.hasGithubRepo ? 
          <div className="fs-9 btn" onClick={() => window.open(selectedProject.repoUrl, "_blank")} style={{color:"#000",cursor:"pointer"}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" version="1.1">
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                      <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7559.000000)" fill="#000000">
                          <g id="icons" transform="translate(56.000000, 160.000000)">
                              <path d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399" id="github-[#142]">

                          </path>
                          </g>
                      </g>
                  </g>
              </svg>
          </div> 
          : false }
        </div>
        <br></br>
        <div className="project-descript-wrapper">
          <h2 className="fs-13" style={{color:"var(--orange)",fontWeight:400}}>Project Description</h2>
          <p className="fs-13" style={{fontWeight:100,marginTop:"5px"}}>{selectedProject?.description}</p>
          
             
          {selectedProject?.isClientProject ? 
          (
            <>
              <h2 className="fs-13" style={{color:"var(--orange)",fontWeight:400, marginTop:"10px"}}>Client Feedback</h2>
              <p className="fs-13" style={{fontWeight:100,marginTop:"5px",fontStyle:"italic"}}>"{selectedProject?.client_feedback}"</p>
            </>
          ):
          null}
        
        </div>
      </Modal>
      <div ref={ref}>
      <div className="projects-wrapper" id="projects" ref={projectsRef}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={controls}
          transition={{ duration: 0.6, ease: "easeOut" }}>
          <h4 className="fs-h4 lt">Projects</h4> 
        </motion.div>

        <div className="projects-container mb-20">
          <div className="projects-menu">
            <ul className="fs-13">
              {menuList.map((menu, index) => (
                <li key={index} className={activeIndex2 === index ? "active" : ''} data-idx={index} data-id={menuListKeys[index]} onClick={handleMenu}>{menu}</li>
              ))}
            </ul>
          </div>
          <div className="projects">
            <div className="projects-header ls">
              <div className="inner-menu">
                <ul className="fs-13">
                  {currentGroupObject?.list.map((section, index) =>  (
                    <li 
                    key={index} 
                    data-idx={index}
                    data-section={section}
                    className={index === innerMenuActiveIndex ? 'active' : ''} 
                    onClick={handleInnerMenu}>{section}</li>
                  ))}
                </ul>
              </div>
              <div className="projects-view">
                <div className={gridview ? '' : 'active'} onClick={() => setGridview(false)}>
                  <svg width="25" height="25" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.375 25.625V16.875H25.625V25.625H4.375Z" stroke="currentColor" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.375 13.125V4.375H25.625V13.125H4.375Z" stroke="currentColor" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={gridview ? 'active' : ''} onClick={() => setGridview(true)}>
                  <svg width="25" height="25" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.375 4.375H13.125V13.125H4.375V4.375Z" stroke="currentColor" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.375 16.875H13.125V25.625H4.375V16.875Z" stroke="currentColor" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.875 4.375H25.625V13.125H16.875V4.375Z" stroke="currentColor" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.875 16.875H25.625V25.625H16.875V16.875Z" stroke="currentColor" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="grid-wrapper">
              <div className={gridview ? 'projects-list grid' : 'projects-list'}>
                {projects.map((project, index) => (
                  currentGroup == project.group && project.sections.includes(currentSection) ? (
                  gridview ? (
                  <div key={index} className="grid" onClick={() => {setIsOpen(true);setCurrentId(project.id);}}>
                    <img src={project.path}/>
                    <div className="project-details">
                      <div>
                        <span className="title">{project.name}</span><br></br>
                        <p className="desc ls">{project.description.length > 60 ? project.description.slice(0, 60) + "..." : project.description}</p>
                      </div>
                    </div>
                  </div> )
                  : 
                  <div key={index} className="list" onClick={() => {setIsOpen(true);setCurrentId(project.id);}}>
                    <img src={project.path}/>
                    <div>
                      <span className="title">{project.name}</span><br></br>
                      <p className="desc ls">{project.description.length > 100 ? project.description.slice(0, 100) + "..." : project.description}</p>
                    </div>
                  </div> )
                  : null
                ))}
              </div>
            </div>
            
          </div>
        </div>

      </div>
      </div>
    </>
  )
}

function Services({ activeIndex, setActiveIndex, loaded  }: AppProps) {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const isLargeScreen = useMediaQuery("(min-width: 769px)");
  const controls = useAnimation();

  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [servicesRef, servicesInView] = useInView({ threshold: isLargeScreen ? .5 : .3 });

  const [hasAnimated, setHasAnimated] = useState(false);
  useEffect(() => {
    if (servicesInView) {
      setActiveIndex(2);
    }
    if (inView) {
      if (!hasAnimated && loaded) {
        controls.set({opacity: 0, y: isLargeScreen ? 20 : 0})
        controls.start({ opacity: 1, y: 0 });
        setHasAnimated(true);
      }
    };
  }, [inView, controls, servicesInView]);
  
  return (
    <>
      <div  ref={ref}>
      <div className="services-wrapper" id="services" ref={servicesRef}>

        <motion.div
         
          initial={{opacity:0}}
          animate={controls}
          transition={{ duration: 0.6, ease: "easeOut" }}>
          <h4 className="fs-h4 lt">Services</h4> 
        </motion.div>
 
        <div className="services-1 services">
          {isLargeScreen ? (
            <motion.div
            initial={{ opacity: 0, x: -50 }}           
            whileInView={{ opacity: 1, x: 0 }}        
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            >
            <div>
              <h4 className="title fs-13 mb-5" style={{fontWeight:"300"}}>Custom Web Applications & Websites</h4>
              <p className="fs-13 mb-5" style={{fontWeight:"100"}}>I build fast, modern, and responsive websites and web applications that showcase brands, products, and services while solving real business problems. From dashboards and SaaS platforms to API-driven apps, I bring ideas to life with clean and reliable code.</p>
              <span className="fs-13" style={{fontWeight:"100"}}>What I deliver:</span>
              <ul className="fs-13" style={{fontWeight:"100"}}>
                <li>Full-stack development (frontend + backend)</li>
                <li>API integrations</li>
                <li>Responsive and optimized performance</li>
              </ul>
            </div>
          </motion.div>
          ) :null}
          {!isLargeScreen ? (
            <motion.div
            initial={{ opacity: 0, y: 50 }}           
            whileInView={{ opacity: 1, y: 0 }}        
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.1 }}
            >
            <div>
              <h4 className="title fs-13 mb-5" style={{fontWeight:"300"}}>Custom Web Applications & Websites</h4>
              <p className="fs-13 mb-5" style={{fontWeight:"100"}}>I build fast, modern, and responsive websites and web applications that showcase brands, products, and services while solving real business problems. From dashboards and SaaS platforms to API-driven apps, I bring ideas to life with clean and reliable code.</p>
              <span className="fs-13" style={{fontWeight:"100"}}>What I deliver:</span>
              <ul className="fs-13" style={{fontWeight:"100"}}>
                <li>Full-stack development (frontend + backend)</li>
                <li>API integrations</li>
                <li>Responsive and optimized performance</li>
              </ul>
            </div>
          </motion.div>
          ) :null}
          {isLargeScreen ? (
             <motion.div
            initial={{ opacity: 0, x: 50 }}           
            whileInView={{ opacity: 1, x: 0 }}        
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            >
            <div className="services-image-container">
              <img src="./services_1.png"/>
            </div>
            </motion.div>
           
          ):null}
          {!isLargeScreen ? (
             <motion.div
            initial={{ opacity: 0, y: 50 }}           
            whileInView={{ opacity: 1, y: 0 }}        
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.1 }}
            >
            <div className="services-image-container">
              <img src="./services_1.png"/>
            </div>
            </motion.div>
           
          ):null}
          
        </div>
        <div className="services-2 services">
          {isLargeScreen ? (
            <motion.div
            initial={{ opacity: 0, x: -50 }}           
            whileInView={{ opacity: 1, x: 0 }}        
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            >
            <div className="services-image-container">
              <img src="./services_2.png"/>
            </div>
            </motion.div>
          ):null}
          {!isLargeScreen ? (
            <motion.div
            initial={{ opacity: 0, y: 50 }}           
            whileInView={{ opacity: 1, y: 0 }}        
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.1 }}
            >
            <div className="services-image-container">
              <img src="./services_2.png"/>
            </div>
            </motion.div>
          ):null}

          {isLargeScreen ? (
            <motion.div
            initial={{ opacity: 0, x: 50 }}           
            whileInView={{ opacity: 1, x: 0 }}        
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            >
                <div>
            <h4 className="title fs-13 mb-5" style={{fontWeight:"300"}}>Automation Tools & Browser Extensions</h4>
            <p className="fs-13 mb-5" style={{fontWeight:"100"}}>Save time and reduce repetitive work with custom automation solutions. I build browser extensions, scripts, and workflow tools that streamline processes and improve productivity.</p>
            <span className="fs-13" style={{fontWeight:"100"}}>What I deliver:</span>
            <ul className="fs-13" style={{fontWeight:"100"}}>
              <li>Chrome & browser extensions</li>
              <li>Business workflow automations</li>
              <li>API integrations for apps and services</li>
            </ul>
          </div>
            </motion.div> ) :null}

          {!isLargeScreen ? (
            <motion.div
            initial={{ opacity: 0, y: 50 }}           
            whileInView={{ opacity: 1, y: 0 }}        
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.1 }}
            >
                <div>
            <h4 className="title fs-13 mb-5" style={{fontWeight:"300"}}>Automation Tools & Browser Extensions</h4>
            <p className="fs-13 mb-5" style={{fontWeight:"100"}}>Save time and reduce repetitive work with custom automation solutions. I build browser extensions, scripts, and workflow tools that streamline processes and improve productivity.</p>
            <span className="fs-13" style={{fontWeight:"100"}}>What I deliver:</span>
            <ul className="fs-13" style={{fontWeight:"100"}}>
              <li>Chrome & browser extensions</li>
              <li>Business workflow automations</li>
              <li>API integrations for apps and services</li>
            </ul>
          </div>
            </motion.div> ) :null}
        
        </div>
        <div className="services-3 services">
          {isLargeScreen ? (
            <motion.div
            initial={{ opacity: 0, x: -50 }}           
            whileInView={{ opacity: 1, x: 0 }}        
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            >
              <div>
                <h4 className="title fs-13 mb-5" style={{fontWeight:"300"}}>UI/UX Implementation & Design</h4>
                <p className="fs-13 mb-5" style={{fontWeight:"100"}}>I create clean, simple, and user-friendly designs that make digital products easy and enjoyable to use. Whether it’s an app, a website, or a new feature, I focus on making the experience smooth, intuitive, and visually appealing.</p>
                <span className="fs-13" style={{fontWeight:"100"}}>What I can help with:</span>
                <ul className="fs-13" style={{fontWeight:"100"}}>
                  <li>Designing web and mobile app interfaces</li>
                  <li>Wireframes and interactive prototypes (Figma, Adobe)</li>
                  <li>Digital product design with a focus on real user needs</li>
                </ul>
              </div>
            </motion.div> ) :null}

            {!isLargeScreen ? (
            <motion.div
            initial={{ opacity: 0, y: 50 }}           
            whileInView={{ opacity: 1, y: 0 }}        
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.1 }}
            >
              <div>
                <h4 className="title fs-13 mb-5" style={{fontWeight:"300"}}>UI/UX Implementation & Design</h4>
                <p className="fs-13 mb-5" style={{fontWeight:"100"}}>I create clean, simple, and user-friendly designs that make digital products easy and enjoyable to use. Whether it’s an app, a website, or a new feature, I focus on making the experience smooth, intuitive, and visually appealing.</p>
                <span className="fs-13" style={{fontWeight:"100"}}>What I can help with:</span>
                <ul className="fs-13" style={{fontWeight:"100"}}>
                  <li>Designing web and mobile app interfaces</li>
                  <li>Wireframes and interactive prototypes (Figma, Adobe)</li>
                  <li>Digital product design with a focus on real user needs</li>
                </ul>
              </div>
            </motion.div> ) :null}
         
         {isLargeScreen ? (
            <motion.div
            initial={{ opacity: 0, x: 50 }}           
            whileInView={{ opacity: 1, x: 0 }}        
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            ><div className="services-image-container">
            <img src="./services_3.png"/>
          </div></motion.div> ):null }
          {!isLargeScreen ? (
            <motion.div
            initial={{ opacity: 0, y: 50 }}           
            whileInView={{ opacity: 1, y: 0 }}        
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.1 }}
            ><div className="services-image-container">
            <img src="./services_3.png"/>
          </div></motion.div> ):null }
        </div>
      </div>
      </div>
    </>
  )
}

function TechStack({ activeIndex, setActiveIndex, loaded  }: AppProps) {

  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const isLargeScreen = useMediaQuery("(min-width: 769px)");
 
  const icons_controls = useAnimation();
  const icons_controls2 = useAnimation();
  const icons_controls3 = useAnimation();
  const icons_controls4 = useAnimation();
  const icons_controls5 = useAnimation();
  const icons_controls6 = useAnimation();
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [techstackRef, techstackInView] = useInView({ threshold: .7 });

  useEffect(() => {
    if (techstackInView) {
      setActiveIndex(3);
    }
  })

  useEffect(() => {
    if (inView && loaded) {
      controls.set({opacity: 0, y: isLargeScreen ? 20 : 0})
      controls.start({ opacity: 1, y: 0 });

      const randomPositions = icons[0].icons_list.map(() => ({
        x: Math.random() * 200,
        y: Math.random() * 200 - 100,
      }));
      const randomPositions2 = icons[1].icons_list.map(() => ({
        x: Math.random() * 200,
        y: Math.random() * 200 - 100,
      }));
      const randomPositions3 = icons[2].icons_list.map(() => ({
        x: Math.random() * 200,
        y: Math.random() * 200 - 100,
      }));
      const randomPositions4 = icons[3].icons_list.map(() => ({
        x: Math.random() * 200,
        y: Math.random() * 200 - 100,
      }));
      const randomPositions5 = icons[4].icons_list.map(() => ({
        x: Math.random() * 200,
        y: Math.random() * 200 - 100,
      }));
      const randomPositions6 = icons[5].icons_list.map(() => ({
        x: Math.random() * 200,
        y: Math.random() * 200 - 100,
      }));

     

      icons_controls.set((i) => ({
        opacity: 0,
        x: randomPositions[i].x,
        y: randomPositions[i].y,
      }));
      icons_controls.start((i) => ({
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut", delay: i * 0.15 },
      }));

      icons_controls2.set((i) => ({
        opacity: 0,
        x: randomPositions2[i].x,
        y: randomPositions2[i].y,
      }));
      icons_controls2.start((i) => ({
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut", delay: i * 0.15 + .3 },
      }));

      icons_controls3.set((i) => ({
        opacity: 0,
        x: randomPositions3[i].x,
        y: randomPositions3[i].y,
      }));
      icons_controls3.start((i) => ({
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut", delay: i * 0.15 + .6 },
      }));

      icons_controls4.set((i) => ({
        opacity: 0,
        x: randomPositions4[i].x,
        y: randomPositions4[i].y,
      }));
      icons_controls4.start((i) => ({
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut", delay: i * 0.15 + .9 },
      }));

      icons_controls5.set((i) => ({
        opacity: 0,
        x: randomPositions5[i].x,
        y: randomPositions5[i].y,
      }));
      icons_controls5.start((i) => ({
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut", delay: i * 0.15 + 1.2 },
      }));

      icons_controls6.set((i) => ({
        opacity: 0,
        x: randomPositions6[i].x,
        y: randomPositions6[i].y,
      }));
      icons_controls6.start((i) => ({
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut", delay: i * 0.15 + 1.5 },
      }));
    }
  }, [inView, controls, icons_controls, icons_controls2, icons_controls3, icons_controls4, icons_controls5, icons_controls6, loaded]);
  
  return (
    <>
      <div className="tech-stack-wrapper" id="tech-stack" ref={techstackRef}>
        
        <motion.div
          ref={ref}
          initial={{ opacity: 0}}
          animate={controls}
          transition={{ duration: 0.6, ease: "easeOut" }}>
          <h4 className="fs-h4 lt">Tech Stack</h4> 
        </motion.div>
        
        <div className="tech-stack-container mt-20" style={{paddingLeft:"20px"}} ref={ref}>
          
          <div className="tech-stacks">
            <div>
              <motion.div
            
                initial={{ opacity: 0, y: 50 }}
                animate={controls}
                transition={{ duration: 0.6, ease: "easeOut" }}>
                <div>
                  <h4 className="title fs-13 mb-5t" style={{fontWeight:"300"}}>Front-end</h4>
                  <ul className="fs-10" style={{fontWeight:"100"}}>
                    <li>HTML, CSS, JavaScript (ES6+)</li>
                    <li>React, Next.js, Tailwind CSS</li>
                  </ul>
                </div>
              </motion.div>
              

              <div ref={ref} className="icons">
                {icons[0].icons_list.map((icon, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    animate={icons_controls}
                    initial={{opacity: 0}}
                    >
                    <img key={index} src={icon.path} alt={icon.name} />
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <motion.div
         
                initial={{ opacity: 0, y: 50 }}
                animate={controls}
                transition={{ duration: 0.6, ease: "easeOut", delay: .3 }}>
                  <div>
                    <h4 className="title fs-13 mb-5" style={{fontWeight:"300"}}>Back-end</h4>
                    <ul className="fs-10" style={{fontWeight:"100"}}>
                      <li>Node.js, Express.js, Python</li>
                      <li>REST APIs</li>
                    </ul>
                  </div>
              </motion.div>
              
              <div ref={ref} className="icons">
                {icons[1].icons_list.map((icon, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    animate={icons_controls2}
                    initial={{opacity: 0}}
                    >
                    <img key={index} src={icon.path} alt={icon.name} />
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <motion.div
      
                initial={{ opacity: 0, y: 50 }}
                animate={controls}
                transition={{ duration: 0.6, ease: "easeOut", delay: .6 }}>
                  <div>
                    <h4 className="title fs-13 mb-5" style={{fontWeight:"300"}}>Databases</h4>
                    <ul className="fs-10" style={{fontWeight:"100"}}>
                      <li>MongoDB, PostgreSQL, MySQL</li>
                    </ul>
                  </div>
              </motion.div>
              
              <div ref={ref} className="icons">
                {icons[2].icons_list.map((icon, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    animate={icons_controls3}
                    initial={{opacity: 0}}
                    >
                    <img key={index} src={icon.path} alt={icon.name} />
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <motion.div
            
                initial={{ opacity: 0, y: 50 }}
                animate={controls}
                transition={{ duration: 0.6, ease: "easeOut", delay: .9 }}>
                  <div>
                    <h4 className="title fs-13 mb-5" style={{fontWeight:"300"}}>Mobile Development</h4>
                    <ul className="fs-10" style={{fontWeight:"100"}}>
                      <li>JAVA, React Native, Flutter</li>
                    </ul>
                  </div>
              </motion.div>
              
              <div ref={ref} className="icons">
                {icons[3].icons_list.map((icon, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    animate={icons_controls4}
                    initial={{opacity: 0}}
                    >
                    <img key={index} src={icon.path} alt={icon.name} />
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <motion.div
           
                initial={{ opacity: 0, y: 50 }}
                animate={controls}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}>
                  <div>
                    <h4 className="title fs-13 mb-5" style={{fontWeight:"300"}}>UI/UX Design</h4>
                    <ul className="fs-10" style={{fontWeight:"100"}}>
                      <li>Figma, Adobe</li>
                    </ul>
                  </div>
              </motion.div>
              
              <div ref={ref} className="icons">
                {icons[4].icons_list.map((icon, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    animate={icons_controls5}
                    initial={{opacity: 0}}
                    >
                    <img key={index} src={icon.path} alt={icon.name} />
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <motion.div
         
                initial={{ opacity: 0, y: 50 }}
                animate={controls}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.5 }}>
                  <div>
                    <h4 className="title fs-13 mb-5" style={{fontWeight:"300"}}>Tools & DevOps</h4>
                    <ul className="fs-10" style={{fontWeight:"100"}}>
                      <li>Git & Github</li>
                      <li>Docker</li>
                    </ul>
                  </div>
              </motion.div>
              
              <div ref={ref} className="icons">
                {icons[5].icons_list.map((icon, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    animate={icons_controls6}
                    initial={{opacity: 0}}
                    >
                    <img key={index} src={icon.path} alt={icon.name} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
     
        </div>
      </div>
    </>
  )
}

function Contact({ activeIndex, setActiveIndex, loaded }: AppProps) {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const isLargeScreen = useMediaQuery("(min-width: 769px)");
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const controls = useAnimation();
  const [user_name, set_user_name] = useState("");
  const [user_message, set_message] = useState("");
  const [messageStatus, setMessageStatus] = useState(0);
  const statusLabels = ['Submit', 'Sending..', 'Sent'];
  const [isSending, setIsSending] = useState(false);
  const isEmpty = true;
  const [btnClicked, setBtnClicked] = useState(false);
  const [anonId, setAnonId] = useState("");
  const [link, setLink] = useState("");

  const [contactRef, contactInView] = useInView({ threshold: .8 });

  useEffect(() => {
    
    if (contactInView) {
      setActiveIndex(4);
    }
  })

  

  useEffect(() => {
    setAnonId(getAnonId());

    if (inView) {
      controls.set({opacity: 0, y: isLargeScreen ? 20 : 0})
      controls.start({ opacity: 1, y: 0 });
    }
  }, [inView, controls]);

  async function sendMessage(name: string, message: string) {
    if (name.length > 0 && message.length > 0) {
      const generateUrl = await fetch('/api/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anon_id: getAnonId(), name: user_name })
      })
      const data1 = await generateUrl.json()
   
      if (data1.data.is_success) {
        setLink(data1.data.url);
        const send_message = await fetch('/api/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, message, anon_id : anonId, token:  data1.data.token })
        })
        const data2 = await send_message.json();
        if (data2.data.is_success) {
          setMessageStatus(2);
          setTimeout(async () => {
            setMessageStatus(0);
            set_message("");
            setIsSending(false);
          }, 1000);

          const createConvo = await fetch('/api/convo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender_name: name, message, anon_id : anonId, token:  data1.data.token, is_admin: false })
          })

          const data3 = await createConvo.json();
          if (data3.data.is_success) {
            console.log("Convo:", data3.data.message)
          }
        } 
      } else {
        
      }
    }
  }

  return (
    <div className="contact-wrapper" id="contact" ref={contactRef}>
     
      <motion.div
        ref={ref}
        initial={{opacity:0}}
        animate={controls}
        transition={{ duration: 0.6, ease: "easeOut" }}>
        <h4 className="fs-h4 lt">Contact</h4> 
      </motion.div>

      <div className="contact-container">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}           
            whileInView={{ opacity: 1, y: 0 }}        
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.1 }}
            >
              <div>
            <h4 className="fs-13" style={{fontWeight:"300"}}>Let's connect!</h4>
            <div className="contact-icons">
              <div className="icons">
                <svg width="clamp(1.0625rem, 0.9625rem + 0.5333vw, 1.5625rem)" height="clamp(1.0625rem, 0.9625rem + 0.5333vw, 1.5625rem)" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7083 5.00008C12.5223 5.15889 13.2703 5.55697 13.8568 6.14337C14.4432 6.72976 14.8413 7.4778 15 8.29175M11.7083 1.66675C13.3994 1.85461 14.9763 2.61189 16.1803 3.81426C17.3841 5.01661 18.1434 6.59259 18.3333 8.28341M15.4167 17.5001C8.28299 17.5001 2.5 11.7171 2.5 4.58341C2.5 4.26156 2.51177 3.94246 2.53491 3.62652C2.56146 3.26393 2.57473 3.08264 2.66975 2.91761C2.74845 2.78092 2.88792 2.6513 3.02998 2.58279C3.20151 2.50008 3.40157 2.50008 3.80167 2.50008H6.14943C6.4859 2.50008 6.65413 2.50008 6.79835 2.55546C6.92574 2.60437 7.03918 2.68382 7.12868 2.78683C7.23001 2.90344 7.2875 3.06155 7.40249 3.37776L8.37425 6.05012C8.508 6.41802 8.57492 6.60197 8.56358 6.7765C8.55358 6.93039 8.501 7.07848 8.41183 7.2043C8.31072 7.34698 8.14288 7.44769 7.80719 7.6491L6.66667 8.33342C7.66825 10.5408 9.45842 12.3333 11.6667 13.3334L12.351 12.1929C12.5524 11.8572 12.6531 11.6893 12.7958 11.5882C12.9216 11.4991 13.0697 11.4465 13.2236 11.4365C13.3981 11.4252 13.5821 11.4921 13.95 11.6258L16.6223 12.5976C16.9385 12.7126 17.0967 12.7701 17.2132 12.8714C17.3162 12.9609 17.3958 13.0743 17.4446 13.2017C17.5 13.3459 17.5 13.5142 17.5 13.8507V16.1984C17.5 16.5985 17.5 16.7986 17.4173 16.9701C17.3488 17.1122 17.2192 17.2517 17.0825 17.3303C16.9174 17.4253 16.7362 17.4386 16.3736 17.4652C16.0576 17.4883 15.7385 17.5001 15.4167 17.5001Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="icons">
                <svg width="clamp(1.25rem, 1.125rem + 0.6667vw, 1.875rem)" height="clamp(1.25rem, 1.125rem + 0.6667vw, 1.875rem)" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M3.125 4.375L2.5 5V15L3.125 15.625H16.875L17.5 15V5L16.875 4.375H3.125ZM3.75 6.41292V14.375H16.25V6.41271L9.99992 12.0947L3.75 6.41292ZM15.2583 5.625H4.74155L9.99992 10.4053L15.2583 5.625Z" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
          </motion.div>
          

          <motion.div
            initial={{ opacity: 0, y: 50 }}           
            whileInView={{ opacity: 1, y: 0 }}        
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.1 }}
            >

              <div>
            <h4 className="fs-13" style={{fontWeight:"300"}}>Socials</h4>
            <div className="contact-icons">
              <div className="icons">
                <svg width="clamp(1.25rem, 1.0625rem + 1vw, 2.1875rem)" height="clamp(1.25rem, 1.0625rem + 1vw, 2.1875rem)" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 15.0626C24.9766 13.1569 24.4091 11.2977 23.3643 9.70376C22.3196 8.10984 20.8412 6.84762 19.1032 6.06579C17.3651 5.28395 15.4398 5.01505 13.5541 5.29074C11.6684 5.56644 9.90068 6.37524 8.45922 7.62192C7.01775 8.8686 5.96253 10.5012 5.41785 12.3275C4.87317 14.1538 4.8617 16.0977 5.3848 17.9303C5.9079 19.7629 6.94377 21.4078 8.37043 22.6714C9.79708 23.9351 11.5551 24.7647 13.4375 25.0626V17.9751H10.9375V15.0626H13.4375V12.8501C13.3796 12.3356 13.4353 11.8148 13.6008 11.3242C13.7663 10.8337 14.0375 10.3854 14.3951 10.0111C14.7527 9.63677 15.1881 9.34551 15.6706 9.15787C16.1531 8.97022 16.671 8.89076 17.1875 8.92511C17.9372 8.93537 18.6852 9.00224 19.425 9.12511V11.6251H18.175C17.9595 11.5979 17.7405 11.6195 17.5345 11.6883C17.3283 11.7571 17.1403 11.8713 16.9843 12.0225C16.8283 12.1737 16.7083 12.358 16.6332 12.5618C16.558 12.7657 16.5296 12.9838 16.55 13.2001V15.0876H19.325L18.875 18.0001H16.5625V25.0001C18.9248 24.6264 21.0751 23.4184 22.6231 21.5952C24.1711 19.7719 25.0143 17.4543 25 15.0626Z" fill="white"/>
                </svg>

              </div>
              <div className="icons">
                <svg width="clamp(1.0625rem, 0.9625rem + 0.5333vw, 1.5625rem)" height="clamp(1.0625rem, 0.9625rem + 0.5333vw, 1.5625rem)" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_202_207)">
                <path fillRule="evenodd" clipRule="evenodd" d="M10 15C12.7614 15 15 12.7614 15 10C15 7.23857 12.7614 5 10 5C7.23857 5 5 7.23857 5 10C5 12.7614 7.23857 15 10 15ZM10 13.3333C11.8409 13.3333 13.3333 11.8409 13.3333 10C13.3333 8.15905 11.8409 6.66667 10 6.66667C8.15905 6.66667 6.66667 8.15905 6.66667 10C6.66667 11.8409 8.15905 13.3333 10 13.3333Z" fill="white"/>
                <path d="M15.0001 4.16675C14.5398 4.16675 14.1667 4.53985 14.1667 5.00008C14.1667 5.46031 14.5398 5.83341 15.0001 5.83341C15.4603 5.83341 15.8334 5.46031 15.8334 5.00008C15.8334 4.53985 15.4603 4.16675 15.0001 4.16675Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M1.37822 3.5633C0.833252 4.63286 0.833252 6.03299 0.833252 8.83325V11.1666C0.833252 13.9668 0.833252 15.367 1.37822 16.4365C1.85759 17.3773 2.62249 18.1423 3.5633 18.6216C4.63286 19.1666 6.03299 19.1666 8.83325 19.1666H11.1666C13.9668 19.1666 15.367 19.1666 16.4365 18.6216C17.3773 18.1423 18.1423 17.3773 18.6216 16.4365C19.1666 15.367 19.1666 13.9668 19.1666 11.1666V8.83325C19.1666 6.03299 19.1666 4.63286 18.6216 3.5633C18.1423 2.62249 17.3773 1.85759 16.4365 1.37822C15.367 0.833252 13.9668 0.833252 11.1666 0.833252H8.83325C6.03299 0.833252 4.63286 0.833252 3.5633 1.37822C2.62249 1.85759 1.85759 2.62249 1.37822 3.5633ZM11.1666 2.49992H8.83325C7.40562 2.49992 6.43513 2.50122 5.68499 2.5625C4.95429 2.6222 4.58062 2.73041 4.31995 2.86323C3.69274 3.18281 3.18281 3.69274 2.86323 4.31995C2.73041 4.58062 2.6222 4.95429 2.5625 5.68499C2.50122 6.43513 2.49992 7.40562 2.49992 8.83325V11.1666C2.49992 12.5943 2.50122 13.5647 2.5625 14.3148C2.6222 15.0456 2.73041 15.4193 2.86323 15.6799C3.18281 16.3071 3.69274 16.817 4.31995 17.1366C4.58062 17.2694 4.95429 17.3777 5.68499 17.4373C6.43513 17.4986 7.40562 17.4999 8.83325 17.4999H11.1666C12.5943 17.4999 13.5647 17.4986 14.3148 17.4373C15.0456 17.3777 15.4193 17.2694 15.6799 17.1366C16.3071 16.817 16.817 16.3071 17.1366 15.6799C17.2694 15.4193 17.3777 15.0456 17.4373 14.3148C17.4986 13.5647 17.4999 12.5943 17.4999 11.1666V8.83325C17.4999 7.40562 17.4986 6.43513 17.4373 5.68499C17.3777 4.95429 17.2694 4.58062 17.1366 4.31995C16.817 3.69274 16.3071 3.18281 15.6799 2.86323C15.4193 2.73041 15.0456 2.6222 14.3148 2.5625C13.5647 2.50122 12.5943 2.49992 11.1666 2.49992Z" fill="white"/>
                </g>
                <defs>
                <clipPath id="clip0_202_207">
                <rect width="20" height="20" fill="white"/>
                </clipPath>
                </defs>
                </svg>
              </div>
              <div className="icons">
                <svg width="clamp(1.0625rem, 0.9625rem + 0.5333vw, 1.5625rem)" height="clamp(1.0625rem, 0.9625rem + 0.5333vw, 1.5625rem)" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9909 2.10953C20.0297 1.8764 19.9423 1.64013 19.7611 1.48852C19.5797 1.3369 19.3317 1.29261 19.1091 1.3721L0.442448 8.03877C0.190945 8.12858 0.0173156 8.35984 0.00121827 8.62641C-0.0148789 8.89298 0.129663 9.14345 0.368531 9.26288L5.70187 11.9295C5.91584 12.0365 6.17075 12.0207 6.3698 11.888L10.797 8.9365L8.14609 12.2501C8.02937 12.396 7.97923 12.5842 8.00789 12.7689C8.03656 12.9535 8.1414 13.1177 8.29687 13.2213L16.2969 18.5546C16.4851 18.68 16.7241 18.7015 16.9317 18.6117C17.1393 18.5218 17.2871 18.3327 17.3243 18.1095L19.9909 2.10953Z" fill="white"/>
                </svg>
              </div>
              <div className="icons">
                <svg width="clamp(1.0625rem, 0.9625rem + 0.5333vw, 1.5625rem)" height="clamp(1.0625rem, 0.9625rem + 0.5333vw, 1.5625rem)" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_202_221)">
                <path fillRule="evenodd" clipRule="evenodd" d="M10 0C15.523 0 20 4.58993 20 10.2529C20 14.7819 17.138 18.624 13.167 19.981C12.66 20.082 12.48 19.7618 12.48 19.4888C12.48 19.1508 12.492 18.0468 12.492 16.6748C12.492 15.7188 12.172 15.0949 11.813 14.7769C14.04 14.5229 16.38 13.6558 16.38 9.71777C16.38 8.59777 15.992 7.68382 15.35 6.96582C15.454 6.70682 15.797 5.66395 15.252 4.25195C15.252 4.25195 14.414 3.97722 12.505 5.30322C11.706 5.07622 10.85 4.96201 10 4.95801C9.15 4.96201 8.295 5.07622 7.497 5.30322C5.586 3.97722 4.746 4.25195 4.746 4.25195C4.203 5.66395 4.546 6.70682 4.649 6.96582C4.01 7.68382 3.619 8.59777 3.619 9.71777C3.619 13.6458 5.954 14.5262 8.175 14.7852C7.889 15.0412 7.63 15.4928 7.54 16.1558C6.97 16.4178 5.522 16.8712 4.63 15.3042C4.63 15.3042 4.101 14.3191 3.097 14.2471C3.097 14.2471 2.122 14.2341 3.029 14.8701C3.029 14.8701 3.684 15.1851 4.139 16.3701C4.139 16.3701 4.726 18.2001 7.508 17.5801C7.513 18.4371 7.522 19.2448 7.522 19.4888C7.522 19.7598 7.338 20.0769 6.839 19.9819C2.865 18.6269 0 14.7829 0 10.2529C0 4.58993 4.478 0 10 0Z" fill="white"/>
                </g>
                <defs>
                <clipPath id="clip0_202_221">
                <rect width="20" height="20" fill="white"/>
                </clipPath>
                </defs>
                </svg>

              </div>
               <div className="icons">
                <svg width="clamp(1.0625rem, 0.9625rem + 0.5333vw, 1.5625rem)" height="clamp(1.0625rem, 0.9625rem + 0.5333vw, 1.5625rem)" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_202_234)">
                <path d="M14.375 0H5.625C2.5 0 0 2.5 0 5.625V14.375C0 17.5 2.5 20 5.625 20H14.375C17.5 20 20 17.5 20 14.375V5.625C20 2.5 17.5 0 14.375 0ZM7.5 15.625C7.5 16 7.25 16.25 6.875 16.25H4.375C4 16.25 3.75 16 3.75 15.625V8.125C3.75 7.75 4 7.5 4.375 7.5H6.875C7.25 7.5 7.5 7.75 7.5 8.125V15.625ZM5.625 6.875C4.5625 6.875 3.75 6.0625 3.75 5C3.75 3.9375 4.5625 3.125 5.625 3.125C6.6875 3.125 7.5 3.9375 7.5 5C7.5 6.0625 6.6875 6.875 5.625 6.875ZM16.25 15.625C16.25 16 16 16.25 15.625 16.25H13.75C13.375 16.25 13.125 16 13.125 15.625V13.4375V12.8125V11.5625C13.125 11.0625 12.6875 10.625 12.1875 10.625C11.6875 10.625 11.25 11.0625 11.25 11.5625V12.8125V13.4375V15.625C11.25 16 11 16.25 10.625 16.25H8.75C8.375 16.25 8.125 16 8.125 15.625V8.125C8.125 7.75 8.375 7.5 8.75 7.5H11.25C11.4375 7.5 11.5625 7.5625 11.6875 7.6875C12.0625 7.5625 12.4375 7.5 12.8125 7.5C14.6875 7.5 16.25 9.0625 16.25 10.9375V15.625Z" fill="white"/>
                </g>
                <defs>
                <clipPath id="clip0_202_234">
                <rect width="20" height="20" fill="white"/>
                </clipPath>
                </defs>
                </svg>
              </div>
            </div>
          </div>

          </motion.div>
          
        </div>
        <div className="footer-form form-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 50 }}           
            whileInView={{ opacity: 1, y: 0 }}        
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.1 }}
            >
            <div>
              <h4 className="fs-13" style={{fontWeight:"300"}}>Send a message</h4>
              <div className="form">
                <input className={isEmpty && btnClicked ? "fs-92 error" : "fs-92" } type="text" value={user_name} onChange={(e) => set_user_name(e.target.value)} placeholder="Your name or email"/>
                <textarea spellCheck="false" rows={7} className={isEmpty && btnClicked ? "fs-92 error" : "fs-92" } value={user_message} onChange={(e) => set_message(e.target.value)} placeholder="Write a message"></textarea>
                <div className={link.length === 0 ? "fs-92 d-none" : "fs-92"}><p style={{fontWeight:100}}>Expect a response within a few hours via this link: <a style={{textDecoration:"underline"}} href={link} target="_blank">{link}</a></p></div>
                <button type="submit" disabled={isSending ? true : false} className="fs-92" onClick={async () => {
                  if (messageStatus === 0 && user_name.length > 0 && user_message.length > 0) {
                    setMessageStatus(1);
                    setIsSending(true);
                    await sendMessage(user_name, user_message);
                  } else {
                    setBtnClicked(true);
                    setTimeout(() => {
                      setBtnClicked(false);
                    }, 2500);
                  }
                  
                }
                }>{statusLabels[messageStatus]}</button>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
      <div className="fs-92 mt-20" style={{fontWeight:100,textAlign:"center"}}>© 2025</div>
    </div>
  );
}



interface LoadedProps {
  loaded: boolean,
  setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

function Preload({ loaded, setLoaded  }: LoadedProps) {
  return (
    <>
      {!loaded && ( 
        <div className="preload">
          <p style={{padding:"5px"}}>Please wait..</p>
        </div>
      )}
    </>
  );
}

export default function Portfolio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {

    const handleLoad = () => {
      document.body.style.overflowY = "auto";
      setLoaded(true);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <>
      <Header activeIndex={activeIndex} setActiveIndex={setActiveIndex} loaded={loaded}/>
      <Intro activeIndex={activeIndex} setActiveIndex={setActiveIndex} loaded={loaded}/>
      <Projects activeIndex={activeIndex} setActiveIndex={setActiveIndex} loaded={loaded}/>
      <Services activeIndex={activeIndex} setActiveIndex={setActiveIndex} loaded={loaded}/>
      <TechStack activeIndex={activeIndex} setActiveIndex={setActiveIndex} loaded={loaded}/>
      <Contact activeIndex={activeIndex}  setActiveIndex={setActiveIndex} loaded={loaded}/>
      <Preload loaded={loaded} setLoaded={setLoaded}/>
    </>
  );
}
