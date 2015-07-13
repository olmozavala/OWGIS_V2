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
