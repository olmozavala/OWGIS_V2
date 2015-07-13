-- This view has all the moorings positions and
-- the corresponding PI
CREATE OR REPLACE VIEW moorings_view AS 
SELECT m.mooring_id as name, event_date as evdate, 
    p.first_name as pi_name, p.last_name as pi_last, 
        geom as geom
        FROM mooring as m
        JOIN events as e on e.event_id = m.deployment_event_id
        JOIN sites as s on e.site_id = s.site_id
        JOIN peoplemooring as pm on m.mooring_id = pm.mooring_id
        JOIN people as p on pm.people_id = p.people_id
        WHERE s.geom <> ''
        ORDER BY m.mooring_id;

-- This view has all the moorings positions and
-- the corresponding device associated with the mooring.
CREATE OR REPLACE VIEW moorings_device_view AS 
SELECT m.mooring_id as name, md.device_type as mtype,
    nominal_depth as depth,
    geom as geom
    FROM mooring as m
    JOIN events as e on e.event_id = m.deployment_event_id
    JOIN sites as s on e.site_id = s.site_id
    JOIN mooring_devices as md on m.mooring_id = md.mooring_id
    WHERE s.geom <> ''
    ORDER BY m.mooring_id;

