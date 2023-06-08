
@REM Uncomment dòng dưới khi gặp lỗi trong quá trình fulltext search
@REM mysql --default-character-set=utf8 -u root -p hrms_swp490_g2_db < ../../MySQLDB/indexes.sql

mysql --default-character-set=utf8 -u root -p hrms_swp490_g2_db < ../../MySQLDB/provinces.sql
.\mvnw spring-boot:run
