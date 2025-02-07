CREATE INDEX idx_review_email_hash ON review(email_hash);
CREATE INDEX idx_review_status ON review(status);
CREATE INDEX idx_course_school ON course(school);
CREATE INDEX idx_course_area ON course(area);
CREATE INDEX idx_review_cover ON review(course_sigle, liked, estimated_credits);
