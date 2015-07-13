--------------- Drifters table -----------------------
-- Add the Geometry column into the drifters table 
SELECT AddGeometryColumn('drifters','geom','4326','POINT','2');

-- Update the geom column with 
UPDATE drifters SET geom = ST_GeomFromText('SRID=4326;POINT('|| lon ||' '|| lat ||')') ;

-- This view has all the drifters start positions
CREATE OR REPLACE VIEW drifters_view AS 
SELECT drifter_id as id, geom, data as info
    FROM drifters
    WHERE geom <> '';
