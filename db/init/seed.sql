INSERT INTO users (username,password,role) VALUES ('teacher1','pass','teacher') ON DUPLICATE KEY UPDATE role=VALUES(role);
INSERT INTO assignments (title,due,status) VALUES ('第一次作业','2025-10-10','进行中'),('第二次作业','2025-10-15','已截止');
INSERT INTO messages (text,read_flag) VALUES ('学生A提交了作业1',0),('学生B请假申请待审批',0);
