--------------- Sites table -----------------------
-- Update the geom column of the sites with 
UPDATE sites SET geom = ST_GeomFromText('SRID=4326;POINT('|| longitude ||' '|| latitude ||')') 


--------------- Cruises table -----------------------
-- Updates the path of all cruises
SELECT createCruisePath(cruise_id) FROM cruises


--------------- Shoresamples table -----------------------
-- Update the geom column of the sites with 
UPDATE shoresamples SET geom = ST_GeomFromText('SRID=4326;POINT('|| long ||' '|| lat ||')') 


