CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    degree VARCHAR(100),
    branch VARCHAR(100),
    cgpa DECIMAL(3,2),
    graduation_year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE jobs (
    job_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,

    title VARCHAR(200) NOT NULL,
    job_type VARCHAR(50),
    location VARCHAR(150),
    description TEXT,

    application_deadline DATE,
    application_link VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_jobs_company
        FOREIGN KEY (company_id)
        REFERENCES companies(company_id)
        ON DELETE CASCADE
);


CREATE TABLE eligibility_criteria (
    eligibility_id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL,

    criterion_type VARCHAR(50) NOT NULL,
    criterion_value VARCHAR(255) NOT NULL,

    CONSTRAINT fk_eligibility_job
        FOREIGN KEY (job_id)
        REFERENCES jobs(job_id)
        ON DELETE CASCADE
);


CREATE TABLE recruitment_events (
    event_id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL,

    event_type VARCHAR(50) NOT NULL,
    event_date DATE,
    description TEXT,

    CONSTRAINT fk_event_job
        FOREIGN KEY (job_id)
        REFERENCES jobs(job_id)
        ON DELETE CASCADE
);


CREATE TABLE status_history (
    status_id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,

    status VARCHAR(50) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,

    CONSTRAINT fk_status_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_status_job
        FOREIGN KEY (job_id)
        REFERENCES jobs(job_id)
        ON DELETE CASCADE
);


CREATE TABLE updates (
    update_id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,

    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_update_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_update_job
        FOREIGN KEY (job_id)
        REFERENCES jobs(job_id)
        ON DELETE CASCADE
);