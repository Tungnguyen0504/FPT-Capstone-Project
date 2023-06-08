SET SQL_SAFE_UPDATES = 0;        
        
update `user`
set userStatus = 'INACTIVE'
where isActive = 0;

update `user`
set userStatus = 'ACTIVE'
where isActive = 1;

SET SQL_SAFE_UPDATES = 1;