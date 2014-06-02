
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
