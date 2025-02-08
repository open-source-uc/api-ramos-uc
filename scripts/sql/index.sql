DROP INDEX IF EXISTS idx_review_email_hash;
CREATE INDEX idx_review_email_hash ON review(email_hash);

DROP INDEX IF EXISTS idx_review_status;
CREATE INDEX idx_review_status ON review(status);

DROP INDEX IF EXISTS idx_course_sigle;
CREATE INDEX idx_course_sigle ON course(sigle);

DROP INDEX IF EXISTS idx_course_school;
CREATE INDEX idx_course_school ON course(school);

DROP INDEX IF EXISTS idx_review_cover;
CREATE INDEX idx_review_cover ON review(course_sigle, liked, estimated_credits);

DROP INDEX IF EXISTS idx_review_liked;
CREATE INDEX idx_review_liked ON review(liked);

DROP INDEX IF EXISTS idx_review_estimated_credits;
CREATE INDEX idx_review_estimated_credits ON review(estimated_credits);

DROP INDEX IF EXISTS idx_course_reviews_avg_sigle_school;
CREATE INDEX idx_course_reviews_avg_sigle_school ON course_reviews_avg (sigle, school);

DROP INDEX IF EXISTS idx_course_reviews_avg_sigle_area;
CREATE INDEX idx_course_reviews_avg_sigle_area ON course_reviews_avg (sigle, area);

DROP INDEX IF EXISTS idx_course_reviews_avg_sigle_promedio;
CREATE INDEX idx_course_reviews_avg_sigle_promedio ON course_reviews_avg (sigle, promedio);
