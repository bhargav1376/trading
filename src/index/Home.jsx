import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Home.css';
import './darkmode.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

// dark mode starts here 
function Home() {
    const [theme, setTheme] = useState(() => {
        const stored = localStorage.getItem('theme-preference');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('dark-mode', 'light-mode');
        root.classList.add(`${theme}-mode`);
        localStorage.setItem('theme-preference', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const scrollToIndicators = (e) => {
        if (e) {
            e.preventDefault();
        }
        const element = document.getElementById('sectionind');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToAbout = (e) => {
        if (e) {
            e.preventDefault();
        }
        const element = document.getElementById('section_Aboutus');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openModal, setOpenModal] = useState(null);
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formStatus, setFormStatus] = useState({ type: '', message: '' });

    const animateSlideOut = useCallback((index) => {
        const img = document.querySelectorAll('.slide')[index]?.querySelector("img.Img_slider-img");
        const textEls = document.querySelectorAll('.slide')[index]?.querySelectorAll("h1.Pro_trad, p.Analyze_pro, div.connect_more, div.matter_img");

        if (img) img.classList.remove("show");
        textEls?.forEach(el => el.classList.remove("show"));
    }, []);

    const animateSlideIn = useCallback((index) => {
        const img = document.querySelectorAll('.slide')[index]?.querySelector("img.Img_slider-img");
        const textEls = document.querySelectorAll('.slide')[index]?.querySelectorAll("h1.Pro_trad, p.Analyze_pro, div.connect_more, div.matter_img");

        if (img) img.classList.add("show");
        setTimeout(() => {
            textEls?.forEach(el => el.classList.add("show"));
        }, 600);
    }, []);

    const showSlide = useCallback((index) => {
        animateSlideOut(currentSlide);
    
        setTimeout(() => {
            if (document.querySelector('.Slider')) {
                const slider = document.querySelector('.Slider');
                slider.style.transform = `translateX(-${index * 100}%)`;
                setTimeout(() => {
                    animateSlideIn(index);
                    setCurrentSlide(index);
                }, 100);
            }
        }, 100);
    }, [currentSlide, animateSlideIn, animateSlideOut]);

    const handleNextSlide = useCallback(() => {
        const nextIndex = (currentSlide + 1) % 6;
        showSlide(nextIndex);
    }, [currentSlide, showSlide]);
    
    const handlePrevSlide = useCallback(() => {
        const prevIndex = (currentSlide - 1 + 6) % 6;
        showSlide(prevIndex);
    }, [currentSlide, showSlide]);

    useEffect(() => {
        showSlide(currentSlide);

        const interval = setInterval(() => {
            handleNextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [handleNextSlide, showSlide, currentSlide]);

    useEffect(() => {
        const mybutton = document.getElementById("scrollmyBtn");

        const scrollFunction = () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                mybutton.style.opacity = "1";
                mybutton.style.pointerEvents = "auto";
            } else {
                mybutton.style.opacity = "0";
                mybutton.style.pointerEvents = "none";
            }
        };

        window.addEventListener('scroll', scrollFunction);

        return () => {
            window.removeEventListener('scroll', scrollFunction);
        };
    }, []);

    const slides = [
        {
            img: 'https://bhargav1376.github.io/trading/src/index/images/cuttrading5.jpeg',
            title: "Professional Trading",
            desc: "Analyze the market with real-time data and powerful indicators, make informed decisions with advanced charting tools, and stay ahead of trends with AI-driven insights."
        },
        {
            img: 'https://bhargav1376.github.io/trading/src/index/images/cuttrading1.jpeg',
            title: "Advanced Charts",
            desc: "Visualize trends with advanced and customizable charting tools. Compare multiple assets and timeframes seamlessly. Gain deeper insights with interactive and real-time visual data."
        },
        {
            img: 'https://bhargav1376.github.io/trading/src/index/images/trading3.jpg',
            title: "Smart Alerts",
            desc: "Receive alerts when market movements match your strategy. Customize alert conditions for price, volume, or technical indicators. Stay informed in real-time across all your devices."
        },
        {
            img: 'https://bhargav1376.github.io/trading/src/index/images/demobg1wat.png',
            title: "Global Access",
            desc: "Trade on international markets from a single platform. Access stocks, forex, and commodities across global exchanges. Diversify your portfolio with seamless cross-border trading."
        },
        {
            img: 'https://bhargav1376.github.io/trading/src/index/images/trading10.webp',
            title: "Secure Portfolio",
            desc: "Keep your investments protected with advanced security. Benefit from encrypted transactions and multi-layer authentication. Monitor and manage your portfolio with confidence and peace of mind."
        }
    ];

    const headingRef = useRef(null);
    const gridRefs = useRef([]);
    const indicatorsSectionRef = useRef(null);
    const demoSectionRef = useRef(null);
    const contactSectionRef = useRef(null);
    const aboutSectionRef = useRef(null);

    useEffect(() => {
        const headingEls = headingRef.current ? [
            headingRef.current.querySelector('h1.Head_ind'),
            headingRef.current.querySelector('p.Head_ind_p')
        ] : [];
        const gridItems = gridRefs.current;

        const sectionObserver = new window.IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        headingEls.forEach((el) => {
                            if (el) el.classList.add('Indshow');
                        });
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (headingRef.current) {
            sectionObserver.observe(headingRef.current);
        }

        const gridObserver = new window.IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('grid-show');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        gridItems.forEach(item => {
            if (item) gridObserver.observe(item);
        });

        return () => {
            sectionObserver.disconnect();
            gridObserver.disconnect();
        };
    }, []);

    const handleOpenModal = useCallback((modalId) => {
        setOpenModal(modalId);
    }, []);
    const handleCloseModal = useCallback(() => {
        setOpenModal(null);
    }, []);
    const handleModalClick = (e) => {
        if (e.target.classList.contains('modal')) {
            handleCloseModal();
        }
    };

    const indicators = [
        {
            id: 'rsiModal',
            img: 'https://raw.githubusercontent.com/bhargav1376/trading/main/src/index/images/ind1.webp',
            title: 'Relative Strength Index',
            desc: 'The relative strength index (RSI) is a pivotal technical indicator used to evaluate the momentum and trend strength of a market. Oscillating between 0 and 100.',
            modalContent: `The Relative Strength Index (RSI) is a momentum indicator that measures the speed and change of price movements. It ranges from 0 to 100, signaling overbought conditions above 70 and oversold conditions below 30. Commonly used on a 14-period scale, RSI helps identify potential market reversals. Traders often combine it with other indicators for better accuracy. It's effective across different timeframes, making it suitable for both short-term and long-term strategies. RSI is a staple tool for technical analysis in all markets. It also helps traders confirm the strength of price trends. Divergence between RSI and price can signal upcoming reversals.`
        },
        {
            id: 'bollingerModal',
            img: 'https://raw.githubusercontent.com/bhargav1376/trading/main/src/index/images/ind2.webp',
            title: 'Bollinger bands',
            desc: 'Bollinger bands are a popular technical analysis indicator employed to assess market volatility and price action. This technical indicator consists of three lines.',
            modalContent: `Bollinger Bands are a popular technical analysis indicator employed to assess market volatility and price action. This technical indicator consists of three lines. The middle line is a simple moving average (SMA), while the upper and lower bands are standard deviations from the SMA. When the bands widen, it indicates increased volatility; when they contract, it signals decreased volatility. Traders use Bollinger Bands to identify potential overbought or oversold conditions. Price touching the bands doesn't always imply reversal, but it's a cue for further analysis. They work well with candlestick patterns and other momentum indicators.`
        },
        {
            id: 'maModal',
            img: 'https://raw.githubusercontent.com/bhargav1376/trading/main/src/index/images/ind3.webp',
            title: 'Moving averages',
            desc: 'Moving averages are fundamental technical indicators for traders looking to understand the sentiment of the market and price action.',
            modalContent: `Moving averages are fundamental technical indicators for traders looking to understand the sentiment of the market and price action. They help smooth out price data over a specific time period, allowing traders to identify trends more easily. The most common types are the Simple Moving Average (SMA) and the Exponential Moving Average (EMA), with the EMA giving more weight to recent prices. Moving averages are often used to identify support and resistance levels and provide trade signals when price crosses the moving average line. A crossover strategy, where the short-term moving average crosses above the long-term moving average.`
        },
        {
            id: 'macdModal',
            img: 'https://raw.githubusercontent.com/bhargav1376/trading/main/src/index/images/ind4.webp',
            title: 'Moving convergence',
            desc: 'Most traders recognize that the moving average convergence divergence (MACD) indicator is a pivotal technical indicator in assessing a price trend.',
            modalContent: `Most traders recognize that the Moving Average Convergence Divergence (MACD) indicator is a pivotal technical indicator in assessing a price trend. It works by subtracting the 26-period exponential moving average (EMA) from the 12-period EMA. The result is the MACD line, and a 9-period EMA of this line forms the signal line. Crossovers between these lines often indicate buy or sell signals. MACD also helps identify bullish or bearish momentum through divergence with price action. It's most effective in trending markets rather than sideways conditions. Traders often combine it with other indicators to enhance accuracy. Its histogram representation provides a clear visual of momentum shifts.`
        }
    ];

    const activeIndicator = indicators.find(ind => ind.id === openModal);

    useEffect(() => {
        const section = demoSectionRef.current;
        if (!section) return;

        const elementsToAnimate = section.querySelectorAll(
            ".left, h1.trading_pro, p.power_tools, p.drive_into, div.Demo_Btn, .right, .line1, .line2, .line3, .line4, div.logo"
        );

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        elementsToAnimate.forEach((el) => {
                            el.classList.add("Demoshow");
                        });
                        observer.unobserve(section);
                    }
                });
            },
            { threshold: 0.3 }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    const demoModalRef = useRef(null);

    const openDemoModal = useCallback(() => {
        setShowDemoModal(true);
        if (demoModalRef.current) {
            demoModalRef.current.style.display = 'block';
            setTimeout(() => {
                demoModalRef.current.style.opacity = '1';
            }, 10);
        }
    }, []);

    const closeDemoModal = useCallback(() => {
        if (demoModalRef.current) {
            demoModalRef.current.style.opacity = '0';
            setTimeout(() => {
                setShowDemoModal(false);
                demoModalRef.current.style.display = 'none';
            }, 300);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (demoModalRef.current && !demoModalRef.current.contains(event.target)) {
                closeDemoModal();
            }
        };

        if (showDemoModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDemoModal, closeDemoModal]);

    const validateName = useCallback((name) => {
        if (!name.trim()) return 'Name is required';
        if (name.length < 2) return 'Name must be at least 2 characters long';
        return '';
    }, []);

    const validateEmail = useCallback((email) => {
        if (!email) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    }, []);

    const validatePhone = useCallback((phone) => {
        if (!phone) return '';
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return 'Phone number must start with 6, 7, 8, or 9 and be 10 digits long';
        }
        return '';
    }, []);

    const validateMessage = useCallback((message) => {
        const wordCount = message.trim().split(/\s+/).length;
        if (wordCount < 10) return 'Message must contain at least 10 words';
        return '';
    }, []);

    const validateForm = useCallback(() => {
        const errors = {};
        
        const nameError = validateName(formData.name);
        if (nameError) errors.name = nameError;
        
        const emailError = validateEmail(formData.email);
        if (emailError) errors.email = emailError;
        
        const phoneError = validatePhone(formData.phone);
        if (phoneError) errors.phone = phoneError;
        
        const messageError = validateMessage(formData.message);
        if (messageError) errors.message = messageError;
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData, validateName, validateEmail, validatePhone, validateMessage]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setFormErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setFormStatus({ type: 'error', message: 'Please correct the errors in the form' });
            return;
        }
        
        setFormStatus({ type: 'loading', message: 'Submitting...' });

        try {
            const response = await fetch('http://localhost:3030/Submit-Contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setFormStatus({ type: 'success', message: 'Form submitted successfully!' });
                setShowSuccessModal(true);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: ''
                });
                setFormErrors({});
            } else {
                setFormStatus({ type: 'error', message: data.error || 'Something went wrong' });
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setFormStatus({ type: 'error', message: 'Failed to submit form. Please try again.' });
        }
    }, [formData, validateForm]);

    useEffect(() => {
        const section = contactSectionRef.current;
        if (!section) return;

        const elementsToAnimate = section.querySelectorAll(
            ".re-form, .Get_in_touch, .Get_in_touch_p, .linked-in-icon, .instagram-icon, .Twitter-icon, .Facebook-icon, .name-input, .email-input, .number-input, .subject-input, .textarea-input, .submit-input"
        );

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        elementsToAnimate.forEach((el) => el.classList.add("formshow"));
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const section = aboutSectionRef.current;
        if (!section) return;

        const elementsToAnimate = section.querySelectorAll(
            ".black-img_section, .White-img_section, .bg_width-blue, .matter_about_us, .upper_section, .below_section, .tag_h_aboutus, .us_matter, .us_mission, .us_vision"
        );

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        elementsToAnimate.forEach((el) => el.classList.add("Aboutshow"));
                    }
                });
            },
            { threshold: 0.3, once: true }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    const SuccessModal = () => {
        if (!showSuccessModal) return null;

        return (
            <div className="modal show" style={{ display: 'block' }} onClick={() => setShowSuccessModal(false)}>
                <div className="modal-content success-modal">
                    <span className="close" onClick={() => setShowSuccessModal(false)}>&times;</span>
                    <div className="success-content">
                        <div className="success-icon">
                            <i className="fa fa-check-circle"></i>
                        </div>
                        <h2>Thank You, {formData.name}!</h2>
                        <p>Your message has been successfully submitted.</p>
                        <p>We will get back to you shortly.</p>
                        <button 
                            className="btn-form-form"
                            onClick={() => setShowSuccessModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const [showLoginDiv, setShowLoginDiv] = useState(true);

    const handleCloseLogin = () => {
        setShowLoginDiv(false);
    };

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(!isMenuOpen);
    }, [isMenuOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const menu = document.querySelector('.flex_navlist');
            const hamburger = document.querySelector('.hamburger-menu');
            if (isMenuOpen && menu && !menu.contains(event.target) && !hamburger.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <div className="Home">
            <header className="Header">
                <nav className="Nav_bar">
                    <div className="Logo">
                        <img src="https://bhargav1376.github.io/trading/src/index/images/Logo.png" alt="Astrolite" className="Logo_img" />
                    </div>
                    <div className="hamburger-menu" onClick={toggleMenu}>
                        <i className={`fa ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                    </div>
                    <div className={`flex_navlist ${isMenuOpen ? 'active' : ''}`}>
                        <div className="list_nav">
                            <ul className="Nav_list">
                                <li className="Li_listnav">
                                    <a className="a_navhef Animone" href="/bhargav1376/trading.git/indicators" onClick={(e) => {
                                        e.preventDefault();
                                        scrollToIndicators();
                                        setIsMenuOpen(false);
                                    }}>Indicators</a>
                                </li>
                                <li className="Li_listnav">
                                    <a className="a_navhef Animtwo" href="/bhargav1376/trading.git/dashboard" onClick={(e) => {
                                        e.preventDefault();
                                        setIsMenuOpen(false);
                                    }}>Dashboard</a>
                                </li>
                                <li className="Li_listnav">
                                    <a className="a_navhef Animthree" href="/bhargav1376/trading.git/about" onClick={(e) => {
                                        e.preventDefault();
                                        scrollToAbout();
                                        setIsMenuOpen(false);
                                    }}>About</a>
                                </li>
                            </ul>
                        </div>
                        <div className="dark_light">
                            <div className="dark_mode_light">
                                <button 
                                    className="theme-toggle" 
                                    onClick={toggleTheme}
                                    title="Toggle light & dark" 
                                    aria-label={theme} 
                                    aria-live="polite"
                                >
                                    <svg className="sun-and-moon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
                                        <mask className="moon" id="moon-mask">
                                            <rect x="0" y="0" width="100%" height="100%" fill="white" />
                                            <circle cx="24" cy="10" r="6" fill="black" />
                                        </mask>
                                        <circle className="sun" cx="12" cy="12" r="6" mask="url(#moon-mask)" fill="currentColor" />
                                        <g className="sun-beams" stroke="currentColor">
                                            <line x1="12" y1="1" x2="12" y2="3" />
                                            <line x1="12" y1="21" x2="12" y2="23" />
                                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                            <line x1="1" y1="12" x2="3" y2="12" />
                                            <line x1="21" y1="12" x2="23" y2="12" />
                                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                        </g>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <section className="Image_slider">
                <div className="Slider_wrapper">
                    <div className="Slider">
                        {slides.map((slide, index) => (
                            <div 
                                key={index} 
                                className="Slider_img"
                            >
                                <div className="grid_img">
                                    <div className="Img_slide">
                                        <div className="Img_overlay"></div>
                                        <img src={slide.img} alt={`Slider ${index + 1}`} className="Img_slider-img" />
                                        <div className="matter_img">
                                            <h1 className="Pro_trad">{slide.title}</h1>
                                            <p className="Analyze_pro">{slide.desc}</p>
                                            <div className="connect_more">
                                                <button className="btn-txt" onClick={() => window.location.href = '/contact'}>Connect</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="width_flex_slider_btn">
                        <div className="width_slider_flex">
                            <button className="prev" onClick={handlePrevSlide}>&#10094;</button>
                            <button className="next" onClick={handleNextSlide}>&#10095;</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="Indicators" id="sectionind" ref={indicatorsSectionRef}>
                <div className="Indicators-wr">
                    <div className="Indicators_img-wr">
                        <div className="Head_link" ref={headingRef}>
                            <h1 className="Head_ind">Indicators</h1>
                            <p className="Head_ind_p">Explore a variety of indicators to enhance your trading strategies.</p>
                        </div>
                        <div className="indicators_sect">
                            <div className="indicators_grid">
                                {indicators.map((indicator, idx) => (
                                    <div className="img_src-matter-grid" key={indicator.id} ref={el => gridRefs.current[idx] = el}>
                                        <div className="grid_ind">
                                            <div className="img_src_ind">
                                                <img src={indicator.img} alt="Indicators" className="Indicators_imgs" />
                                            </div>
                                        </div>
                                        <div className="matter_img-link">
                                            <div className="matter-list-link">
                                                <h1 className="link_re">{indicator.title}</h1>
                                                <p className="link_re_p">{indicator.desc}</p>
                                                <div className="read_more-li">
                                                    <button className="btn-txt-ind" onClick={() => handleOpenModal(indicator.id)}>Read More</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {activeIndicator && (
                <div id={activeIndicator.id} className="modal show" style={{ display: 'block' }} onClick={handleModalClick}>
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <div className="img_grid">
                            <div className="img_src_ind">
                                <img src={activeIndicator.img} alt="Indicators" className="Indicators_imgs-openmodal" />
                            </div>
                            <div className="matter-insc">
                                <h2 className="rela_ind">{activeIndicator.title}</h2>
                                <p className="link_re_ind">{activeIndicator.modalContent}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section className="Demo_section" ref={demoSectionRef}>
                <div className="Demo_section-wr">
                    <div className="Demo_img-wr">
                        <div className="banner">
                            <div className="left">
                                <div className="matter_content_left">
                                    <div className="matter_lis">
                                        <h1 className="trading_pro">Trading Pro</h1>
                                        <p className="power_tools">
                                            <i id="poe_tr" className="fa fa-circle"></i>
                                            <span className="power-trad"> powerful trading tools and real-time market insights. Click below to explore our demo and take your trading experience to the next level.</span>
                                        </p>
                                        <p className="drive_into">
                                            <i id="poe_tr" className="fa fa-circle"></i>
                                            <span className="drive_in"> Dive into the demo now to experience our platform's features firsthand. Get access to advanced charting tools, live market data, and expert analysis to make informed decisions. </span>
                                        </p>
                                    </div>
                                    <div className="Demo_Btn">
                                        <button 
                                            className="demo-btn" 
                                            onClick={openDemoModal}
                                            type="button"
                                        >
                                            Open Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="right">
                                <div className="line1"></div>
                                <div className="line2"></div>
                                <div className="line3"></div>
                                <div className="line4"></div>
                                <img src="https://bhargav1376.github.io/trading/src/index/images/demoimage.jpeg" alt="Trading Business" className="trading-image" />
                                <div className="logo"> Trading <span>PRO</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {showDemoModal && (
                <div className="demo-modal" ref={demoModalRef}>
                    <div className="demo-modal-content">
                        <h2>Demo Modal</h2>
                        <p>This is a demo modal content.</p>
                        <button onClick={closeDemoModal}>Close</button>
                    </div>
                </div>
            )}

            <section className="Slider_section-detail">
                <div className="Slider_section">
                    <div className="slider_show-width">
                        <div className="silder_show-animation">
                            <Swiper
                                modules={[Pagination, Navigation]}
                                slidesPerView={3}
                                spaceBetween={25}
                                loop={true}
                                centeredSlides={true}
                                grabCursor={true}
                                pagination={{
                                    el: '.swiper-pagination',
                                    clickable: true,
                                    dynamicBullets: true,
                                }}
                                navigation={{
                                    nextEl: '.right-prev',
                                    prevEl: '.left-prev',
                                }}
                                breakpoints={{
                                    0: { slidesPerView: 1 },
                                    520: { slidesPerView: 2 },
                                    950: { slidesPerView: 3 },
                                }}
                                className="slide-content"
                            >
                                <SwiperSlide>
                                    <div className="swiper-slide slider_img_graph-s">    
                                        <img src="https://bhargav1376.github.io/bhargav1376/trading.git/src/index/images/sliderimgs/sildercopy.jpg" alt="Slide 1" className="slider_img_graph" />
                                        <div className="slide-text">
                                            <h2 className="slider_name">Market Momentum</h2>
                                            <p className="slider_p-wapper">
                                                Accelerating growth with intermittent pullbacks—ideal for stock‑performance dashboards. 
                                                Robust trading volumes confirm bullish conviction, while technical indicators highlight healthy consolidation phases.
                                            </p>
                                        </div>
                                    </div>  
                                </SwiperSlide>

                                <SwiperSlide>
                                    <div className="swiper-slide slider_img_graph-s">   
                                        <img src="https://bhargav1376.github.io/trading/src/index/images/sliderimgs/slider5.jpg" alt="Slide 2" className="slider_img_graph" />
                                        <div className="slide-text">
                                            <h2 className="slider_name">Tech Surge</h2>
                                            <p className="slider_p-wapper">
                                                These charts vividly depict a strong and sustained upward trend that is clearly evident within the technology sector.
                                                The visual representation showcases a consistent pattern of growth.
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>

                                <SwiperSlide>
                                    <div className="swiper-slide slider_img_graph-s">   
                                        <img src="https://bhargav1376.github.io/trading/src/index/images/sliderimgs/slider2.jpg" alt="Slide 3" className="slider_img_graph" />
                                        <div className="slide-text">
                                            <h2 className="slider_name">Crypto Waves</h2>
                                            <p className="slider_p-wapper">
                                                The "Crypto Waves" charts visually represent the often volatile price fluctuations characteristic of the cryptocurrency market.
                                                Despite these frequent ups and downs, the overall trend depicted in the visualizations.
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>

                                <SwiperSlide>
                                    <div className="swiper-slide slider_img_graph-s">   
                                        <img src="https://bhargav1376.github.io/trading/src/index/images/sliderimgs/slider3.jpg" alt="Slide 4" className="slider_img_graph" />
                                        <div className="slide-text">
                                            <h2 className="slider_name">Energy Upswing</h2>
                                            <p className="slider_p-wapper">
                                                The "Energy Upswing" charts illustrate a noticeable and consistent recovery within both oil and gas markets.
                                                These visualizations clearly demonstrate a steady climb in market indicators following a previously experienced.
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>

                                <SwiperSlide>
                                    <div className="swiper-slide slider_img_graph-s">   
                                        <img src="https://bhargav1376.github.io/trading/src/index/images/sliderimgs/slider4.jpg" alt="Slide 5" className="slider_img_graph" />
                                        <div className="slide-text">
                                            <h2 className="slider_name">Retail Revival</h2>
                                            <p className="slider_p-wapper">
                                                The "Retail Revival" charts clearly depict a significant rebound in consumer spending activities.
                                                These visuals illustrate a positive upturn in retail markets corresponding with the reopening of various sectors.
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>

                                <SwiperSlide>
                                    <div className="swiper-slide slider_img_graph-s">   
                                        <img src="https://bhargav1376.github.io/trading/src/index/images/sliderimgs/slider6.jpg" alt="Slide 6" className="slider_img_graph" />
                                        <div className="slide-text">
                                            <h2 className="slider_name">Healthcare Growth</h2>
                                            <p className="slider_p-wapper">
                                                The "Healthcare Growth" charts clearly illustrate a continued upward movement in the value of biotech and pharmaceutical stocks.
                                                These visualizations demonstrate an extension of a previously established positive.
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>

                                <div className="arrows_left-right">
                                    <div className="swiper-button">
                                        <button className="left-prev"><i className="fa fa-angle-left" aria-hidden="true"></i></button>
                                    </div>
                                    <div className="swiper-button">
                                        <button className="right-prev"><i className="fa fa-angle-right" aria-hidden="true"></i></button>
                                    </div>
                                </div>
                                <div className="swiper-pagination"></div>
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>

            {useEffect(() => {
                const section = document.querySelector(".Slider_section-detail");
                if (!section) return;

                const elementsToAnimate = section.querySelectorAll(".silder_show-animation");

                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                elementsToAnimate.forEach((el) => el.classList.add("Slidershow"));
                            }
                        });
                    },
                    { threshold: 0.3, once: true }
                );

                observer.observe(section);
                return () => observer.disconnect();
            }, [])}

            <section className="Contact_us-section" ref={contactSectionRef}>
                <div className="Contact-get">
                    <div className="Contact-touch">
                        <div className="form-cont">
                            <div className="re-form">
                                <div className="contact-email-link">
                                    <p className="email-ln"><i className="fa-regular fa-envelope"></i></p>
                                </div>
                            </div>
                            <form className="form-contact" onSubmit={handleSubmit}>
                                <div className="form-get-in">
                                    <div className="Get-form">
                                        <div className="matter-con">
                                            <h1 className="Get_in_touch">Get in Touch</h1>
                                            <p className="Get_in_touch_p">We value your feedback and are here to assist you with any questions or concerns you may have regarding our trading services.</p>
                                        </div>
                                        <div className="Social-media-control">
                                            <div className="social-media">
                                                <a href="https://facebook.com" className="social-icon Facebook-icon"><i className="fa-brands fa-facebook-f"></i></a>
                                                <a href="https://twitter.com" className="social-icon Twitter-icon"><i className="fa-brands fa-twitter"></i></a>
                                                <a href="https://instagram.com" className="social-icon instagram-icon"><i className="fa-brands fa-instagram"></i></a>
                                                <a href="https://linkedin.com" className="social-icon linked-in-icon"><i className="fa-brands fa-linkedin-in"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="from-grid">
                                        <div className="from-inputs name-input">
                                            <input 
                                                type="text" 
                                                className={`form-control ${formErrors.name ? 'error' : ''}`}
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter Name *" 
                                                required 
                                            />
                                            {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                                        </div>
                                        <div className="from-inputs email-input">
                                            <input 
                                                type="email" 
                                                className={`form-control ${formErrors.email ? 'error' : ''}`}
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Enter Email *" 
                                                required 
                                            />
                                            {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                                        </div>
                                        <div className="from-inputs number-input">
                                            <input 
                                                type="tel" 
                                                className={`form-control ${formErrors.phone ? 'error' : ''}`}
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="Enter phone Number (Optional)" 
                                            />
                                            {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                                        </div>
                                        <div className="form-group subject-input">
                                            <select 
                                                name="subject"
                                                id="subject"
                                                className={formErrors.subject ? 'error' : ''}
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="" disabled>Select Subject</option>
                                                <option value="General Inquiry">General Inquiry</option>
                                                <option value="Technical Support">Technical Support</option>
                                                <option value="Account Issues">Account Issues</option>
                                                <option value="Partnership Opportunities">Partnership Opportunities</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {formErrors.subject && <span className="error-message">{formErrors.subject}</span>}
                                        </div>
                                        <div className="textarea-form textarea-input">
                                            <textarea 
                                                className={`form-message ${formErrors.message ? 'error' : ''}`}
                                                name="message"
                                                id="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                placeholder="Enter Message (minimum 10 words) *" 
                                                required
                                            ></textarea>
                                            {formErrors.message && <span className="error-message">{formErrors.message}</span>}
                                        </div>
                                        {formStatus.message && (
                                            <div className={`form-status ${formStatus.type}`}>
                                                {formStatus.message}
                                            </div>
                                        )}
                                        <div className="submit-input">
                                            <button type="submit" className="btn-form-form" onClick={handleSubmit}>Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section id="section_Aboutus" className="Section_About" ref={aboutSectionRef}>
            <div className="about_con">
                <div className="About_us-wid">
                    <div className="hover_thi">
                        <div className="black-img_section"></div>
                        <div className="White-img_section"></div>
                    </div>
                    <div className="bg_width">
                        <div className="bg_width-blue">
                            <div className="upper_section"></div>
                            <div className="below_section"></div>
                            <div className="bg-wid-p" >
                                <div className="matter_about_us">
                                    <div className="tag_h_aboutus">
                                        <h1 className="About_tag">About us</h1>
                                    </div>
                                    <p className="us_matter">
                                        At Astrolite Tech Solution, we are committed to providing professional traders and investors with cutting-edge technology and advanced market analysis tools. Our platform empowers users to make informed decisions through real-time data, powerful indicators, and an intuitive dashboard designed for all levels of experience. Whether you're just starting your trading journey or you're a seasoned professional, Astrolite is here to support your goals and help you stay ahead of market trends.
                                    </p>
                                    <p className="us_mission">
                                        <strong className="color_bgour">Our Mission:</strong> To revolutionize the trading experience by offering an all-in-one platform that makes market analysis easy, fast, and efficient. We strive to empower traders with the tools and insights they need to succeed.
                                    </p>
                                    <p className="us_vision">
                                        <strong className="color_bgour">Our Vision:</strong> To become the leading technology provider for traders worldwide, delivering unmatched trading solutions with a focus on real-time analysis and superior performance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </section>

            <footer className="footer">
                <div className="link_uyi">
                    <div className="bubble-container">
                        <span className="bubble"></span>
                        <span className="bubble"></span>
                        <span className="bubbles"></span>
                        <span className="bubbles"></span>
                        <span className="bubble"></span>
                        <span className="bubbles"></span>
                        <span className="bubble"></span>
                        <span className="bubble"></span>
                        <span className="bubbles"></span>
                        <span className="bubbles"></span>
                        <span className="bubble"></span>
                        <span className="bubbles"></span>
                        <span className="bubble"></span>
                        <span className="bubbles"></span>
                        <span className="bubble"></span>
                        <span className="bubble"></span>
                        <span className="bubble"></span>
                        <span className="bubbles"></span>
                        <span className="bubbles"></span>
                        <span className="bubbles"></span>
                    </div>

                    <div className="Link_olk">
                        <div className="grid_link">
                            <div className="grid_first">
                                <div className="img_gr_f">
                                    <img src="https://bhargav1376.github.io/trading/src/index/images/Logo.png" alt="Logo" />
                                </div>
                            </div>
                            <div className="grid_second">
                                <div className="links_im">
                                    <h3 className="Links_pr">Quick Links</h3>
                                    <div className="links">
                                        <a className="ind_kol" href="./indicators">Indicators</a>
                                        <a className="ind_kol" href="./dashboard">Dashboard</a>
                                        <a className="ind_kol" href="./about">About Us</a>
                                    </div>
                                </div>
                            </div>
                            <div className="grid_third">
                                <div className="Contact_us">
                                    <h3 className="Links_pr">Contact Us</h3>
                                    <p className="email_con">
                                        <i id="enb" className="fas fa-envelope"></i> support@ats-trading.com
                                    </p>
                                    <p className="email_con">
                                        <i id="phone_io" className="fas fa-phone-alt"></i> +91-12345-67890
                                    </p>
                                    <p className="email_con">
                                        <i id="enb" className="fas fa-map-marker-alt"></i> Bengaluru, India
                                    </p>
                                </div>
                            </div>
                            <div className="grid_four">
                                <div className="Contact_us">
                                    <h3 className="Links_pr">Follow Us</h3>
                                    <div className="social_links_p">
                                        <div className="two_grid">
                                            <a href="https://facebook.com" className="social_media"><i className="fa-brands fa-facebook-f"></i></a>
                                            <a href="https://twitter.com" className="social_media"><i className="fa-brands fa-twitter"></i></a>
                                        </div>
                                        <div className="two_ico">
                                            <a href="https://instagram.com" className="social_media"><i className="fa-brands fa-instagram"></i></a>
                                            <a href="https://linkedin.com" className="social_media"><i className="fa-brands fa-linkedin-in"></i></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="line_hr">
                            <hr className="custom-line" />
                        </div>

                        <div className="center_foottr">
                            <p className="right_re">© 2025 Astrolite Tech Solutions | All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>

            <div className="scroll_btn">
                <div className="btn_top">
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} id="scrollmyBtn" title="Go to top">↑</button>
                </div>
            </div>
            <SuccessModal />

            {showLoginDiv && (
                <div className='ab-login'>
                    <div className='close_btn'>
                        <button className='Close_btn_Sl' onClick={handleCloseLogin}>X</button>
                    </div>
                    <div className='Btns_log-sign'>
                        <div className='Btn_class-con'>
                            <button className='Btn_class-con-btn' onClick={() => window.location.href = '/bhargav1376/trading.git/signin'}>Sign In</button>
                        </div>
                        <div className='span_line'>/</div>
                        <div className='Btn_class-con'>
                            <button className='Btn_class-con-btn' onClick={() => window.location.href = '/bhargav1376/trading.git/signup'}>Sign Up</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Home;