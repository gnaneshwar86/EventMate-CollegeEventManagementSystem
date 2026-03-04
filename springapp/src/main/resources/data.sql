-- =========================
-- STUDENTS
-- =========================

INSERT INTO student (student_id, name, email, phone_number, department, year) VALUES
                                                                                  (1,'Rahul Sharma','rahul.sharma@skcet.ac.in','9876543210','CSE','3'),
                                                                                  (2,'Priya Iyer','priya.iyer@skcet.ac.in','9876543211','IT','2'),
                                                                                  (3,'Arjun Kumar','arjun.kumar@skcet.ac.in','9876543212','ECE','4'),
                                                                                  (4,'Sneha Reddy','sneha.reddy@skcet.ac.in','9876543213','CSE','1'),
                                                                                  (5,'Vikram Patel','vikram.patel@skcet.ac.in','9876543214','MECH','3'),
                                                                                  (6,'Ananya Gupta','ananya.gupta@skcet.ac.in','9876543215','IT','2'),
                                                                                  (7,'Karthik Nair','karthik.nair@skcet.ac.in','9876543216','CSE','4'),
                                                                                  (8,'Meera Joshi','meera.joshi@skcet.ac.in','9876543217','ECE','3'),
                                                                                  (9,'Rohit Singh','rohit.singh@skcet.ac.in','9876543218','IT','1'),
                                                                                  (10,'Divya Menon','divya.menon@skcet.ac.in','9876543219','CSE','2');


-- =========================
-- OLD EVENTS
-- =========================

INSERT INTO event (event_id,event_name,description,date,time,venue,department,current_capacity,capacity,category) VALUES
                                                                                                                      (1,'Smart India Hackathon 2024','National innovation hackathon','2024-02-10','09:00 AM','Main Auditorium','CSE',5,200,'HACKATHON'),

                                                                                                                      (2,'AI & Machine Learning Workshop','Hands-on ML training session','2024-04-15','10:30 AM','Seminar Hall 2','IT',4,120,'WORKSHOP'),

                                                                                                                      (3,'Cloud Computing Conference','Industry experts discussing cloud','2024-06-20','11:00 AM','Conference Hall','CSE',3,150,'CONFERENCE'),

                                                                                                                      (4,'SKCET Cultural Fest 2024','Dance, music and cultural events','2024-08-25','05:00 PM','Open Air Theatre','Cultural Committee',6,500,'CULTURAL');


-- =========================
-- UPCOMING EVENTS
-- =========================

INSERT INTO event (event_id,event_name,description,date,time,venue,department,current_capacity,capacity,category) VALUES
                                                                                                                      (5,'DevOps Bootcamp 2026','CI/CD and Kubernetes workshop','2026-04-10','10:00 AM','Lab 3','CSE',1,100,'WORKSHOP'),

                                                                                                                      (6,'Cyber Security Seminar','Ethical hacking awareness program','2026-05-02','02:00 PM','Seminar Hall 1','IT',1,120,'SEMINAR'),

                                                                                                                      (7,'Inter College Coding Contest','Competitive programming contest','2026-06-12','09:00 AM','Computer Lab','CSE',0,200,'TECHNICAL');


-- =========================
-- REGISTRATIONS (OLD EVENTS)
-- =========================

INSERT INTO registration (registration_id,student_id,event_id,registration_date,attended) VALUES
                                                                                              (1,1,1,'2024-02-01 10:00:00',true),
                                                                                              (2,2,1,'2024-02-01 10:05:00',true),
                                                                                              (3,3,1,'2024-02-01 10:10:00',true),
                                                                                              (4,4,1,'2024-02-01 10:15:00',false),
                                                                                              (5,5,1,'2024-02-01 10:20:00',true),

                                                                                              (6,2,2,'2024-04-10 11:00:00',true),
                                                                                              (7,3,2,'2024-04-10 11:10:00',true),
                                                                                              (8,6,2,'2024-04-10 11:20:00',false),
                                                                                              (9,7,2,'2024-04-10 11:30:00',true),

                                                                                              (10,1,3,'2024-06-10 09:00:00',true),
                                                                                              (11,4,3,'2024-06-10 09:05:00',false),
                                                                                              (12,8,3,'2024-06-10 09:10:00',true),

                                                                                              (13,1,4,'2024-08-10 16:00:00',true),
                                                                                              (14,2,4,'2024-08-10 16:05:00',true),
                                                                                              (15,3,4,'2024-08-10 16:10:00',true),
                                                                                              (16,4,4,'2024-08-10 16:15:00',true),
                                                                                              (17,5,4,'2024-08-10 16:20:00',false),
                                                                                              (18,6,4,'2024-08-10 16:25:00',true);


-- =========================
-- REGISTRATIONS (NEW EVENTS)
-- =========================

INSERT INTO registration (registration_id,student_id,event_id,registration_date,attended) VALUES
                                                                                              (19,7,5,'2026-03-01 09:00:00',false),
                                                                                              (20,8,6,'2026-03-02 10:00:00',false);