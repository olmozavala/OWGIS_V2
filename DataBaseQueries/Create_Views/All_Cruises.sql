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

