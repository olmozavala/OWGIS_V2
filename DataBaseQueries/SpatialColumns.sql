To add the column:
-- Example for adding a geography column
ALTER TABLE table ADD column geog geography('POINT','4326')
ALTER TABLE sites ADD column geog geography('POINT','4326')

-- Example for adding a geometry column
ALTER TABLE table ADD column geom geography('POINT','4326')
ALTER TABLE sites ADD column geom geography('POINT','4326')

To Update or insert use ST_GeogFromText('POINT(lat , lon)',4326) Examples:
UPDATE sites SET geog = ST_GeogFromText('POINT(29.0 -86.9)') WHERE site_id = 123
UPDATE sites SET geom = ST_GeomFromText('POINT(29.0 -86.9)') WHERE site_id = 123

======= If the table already have the columns lat and lon filled then:

UPDATE sites SET geog = ST_GeogFromText('SRID=4326;POINT('|| lon ||' '|| lat ||')')
UPDATE sites SET geom = ST_GeomFromText('SRID=4326;POINT('|| lon ||' '|| lat ||')')


Extras
======== To delete drop a table with a Geometry column =====
DropGeometryTable


IMPORTANT!!!!
=============== How to update the geometry or geography columns in the DB =========
After adding a new geom or geog column, we should run:

SELECT Probe_Geometry_Columns()


-------- OLD VERSION WITH GEOG column ------------
UPDATE sites SET geog = ST_GeogFromText('SRID=4326;POINT('|| longitude ||' '|| latitude ||')') 

--- Delete geography columns
ALTER TABLE sites DROP COLUMN geog CASCADE  

---------------------------- TESTS ----------------------
--ALTER TABLE cruises ADD COLUMN geog geography(LINESTRING)
--SELECT * FROM 

--DROP FUNCTION getCruisePath(text)
CREATE OR REPLACE FUNCTION createCruisePath(text) RETURNS void AS $$
	
	UPDATE cruises 
	SET geog = (
	SELECT St_MakeLine(sites.track) AS cruisePath FROM(
		SELECT geometry(s.geog) as track
		FROM 
		events as e JOIN activities as a ON e.activity_id = a.activity_id
		JOIN cruises as c ON c.activity_id = a.activity_id
		JOIN sites as s ON s.site_id = e.site_id
		WHERE c.cruise_id = $1
		ORDER BY e.event_date
	) AS sites)
	WHERE cruise_id = $1

$$ LANGUAGE SQL;

SELECT createCruisePath(cruise_id) FROM cruises

--Creates a view that contains the sites and events, and SQL to select events'
--CREATE VIEW sites_events AS SELECT site_id,name,geog, '#SELECT * FROM events WHERE site_id = '||name||'#' as Events FROM sites
--CREATE VIEW sites_events AS SELECT site_id,name,geog FROM sites
--WHERE site_id > 

--CREATE VIEW sites_events AS 
--SELECT s.name as site, e.event_id as event, s.geog
--FROM sites as s JOIN events as e on e.site_id = s.site_id

