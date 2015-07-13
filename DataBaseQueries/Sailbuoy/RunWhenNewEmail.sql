--------------- SailBuoy table -----------------------

-- Update the geom column with 
UPDATE sailbuoy SET geom = ST_GeomFromText('SRID=4326;POINT('|| long ||' '|| lat ||')') 
