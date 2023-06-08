# Backup and restore DB

**You must cd into the MYSQLDB folder to be able to run below commands**
Backup: mysqldump -u root -p hrms_swp490_g2_db > backup.sql
Backup no create tables: mysqldump -u root -p hrms_swp490_g2_db > backup.sql --no-create-info
Backup no create tables, no password prompt: mysqldump --defaults-file=mysql.cnf -u root hrms_swp490_g2_db > backup.sql --no-create-info

Restore: mysql -u root -p hrms_swp490_g2_db < backup.sql
Restore no password prompt: mysql --defaults-file=mysql.cnf -u root hrms_swp490_g2_db < backup.sql
