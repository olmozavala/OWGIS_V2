-- This script creates a view with only one row, the
-- path of the sailbuoy
CREATE OR REPLACE VIEW sailbuoypathview AS 
SELECT St_MakeLine(sailbuoy.track) AS sailbuoypath FROM(
	SELECT geometry(s.geom) as track
	FROM 
	sailbuoy as s	
	ORDER BY s.time
) AS sailbuoy;

