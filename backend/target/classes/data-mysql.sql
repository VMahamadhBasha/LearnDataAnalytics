-- Seed Roles if they do not exist
INSERT IGNORE INTO roles (id, name) VALUES (1, 'ROLE_STUDENT');
INSERT IGNORE INTO roles (id, name) VALUES (2, 'ROLE_ADMIN');

-- Seed Admin User (Username: admin, Email: admin@ldawspt.com, Password: admin123)
-- BCrypt of 'admin123' is '$2a$10$X86ZUXrG/a6sA7G6yJkPiu4E72d4l5tO/Bovv69tGle9k4HhR4fJ2'
INSERT IGNORE INTO users (id, username, email, password, first_name, last_name, is_active, created_at, updated_at) 
VALUES (1, 'admin', 'admin@ldawspt.com', '$2a$10$X86ZUXrG/a6sA7G6yJkPiu4E72d4l5tO/Bovv69tGle9k4HhR4fJ2', 'System', 'Administrator', true, NOW(), NOW());

-- Map Admin User to ROLE_ADMIN
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (1, 2);

-- Map Admin User to ROLE_STUDENT (so admins can preview courses as student progress)
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (1, 1);

-- Seed Sample Courses
-- 1. SQL for Data Analytics
INSERT IGNORE INTO courses (id, title, description, category, difficulty_level, image_url, is_published, created_at, updated_at)
VALUES (1, 'SQL for Data Analytics', 'Master SQL from basics to advanced queries, window functions, and execution plans for analytic datasets.', 'SQL', 'BEGINNER', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600&auto=format&fit=crop', true, NOW(), NOW());

-- 2. Snowflake Cloud Data Warehousing
INSERT IGNORE INTO courses (id, title, description, category, difficulty_level, image_url, is_published, created_at, updated_at)
VALUES (2, 'Snowflake Cloud Data Warehousing', 'Learn architecture, data loading, virtual warehouses, zero-copy cloning, and performance optimization on Snowflake.', 'SNOWFLAKE', 'INTERMEDIATE', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop', true, NOW(), NOW());

-- 3. Python for Data Analytics
INSERT IGNORE INTO courses (id, title, description, category, difficulty_level, image_url, is_published, created_at, updated_at)
VALUES (3, 'Python for Data Analytics', 'Master Python, Pandas, NumPy, and Matplotlib to clean, transform, and visualize enterprise datasets.', 'PYTHON', 'BEGINNER', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop', true, NOW(), NOW());

-- 4. Power BI Desktop & DAX Mastery
INSERT IGNORE INTO courses (id, title, description, category, difficulty_level, image_url, is_published, created_at, updated_at)
VALUES (4, 'Power BI Desktop & DAX Mastery', 'Build stunning interactive dashboards, model business databases, and write advanced DAX formulas in Power BI.', 'POWER_BI', 'INTERMEDIATE', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop', true, NOW(), NOW());

-- 5. Tableau Visual Analytics
INSERT IGNORE INTO courses (id, title, description, category, difficulty_level, image_url, is_published, created_at, updated_at)
VALUES (5, 'Tableau Visual Analytics', 'Connect to diverse data sources, design professional sheets and dashboards, and perform storytelling with Tableau.', 'TABLEAU', 'BEGINNER', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop', true, NOW(), NOW());

-- 6. ETL Pipelines & Data Warehousing
INSERT IGNORE INTO courses (id, title, description, category, difficulty_level, image_url, is_published, created_at, updated_at)
VALUES (6, 'ETL Pipelines & Data Warehousing Fundamentals', 'Learn Kimball dimensional modeling, dimension/fact table designs, ETL vs ELT pipelines, and orchestration.', 'ETL', 'ADVANCED', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop', true, NOW(), NOW());


-- Modules for SQL (Course 1)
INSERT IGNORE INTO modules (id, course_id, title, description, order_index, created_at, updated_at)
VALUES (11, 1, 'Introduction to SQL and Databases', 'Understanding relational models and basic SQL syntax.', 1, NOW(), NOW());
INSERT IGNORE INTO modules (id, course_id, title, description, order_index, created_at, updated_at)
VALUES (12, 1, 'Aggregations and Grouping', 'Aggregating records and summary reports.', 2, NOW(), NOW());
INSERT IGNORE INTO modules (id, course_id, title, description, order_index, created_at, updated_at)
VALUES (13, 1, 'Subqueries, CTEs, and Window Functions', 'Advanced analytical SQL queries.', 3, NOW(), NOW());

-- Lessons for SQL Module 1
INSERT IGNORE INTO lessons (id, module_id, title, description, content_type, youtube_video_id, pdf_url, practice_file_url, order_index, duration_minutes, created_at, updated_at)
VALUES (111, 11, 'Relational Database Concepts', 'Introduction to tables, records, keys, and schemas.', 'VIDEO', 'HXTF2A7iC38', NULL, NULL, 1, 12, NOW(), NOW());
INSERT IGNORE INTO lessons (id, module_id, title, description, content_type, youtube_video_id, pdf_url, practice_file_url, order_index, duration_minutes, created_at, updated_at)
VALUES (112, 11, 'Basic SELECT Statements', 'Writing SELECT, WHERE, and ORDER BY queries.', 'VIDEO', 'JC2M_Suhh2M', 'https://example.com/notes/sql-basics.pdf', 'https://example.com/files/sql-practice-1.sql', 2, 18, NOW(), NOW());

-- Lessons for SQL Module 2
INSERT IGNORE INTO lessons (id, module_id, title, description, content_type, youtube_video_id, pdf_url, practice_file_url, order_index, duration_minutes, created_at, updated_at)
VALUES (121, 12, 'COUNT, SUM, AVG, MIN, MAX', 'Aggregating values across tables.', 'VIDEO', 'zZ3_5P_4bQ0', NULL, NULL, 1, 15, NOW(), NOW());
INSERT IGNORE INTO lessons (id, module_id, title, description, content_type, youtube_video_id, pdf_url, practice_file_url, order_index, duration_minutes, created_at, updated_at)
VALUES (122, 12, 'GROUP BY & HAVING Clauses', 'Grouping data and filtering aggregated records.', 'VIDEO', '83v8SJ19W0s', 'https://example.com/notes/sql-grouping.pdf', NULL, 2, 22, NOW(), NOW());

-- Lessons for SQL Module 3
INSERT IGNORE INTO lessons (id, module_id, title, description, content_type, youtube_video_id, pdf_url, practice_file_url, order_index, duration_minutes, created_at, updated_at)
VALUES (131, 13, 'Window Functions Demystified', 'ROW_NUMBER, RANK, DENSE_RANK, and SUM() OVER.', 'VIDEO', 'Ww71knvhQ-s', 'https://example.com/notes/sql-window-functions.pdf', 'https://example.com/files/sql-practice-3.sql', 1, 30, NOW(), NOW());


-- Modules for Snowflake (Course 2)
INSERT IGNORE INTO modules (id, course_id, title, description, order_index, created_at, updated_at)
VALUES (21, 2, 'Getting Started with Snowflake', 'Snowflake architecture, cloud concept, and UI navigation.', 1, NOW(), NOW());
INSERT IGNORE INTO modules (id, course_id, title, description, order_index, created_at, updated_at)
VALUES (22, 2, 'Virtual Warehouses & Scaling', 'Managing compute power and costs.', 2, NOW(), NOW());

-- Lessons for Snowflake Module 1
INSERT IGNORE INTO lessons (id, module_id, title, description, content_type, youtube_video_id, pdf_url, practice_file_url, order_index, duration_minutes, created_at, updated_at)
VALUES (211, 21, 'Snowflake Unique Architecture', 'Explaining Database Storage, Query Processing, and Cloud Services.', 'VIDEO', '3_5Z06YhX2M', 'https://example.com/notes/snowflake-architecture.pdf', NULL, 1, 15, NOW(), NOW());
INSERT IGNORE INTO lessons (id, module_id, title, description, content_type, youtube_video_id, pdf_url, practice_file_url, order_index, duration_minutes, created_at, updated_at)
VALUES (212, 21, 'Creating Tables & Copy Commands', 'How to load structured and semi-structured datasets.', 'VIDEO', 'Ldwspt-sf-load', NULL, 'https://example.com/files/snowflake-seeding.sql', 2, 20, NOW(), NOW());

-- Lessons for Snowflake Module 2
INSERT IGNORE INTO lessons (id, module_id, title, description, content_type, youtube_video_id, pdf_url, practice_file_url, order_index, duration_minutes, created_at, updated_at)
VALUES (221, 22, 'Sizing & Suspending Warehouses', 'Best practices for managing virtual warehouse size and auto-suspend.', 'VIDEO', 'Ldwspt-sf-compute', 'https://example.com/notes/snowflake-wh-best-practices.pdf', NULL, 1, 18, NOW(), NOW());


-- Modules for Python (Course 3)
INSERT IGNORE INTO modules (id, course_id, title, description, order_index, created_at, updated_at)
VALUES (31, 3, 'Python Basics for Data', 'Basic variables, loops, and custom functions.', 1, NOW(), NOW());
INSERT IGNORE INTO modules (id, course_id, title, description, order_index, created_at, updated_at)
VALUES (32, 3, 'Pandas Library Essentials', 'Dataframes, selection, filtering, and cleaning.', 2, NOW(), NOW());

-- Lessons for Python Module 1
INSERT IGNORE INTO lessons (id, module_id, title, description, content_type, youtube_video_id, pdf_url, practice_file_url, order_index, duration_minutes, created_at, updated_at)
VALUES (311, 31, 'Variables, Lists, and Dicts', 'Working with dynamic core data structures.', 'VIDEO', 'rfscVS0vtbw', NULL, NULL, 1, 25, NOW(), NOW());

-- Lessons for Python Module 2
INSERT IGNORE INTO lessons (id, module_id, title, description, content_type, youtube_video_id, pdf_url, practice_file_url, order_index, duration_minutes, created_at, updated_at)
VALUES (321, 32, 'Introduction to DataFrames', 'Loading CSV files, reading headers, and columns.', 'VIDEO', 'F6kmIpWWEdU', 'https://example.com/notes/pandas-df-intro.pdf', 'https://example.com/files/pandas-practice.ipynb', 1, 35, NOW(), NOW());
