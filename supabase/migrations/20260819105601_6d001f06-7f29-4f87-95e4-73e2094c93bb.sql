INSERT INTO public.courses (name, slug, short_description, description, duration, fee, category, syllabus, requirements, is_featured, sort_order) VALUES
('Basic Computer Course','basic-computer','Learn computer fundamentals, Windows, MS Office and internet from scratch.','A complete beginner-friendly course covering computer fundamentals, typing, Windows operation, MS Word, MS Excel, MS PowerPoint, email and internet usage. Ideal for students, job seekers and anyone starting their digital journey.','3 Months',6500,'Basic',ARRAY['Computer Fundamentals','Windows Operation','MS Word','MS Excel','MS PowerPoint','Internet & Email','Typing Practice'],ARRAY['No prior experience required','Basic reading and writing skills'],true,1),
('Diploma in Computer Application','dca','A professional diploma covering office packages, accounting and computer operation.','DCA is a job-oriented diploma covering the complete office package, computer operation, basic accounting, internet technologies and practical project work.','6 Months',14000,'Diploma',ARRAY['Computer Fundamentals','MS Office Advanced','Computerised Accounting','Internet Technologies','Hardware Basics','Project Work'],ARRAY['Basic computer knowledge preferred','SEE appeared or above'],true,2),
('Graphic Design','graphic-design','Master Photoshop, Illustrator and CorelDRAW for professional design work.','Learn professional graphic design with Adobe Photoshop, Adobe Illustrator and CorelDRAW. Covers layout, typography, branding, printing preparation and a portfolio project.','4 Months',15000,'Design',ARRAY['Design Principles','Adobe Photoshop','Adobe Illustrator','CorelDRAW','Typography & Layout','Portfolio Project'],ARRAY['Basic computer operation'],true,3),
('Web Development','web-development','Build modern responsive websites with HTML, CSS, JavaScript and React.','A practical web development course taking you from HTML and CSS to JavaScript and React. Includes responsive design, version control and a final deployed project.','6 Months',22000,'Programming',ARRAY['HTML5 & CSS3','Responsive Design','JavaScript','Git & GitHub','React Basics','Final Project'],ARRAY['Basic computer knowledge','Interest in programming'],true,4),
('Computerised Accounting','computerised-accounting','Practical accounting training with Tally and Excel for real business work.','Learn practical bookkeeping and computerised accounting using Tally along with Excel reporting, VAT handling and inventory management.','3 Months',12000,'Accounting',ARRAY['Accounting Basics','Tally Prime','Ledger & Vouchers','VAT & Taxation Basics','Inventory Management','Excel Reporting'],ARRAY['Basic mathematics','Basic computer operation'],false,5),
('Nepali & English Typing','typing-course','Build professional typing speed and accuracy in both Nepali and English.','A focused typing course to build speed and accuracy in Nepali (Preeti / Unicode) and English typing, with daily measured practice and progress tracking.','1.5 Months',4500,'Basic',ARRAY['Keyboard Mastery','English Typing Drills','Nepali Typing (Preeti/Unicode)','Speed Building','Accuracy Training','Speed Test Preparation'],ARRAY['No prior experience required'],false,6),
('Hardware & Networking','hardware-networking','Assemble, repair and network computers with hands-on lab practice.','Hands-on training in computer assembling, troubleshooting, OS installation, printer handling and LAN networking with practical lab sessions.','4 Months',16000,'Technical',ARRAY['Computer Assembling','Troubleshooting','OS Installation','Printer & Peripherals','LAN Networking','Practical Lab'],ARRAY['Basic computer knowledge'],false,7);

INSERT INTO public.gallery_categories (name, sort_order) VALUES ('Classroom',1),('Computer Lab',2),('Events',3),('Certificate Distribution',4),('Students',5);

INSERT INTO public.facilities (title, description, icon, sort_order) VALUES
('Modern Computer Lab','Well-equipped lab with modern computers so every student practises on their own machine.','Monitor',1),
('High-Speed Internet','Reliable broadband connection available throughout the institute during class hours.','Wifi',2),
('Experienced Instructors','Patient, experienced instructors who teach step by step in Nepali and English.','GraduationCap',3),
('Practical Training','Every topic is taught with hands-on practice, not just theory.','Laptop',4),
('Project-Based Learning','Students complete real projects to build confidence and a portfolio.','FolderKanban',5),
('Course Certificate','Students receive an institute certificate on successful course completion.','BadgeCheck',6),
('Career Guidance','Guidance on resume writing, interview preparation and next learning steps.','Briefcase',7),
('Flexible Time Slots','Morning, day and evening shifts to suit students and working professionals.','Clock',8);

INSERT INTO public.teachers (name, position, qualification, experience, bio, sort_order) VALUES
('Bhumiraj Sharma','Principal / Senior Instructor','BCA','10+ years','Founder and principal instructor, specialising in computer fundamentals and office applications.',1),
('Sunita Adhikari','Graphic Design Instructor','BBS, Adobe Certified Training','6 years','Teaches Photoshop, Illustrator and CorelDRAW with a strong focus on practical design work.',2),
('Ramesh Thapa','Web Development Instructor','BSc CSIT','5 years','Full-stack developer who guides students from HTML basics to building React applications.',3),
('Anjali Karki','Accounting Instructor','MBS','7 years','Specialises in Tally and computerised accounting with real business case practice.',4);

INSERT INTO public.testimonials (name, course, message, rating, is_featured) VALUES
('Prakash Bhattarai','Diploma in Computer Application','I joined with almost no computer knowledge. The instructors were patient and today I work as an office assistant handling all documentation myself.',5,true),
('Sarita Gurung','Graphic Design','The practical classes were the best part. I built a portfolio during the course and started freelancing right after finishing.',5,true),
('Bibek Shrestha','Web Development','Clear teaching and real projects. I understood JavaScript properly here after struggling with online videos.',5,true),
('Manisha Rai','Nepali & English Typing','My typing speed went from 15 WPM to over 45 WPM. The daily typing tests really helped me improve.',5,true);

INSERT INTO public.passed_students (name, course, completion_year, achievement, testimonial, grade, is_featured) VALUES
('Prakash Bhattarai','Diploma in Computer Application',2025,'Working as Office Assistant','The institute gave me the confidence to work with computers every day.','A',true),
('Sarita Gurung','Graphic Design',2025,'Freelance Graphic Designer','I learned everything hands-on and now design for local businesses.','A+',true),
('Bibek Shrestha','Web Development',2024,'Junior Web Developer','Project-based learning made all the difference for me.','A',true),
('Manisha Rai','Nepali & English Typing',2025,'45+ WPM Typing Speed','Daily practice tests improved my speed and accuracy a lot.','A+',true),
('Dipesh Lamichhane','Computerised Accounting',2024,'Accounts Assistant','Tally training here was very practical and job-focused.','B+',false),
('Kritika Poudel','Basic Computer Course',2025,'Continued to DCA','A great starting point for someone with zero computer knowledge.','A',false);

INSERT INTO public.news (title, slug, excerpt, content, category, is_featured) VALUES
('New Batch for Graphic Design Starting Soon','new-graphic-design-batch','A fresh Graphic Design batch begins with limited seats for hands-on lab practice.','A new Graphic Design batch is starting at Bhumiraj Computer Institute. The course covers Adobe Photoshop, Adobe Illustrator and CorelDRAW with individual computer practice for every student. Seats are limited to keep the lab comfortable, so early enrolment is recommended. Visit the institute or apply online through the admission form.','Announcement',true),
('Typing Speed Challenge for Students','typing-speed-challenge','Students can now practise and compete on the online typing test available on our website.','Our online typing test is now live on the website. Students can practise in English and Nepali across multiple time modes, track their words per minute and accuracy, and compare progress on the leaderboard. Creating a free account saves your history, XP and badges.','News',true),
('Certificate Distribution for DCA Graduates','dca-certificate-distribution','Certificates were distributed to the students who completed the DCA programme.','A certificate distribution programme was held at the institute for students who successfully completed the Diploma in Computer Application. Students shared their learning experience and future study plans during the programme.','Event',false);

INSERT INTO public.notices (title, content, is_important) VALUES
('Admission Open for All Courses','Admissions are currently open for all courses. Morning, day and evening shifts are available. Please contact the institute or apply through the online admission form.',true),
('Institute Closed on Public Holidays','The institute will remain closed on national public holidays. Missed classes will be adjusted in the following week.',false),
('Bring Your Own Notebook','Students are requested to bring a notebook for practical class notes.',false);

INSERT INTO public.events (title, description, location, event_date) VALUES
('Free Computer Awareness Class','A free introductory session on computer basics and internet safety, open to everyone in the community.','Bhumiraj Computer Institute', now() + interval '14 days'),
('Typing Competition','An in-house typing competition for enrolled students in English and Nepali categories.','Bhumiraj Computer Institute', now() + interval '30 days');

INSERT INTO public.typing_texts (title, language, difficulty, content) VALUES
('Everyday Words','english','beginner','the quick brown fox jumps over the lazy dog and runs back home again with a smile on its face while the sun sets slowly behind the green hills near the small quiet village where children play in the open field every evening after school'),
('Simple Sentences','english','beginner','a computer is a machine that helps people work faster and learn new things every day it can store notes send messages show pictures and connect us with friends who live far away from our own town'),
('Office Practice','english','intermediate','Effective office communication depends on clarity, accuracy and timing. A well written email states its purpose in the first sentence, provides the necessary details in short paragraphs, and closes with a clear request or next step for the reader.'),
('Technology Today','english','intermediate','Modern technology has changed the way students learn. Online resources, practice software and digital notes allow learners to revise at their own pace, while classroom practice ensures that fundamental skills are built correctly from the beginning.'),
('Advanced Passage','english','advanced','Proficiency in typing is not merely about speed; it is the disciplined coordination of memory, rhythm and posture. Experienced typists rarely glance at the keyboard, because their fingers have internalised the layout through consistent, deliberate repetition — punctuation, capitalisation and numerals (such as 1,250 or 47%) included.'),
('Programming Concepts','english','advanced','A well-designed function should do exactly one thing, and its name should describe that thing precisely. When a developer reads `calculateMonthlyFee(student)`, no additional comment is required; the intent is obvious, the inputs are explicit, and the return value is predictable across every call site.'),
('सामान्य अभ्यास','nepali','beginner','नेपाल एक सुन्दर देश हो। यहाँ हिमाल पहाड र तराई छन्। हामी सबै मिलेर देशको विकास गर्न सक्छौं। शिक्षा नै उन्नतिको आधार हो।'),
('कम्प्युटर परिचय','nepali','intermediate','कम्प्युटर एउटा विद्युतीय यन्त्र हो जसले तथ्याङ्क लिन्छ, प्रशोधन गर्छ र नतिजा दिन्छ। आजको समयमा कार्यालय, विद्यालय र व्यापारमा कम्प्युटरको प्रयोग अत्यावश्यक भइसकेको छ।'),
('उन्नत अभ्यास','nepali','advanced','सूचना प्रविधिको विकाससँगै हाम्रो दैनिक जीवनशैलीमा उल्लेखनीय परिवर्तन आएको छ। डिजिटल साक्षरता अब विकल्प होइन, आवश्यकता बनिसकेको छ; त्यसैले प्रत्येक विद्यार्थीले आधारभूत कम्प्युटर सीप सिक्नु अनिवार्य छ।');

INSERT INTO public.achievements (code, title, description, icon, xp_reward, sort_order) VALUES
('first_test','First Test','Complete your very first typing test.','Rocket',50,1),
('speed_beginner','Speed Beginner','Reach 30 WPM in a typing test.','Gauge',75,2),
('speed_pro','Speed Pro','Reach 60 WPM in a typing test.','Zap',150,3),
('speed_master','Speed Master','Reach 80 WPM in a typing test.','Flame',300,4),
('accuracy_95','Sharp Shooter','Finish a test with 95% accuracy or higher.','Target',100,5),
('accuracy_100','Flawless','Finish a test with 100% accuracy.','Crosshair',250,6),
('streak_7','7 Day Streak','Practise typing seven days in a row.','CalendarCheck',200,7),
('tests_50','Dedicated Typist','Complete 50 typing tests.','Trophy',300,8);

INSERT INTO public.site_settings (key, value) VALUES
('institute_name','Bhumiraj Computer Institute'),
('tagline','Practical computer training for real-world skills'),
('logo_url',''),
('phone','+977 9800000000'),
('whatsapp','+977 9800000000'),
('email','info@bhumirajcomputer.edu.np'),
('address','Main Road, Nepal'),
('opening_hours','Sunday – Friday, 6:00 AM – 6:00 PM'),
('facebook_url',''),
('instagram_url',''),
('youtube_url',''),
('map_embed_url',''),
('hero_title','Learn computer skills that actually get used'),
('hero_subtitle','Hands-on training in office applications, design, accounting, web development and typing — taught step by step, with a computer for every student.'),
('hero_image_url',''),
('announcement','Admissions are open for all courses. Morning, day and evening shifts available.'),
('footer_text','Bhumiraj Computer Institute provides practical, affordable computer training for students, job seekers and professionals.');

INSERT INTO public.page_content (page, section, title, body, sort_order) VALUES
('about','intro','About Bhumiraj Computer Institute','Bhumiraj Computer Institute is a community computer training centre focused on practical, job-oriented skills. We teach computer fundamentals, office applications, graphic design, accounting, web development and professional typing. Our classes are small so that every student gets a computer and personal attention from the instructor.',1),
('about','mission','Our Mission','To make quality, practical computer education accessible and affordable for every learner in our community, regardless of their starting point.',2),
('about','vision','Our Vision','To be the training centre our community trusts first when someone wants to build real digital skills.',3),
('about','objectives','Our Objectives','Teach every topic with hands-on practice.
Keep class sizes small enough for personal attention.
Prepare students for real office and freelance work.
Support learners in both Nepali and English.
Keep course content updated with current tools.',4),
('about','approach','Our Training Approach','Every class combines a short concept explanation with immediate practice on the computer. Students work through real tasks — documents, spreadsheets, designs, accounts or code — instead of memorising theory. Progress is reviewed regularly and revision time is built into every course.',5),
('about','why','Why Students Choose Us','One computer per student during practice sessions.
Patient instruction in Nepali and English.
Flexible morning, day and evening shifts.
Project work that builds a real portfolio.
Ongoing guidance after course completion.',6),
('home','why','Why Choose Bhumiraj','We focus on what students can actually do at the end of the course, not on how many chapters were covered.',1);