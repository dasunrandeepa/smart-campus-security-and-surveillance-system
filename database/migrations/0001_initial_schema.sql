CREATE TABLE surveillance_alerts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,                          -- e.g., suspicious_activity, motion_after_hours
    label TEXT,                                  -- e.g., person, unknown object
    confidence FLOAT,                            -- confidence score from YOLO
    location TEXT NOT NULL,                      -- e.g., Gate A, Zone B
    timestamp TIMESTAMPTZ DEFAULT now(),         -- time of the alert
    status TEXT DEFAULT 'new' NOT NULL,          -- new, investigating, resolved
    team_dispatched BOOLEAN DEFAULT false,       -- whether a security team has been dispatched
    team_dispatch_time TIMESTAMPTZ,              -- when the team was dispatched
    resolution_time TIMESTAMPTZ                  -- when the alert was resolved
); 