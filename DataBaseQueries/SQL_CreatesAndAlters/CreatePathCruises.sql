-- Add the Geometry column into the cruises table 
SELECT AddGeometryColumn('cruises','geom','4326','LINESTRING','2')


-- This function receives a 'cruise_id' and searchs for
-- the sites of that cruise and updates its 'path'
CREATE OR REPLACE FUNCTION createCruisePath(text) RETURNS void AS $$
	
	UPDATE cruises 
	SET geom = (
	SELECT St_MakeLine(sites.track) AS cruisePath FROM(
		SELECT geometry(s.geom) as track
--SELECT e.event_id, e.event_date, e.event_time, e.event_no, s.site_id, s.latitude, s.longitude
		FROM 
		events as e JOIN activities as a ON e.activity_id = a.activity_id
		JOIN cruises as c ON c.activity_id = a.activity_id
		JOIN sites as s ON s.site_id = e.site_id
		WHERE c.cruise_id = $1 and s.geom <> ''
--		ORDER BY e.event_date, e.event_time, e.event_no
		ORDER BY e.event_no
	) AS sites)
	WHERE cruise_id = $1

$$ LANGUAGE SQL;

-- Updates the path of all cruises
SELECT createCruisePath(cruise_id) FROM cruises

--- Delete geography columns
ALTER TABLE cruises DROP COLUMN geom CASCADE  
