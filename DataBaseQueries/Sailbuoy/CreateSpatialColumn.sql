--------------- Sailbuoy table -----------------------
-- Add the Geometry column into the sailbuoy table 
SELECT AddGeometryColumn('sailbuoy','geom','4326','POINT','2')
