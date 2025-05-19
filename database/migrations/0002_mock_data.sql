-- Insert mock data for surveillance alerts
INSERT INTO surveillance_alerts (type, label, confidence, location, timestamp, status, team_dispatched, team_dispatch_time, resolution_time) VALUES
    ('suspicious_activity', 'person', 0.95, 'Main Gate', NOW() - INTERVAL '5 minutes', 'new', false, NULL, NULL),
    ('motion_after_hours', 'unknown', 0.82, 'Science Block', NOW() - INTERVAL '15 minutes', 'investigating', true, NOW() - INTERVAL '10 minutes', NULL),
    ('suspicious_activity', 'person', 0.88, 'Parking Lot A', NOW() - INTERVAL '30 minutes', 'resolved', true, NOW() - INTERVAL '25 minutes', NOW() - INTERVAL '5 minutes'),
    ('motion_after_hours', 'vehicle', 0.75, 'Back Gate', NOW() - INTERVAL '45 minutes', 'new', false, NULL, NULL),
    ('suspicious_activity', 'person', 0.92, 'Library Entrance', NOW() - INTERVAL '1 hour', 'investigating', true, NOW() - INTERVAL '55 minutes', NULL),
    ('motion_after_hours', 'unknown', 0.68, 'Dormitory Area', NOW() - INTERVAL '2 hours', 'resolved', true, NOW() - INTERVAL '1 hour 45 minutes', NOW() - INTERVAL '1 hour 30 minutes'),
    ('suspicious_activity', 'vehicle', 0.85, 'Staff Parking', NOW() - INTERVAL '3 hours', 'new', false, NULL, NULL),
    ('motion_after_hours', 'person', 0.91, 'Cafeteria', NOW() - INTERVAL '4 hours', 'resolved', true, NOW() - INTERVAL '3 hours 45 minutes', NOW() - INTERVAL '3 hours 30 minutes'),
    ('suspicious_activity', 'unknown', 0.79, 'Sports Complex', NOW() - INTERVAL '5 hours', 'investigating', true, NOW() - INTERVAL '4 hours 55 minutes', NULL),
    ('motion_after_hours', 'person', 0.87, 'Administrative Building', NOW() - INTERVAL '6 hours', 'new', false, NULL, NULL); 