
--------------- Sites table -----------------------
-- Add the Geometry column into the sites table 
SELECT AddGeometryColumn('sites','geom','4326','POINT','2')


--------------- Cruises table -----------------------
-- Add the Geometry column into the cruises table 
SELECT AddGeometryColumn('cruises','geom','4326','LINESTRING','2')

--------------- Sailbuoy table -----------------------
-- Add the Geometry column into the sailbuoy table 
SELECT AddGeometryColumn('sailbuoy','geom','4326','POINT','2')

-- This function receives a 'cruise_id' and searchs for
-- the sites of that cruise and updates its 'path'
CREATE OR REPLACE FUNCTION createCruisePath(text) RETURNS void AS $$
	
	UPDATE cruises 
	SET geom = (
	SELECT St_MakeLine(sites.track) AS cruisePath FROM(
		SELECT geometry(s.geom) as track
		FROM 
		events as e JOIN activities as a ON e.activity_id = a.activity_id
		JOIN cruises as c ON c.activity_id = a.activity_id
		JOIN sites as s ON s.site_id = e.site_id
		WHERE c.cruise_id = $1 and s.geom <> ''
		ORDER BY e.event_date
	) AS sites)
	WHERE cruise_id = $1

$$ LANGUAGE SQL;



------------------------ VIEWS ------------------
-- This view has all the cruises
CREATE OR REPLACE VIEW all_cruises AS 
SELECT (ROW_NUMBER() OVER (ORDER BY c.cruise_id ASC)) % 10 as color,
    c.cruise_id as id, c.depart_date as dep, 
    c.return_date as ret, c.geom,
    p.first_name || ' ' || p.last_name as name,
    EXTRACT(YEAR from c.depart_date) as year
FROM cruises as c
JOIN people as p on c.chief_scientist = p.people_id
WHERE c.geom <> ''

-- This view has all the sites and all the events
-- realized on each site. The results are order by date
CREATE OR REPLACE VIEW sites_events AS 
SELECT a.activity_id,       e.event_type_id,        s.name as site, 
       e.event_id as event, e.event_date as date,   et.name as event_type, 
       s.geom, EXTRACT(YEAR from e.event_date) as year
FROM sites as s 
JOIN events as e on e.site_id = s.site_id
JOIN eventtype as et on e.event_type_id = et.event_type_id
JOIN activities as a on a.activity_id = e.activity_id
WHERE s.geom <> ''
ORDER BY e.event_date DESC

-- This script creates a view with only one row, the
-- path of the sailbuoy
CREATE OR REPLACE VIEW sailbuoypathview AS 
SELECT St_MakeLine(sailbuoy.track) AS sailbuoypath FROM(
	SELECT geometry(s.geom) as track
	FROM 
	sailbuoy as s	
	ORDER BY s.time
) AS sailbuoy;


-- This query builds a view with only two rows, one is the
-- start position of the sailbuoy, and the other one the last position.
CREATE OR REPLACE VIEW sailbuoyendsites AS
(SELECT "time", cttemperature as CT_Temperature, 
	ctconductivity as CT_Conductivity,
	oxy_oxygen as Oxygen, 
	oxy_saturation as Saturation, 
	oxy_temperature as Oxy_Temperature, 
	geom,
	salinity as salinity,
	0 as endpos
 FROM sailbuoy 
        ORDER BY time  LIMIT 1)
UNION
(SELECT "time", cttemperature as CT_Temperature, 
	ctconductivity as CT_Conductivity,
	oxy_oxygen as Oxygen, 
	oxy_saturation as Saturation, 
	oxy_temperature as Oxy_Temperature, 
	geom,
	salinity as salinity,
	1 as endpos
 FROM sailbuoy 
    WHERE "time" < (current_timestamp + interval '2 hour')
        ORDER BY time DESC LIMIT 1)

-- This view filters some columns and change the names of the sailbuoy table
CREATE OR REPLACE VIEW sailbuoyview AS 
SELECT "time", cttemperature as CT_Temperature, 
       ctconductivity as CT_Conductivity,
     oxy_oxygen as Oxygen, 
    oxy_saturation as Saturation, 
    oxy_temperature as Oxy_Temperature, 
       geom,
    salinity as salinity,
    ROW_NUMBER() OVER (ORDER BY time) as site_order
  FROM sailbuoy
    WHERE "time" < (current_timestamp + interval '2 hour');

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
        ORDER BY m.mooring_id

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
    ORDER BY m.mooring_id


