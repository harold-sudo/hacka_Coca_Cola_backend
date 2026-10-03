-- 01. Reglas y Constraints Adicionales
ALTER TABLE events ADD CONSTRAINT chk_event_dates CHECK (ends_at > starts_at);
ALTER TABLE events ADD CONSTRAINT chk_event_capacity CHECK (capacity > 0 AND attendance_goal >= 0);
ALTER TABLE events ADD CONSTRAINT chk_overbooking CHECK (overbooking_factor BETWEEN 1.0 AND 1.5);
ALTER TABLE activities ADD CONSTRAINT chk_max_claims CHECK (max_claims_per_user BETWEEN 1 AND 20);
ALTER TABLE interactions ADD CONSTRAINT chk_claim_number CHECK (claim_number >= 1);
ALTER TABLE feedback ADD CONSTRAINT chk_sentiment CHECK (sentiment_score IS NULL OR sentiment_score BETWEEN 1 AND 5);
ALTER TABLE coupon_campaigns ADD CONSTRAINT chk_min_sentiment CHECK (min_sentiment BETWEEN 1 AND 5);

CREATE INDEX IF NOT EXISTS idx_participants_phone_suffix ON participants (right(phone_number, 4));
CREATE INDEX IF NOT EXISTS idx_feedback_topics ON feedback USING GIN (key_topics);

-- 02. Esquema Analytics y Vistas para Power BI (Solución al Fan-Out)
CREATE SCHEMA IF NOT EXISTS analytics;

CREATE OR REPLACE VIEW analytics.vw_event_performance AS
WITH reg AS (
  SELECT r.event_id,
         COUNT(*) FILTER (WHERE r.status IN ('REGISTERED','ATTENDED'))           AS total_registered,
         COUNT(*) FILTER (WHERE r.status = 'ATTENDED')                            AS total_attended,
         COUNT(*) FILTER (WHERE r.status = 'ATTENDED' AND p.is_recurrent)         AS recurrent_attendees
  FROM event_registrations r
  JOIN participants p ON p.id = r.participant_id
  GROUP BY r.event_id
),
inter AS (
  SELECT r.event_id,
         COUNT(DISTINCT i.registration_id) AS attendees_with_interactions,
         COUNT(i.id)                       AS total_interactions
  FROM interactions i
  JOIN event_registrations r ON r.id = i.registration_id
  GROUP BY r.event_id
),
fb AS (
  SELECT r.event_id,
         COUNT(*)                                                    AS feedback_requested,
         COUNT(*) FILTER (WHERE f.status = 'COMPLETED')              AS feedback_completed,
         AVG(f.sentiment_score) FILTER (WHERE f.status = 'COMPLETED') AS avg_sentiment,
         COUNT(*) FILTER (WHERE f.status = 'COMPLETED' AND f.sentiment_score >= 4) AS promoters,
         COUNT(*) FILTER (WHERE f.status = 'COMPLETED' AND f.sentiment_score <= 2) AS detractors,
         COUNT(*) FILTER (WHERE f.status = 'COMPLETED' AND f.purchase_intent)      AS with_purchase_intent
  FROM feedback f
  JOIN event_registrations r ON r.id = f.registration_id
  GROUP BY r.event_id
),
cp AS (
  SELECT r.event_id, COUNT(*) AS coupons_issued
  FROM coupons c JOIN event_registrations r ON r.id = c.registration_id
  GROUP BY r.event_id
)
SELECT
  e.id                         AS event_id,
  e.public_code,
  e.name                       AS event_name,
  e.type                       AS event_type,
  e.status                     AS event_status,
  e.city                       AS event_city,
  (e.starts_at AT TIME ZONE e.timezone)::date AS event_date,
  e.capacity,
  e.attendance_goal,
  COALESCE(reg.total_registered, 0)      AS total_registered,
  COALESCE(reg.total_attended, 0)        AS total_attended,
  ROUND(100.0 * reg.total_attended / NULLIF(reg.total_registered, 0), 2)    AS attendance_rate_pct,
  ROUND(100.0 * reg.total_attended / NULLIF(e.attendance_goal, 0), 2)       AS goal_progress_pct,
  COALESCE(reg.recurrent_attendees, 0)   AS recurrent_attendees,
  ROUND(100.0 * reg.recurrent_attendees / NULLIF(reg.total_attended, 0), 2) AS recurrence_rate_pct,
  COALESCE(inter.attendees_with_interactions, 0) AS attendees_with_interactions,
  ROUND(100.0 * inter.attendees_with_interactions / NULLIF(reg.total_attended, 0), 2) AS engagement_rate_pct,
  COALESCE(inter.total_interactions, 0)  AS total_interactions,
  COALESCE(fb.feedback_requested, 0)     AS feedback_requested,
  COALESCE(fb.feedback_completed, 0)     AS feedback_completed,
  ROUND(100.0 * fb.feedback_completed / NULLIF(fb.feedback_requested, 0), 2) AS feedback_response_rate_pct,
  ROUND(fb.avg_sentiment, 2)             AS avg_sentiment,
  ROUND((fb.avg_sentiment - 1) * 25, 1)  AS sentiment_index_0_100,
  ROUND(100.0 * (fb.promoters - fb.detractors) / NULLIF(fb.feedback_completed, 0), 1) AS net_sentiment_score,
  COALESCE(fb.with_purchase_intent, 0)   AS with_purchase_intent,
  ROUND(100.0 * fb.with_purchase_intent / NULLIF(fb.feedback_completed, 0), 2) AS purchase_intent_rate_pct,
  COALESCE(cp.coupons_issued, 0)         AS coupons_issued
FROM events e
LEFT JOIN reg   ON reg.event_id   = e.id
LEFT JOIN inter ON inter.event_id = e.id
LEFT JOIN fb    ON fb.event_id    = e.id
LEFT JOIN cp    ON cp.event_id    = e.id
WHERE e.status <> 'DRAFT';

CREATE OR REPLACE VIEW analytics.vw_product_sampling AS
WITH s AS (
  SELECT a.event_id, i.product_id, i.registration_id, COUNT(*) AS samples
  FROM interactions i
  JOIN activities a ON a.id = i.activity_id
  WHERE a.category = 'SAMPLING' AND i.product_id IS NOT NULL
  GROUP BY a.event_id, i.product_id, i.registration_id
)
SELECT
  s.event_id,
  pr.id          AS product_id,
  pr.sku,
  pr.name        AS product_name,
  pr.brand_line,
  SUM(s.samples)                       AS total_samples_delivered,
  COUNT(*)                             AS unique_consumers_sampled,
  COUNT(f.id) FILTER (WHERE f.status = 'COMPLETED')                     AS consumers_with_feedback,
  ROUND(AVG(f.sentiment_score) FILTER (WHERE f.status = 'COMPLETED'), 2) AS avg_sentiment_of_samplers,
  COUNT(*) FILTER (WHERE f.likes_product)   AS liked_product,
  COUNT(*) FILTER (WHERE f.purchase_intent) AS with_purchase_intent
FROM s
JOIN products pr ON pr.id = s.product_id
LEFT JOIN feedback f ON f.registration_id = s.registration_id
GROUP BY s.event_id, pr.id, pr.sku, pr.name, pr.brand_line;

CREATE OR REPLACE VIEW analytics.vw_feedback_insights AS
SELECT
  f.id AS feedback_id,
  r.event_id,
  p.age_range,
  p.city,
  p.is_recurrent,
  f.input_type,
  f.sentiment_score,
  f.likes_product,
  f.purchase_intent,
  f.key_topics,
  f.ai_metadata -> 'productsMentioned' AS products_mentioned,
  f.ai_metadata -> 'flavorAttributes'  AS flavor_attributes,
  f.executive_quote,
  f.processed_at
FROM feedback f
JOIN event_registrations r ON r.id = f.registration_id
JOIN participants p ON p.id = r.participant_id
WHERE f.status = 'COMPLETED' AND p.anonymized_at IS NULL;

CREATE OR REPLACE VIEW analytics.vw_audience_demographics AS
SELECT r.event_id, p.age_range, p.city, r.status,
       COUNT(*) AS participants,
       COUNT(*) FILTER (WHERE p.marketing_consent) AS with_marketing_consent
FROM event_registrations r
JOIN participants p ON p.id = r.participant_id
GROUP BY r.event_id, p.age_range, p.city, r.status;
