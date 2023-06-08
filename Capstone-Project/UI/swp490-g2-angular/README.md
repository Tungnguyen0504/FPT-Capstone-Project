# How to create a child module with routing

1. Go to folder that contains the parent module
2. Run `ng g m child-module --route child-route-name --module parent.module`

# Start sql server

sudo systemctl start mysql.service

# cd to backend

cd ~/swp490_g2/SpringBootAPI/HRMS_SWP490_G2

# run

sudo ./mvnw spring-boot:run

# application.properties

vim src/main/resources/application.properties

# Deploy Frontend

npm install (1st time)
npm update (1st time)
npm run build
npm install -g firebase-tools (1st time)
firebase login (1st time)
firebase deploy

# Deploy Backend

ssh root@66.175.233.233 (login)
BS2p@_h609 (login)
cd /root/swp490_g2/SpringBootAPI/HRMS_SWP490_G2/
git reset --hard
git pull
./mvnw package -DskipTests
sudo systemctl restart hrms
sudo systemctl restart nginx

# Backup sql from server

Server steps:
  ssh root@66.175.233.233 (login)
  BS2p@_h609 (login)
  cd /root/swp490_g2/MySQLDB
  mysqldump -u root -p hrms_swp490_g2_db > backup.sql
  Use FileZilla to download to folder MySQLDB on local

Local steps:
  mysql -u root -p hrms_swp490_g2_db < backup.sql
