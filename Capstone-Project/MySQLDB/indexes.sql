ALTER TABLE product ADD FULLTEXT(productName);
alter table restaurant add fulltext(restaurantName);
alter table restaurant_category add fulltext(restaurantCategoryName);