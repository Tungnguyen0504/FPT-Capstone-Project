package com.swp490_g2.hrms.repositories;

import com.swp490_g2.hrms.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
    @Query(value = """
                  select distinct pc.* from product_category pc\s
                      inner join product__product_category ppc on ppc.productCategoryId = pc.productCategoryId\s
                      inner join product p on p.productId = ppc.productId\s
                      inner join restaurant_product rp on rp.products_productId = p.productId\s
                      where rp.restaurant_restaurantId = :restaurantId\s
                      order by pc.productCategoryName
            """, nativeQuery = true)
    Set<ProductCategory> findAllByRestaurantId(Long restaurantId);

    @Query(value =
            "select pc.* from product_category as pc inner join product__product_category as ppc on pc.productCategoryId = ppc.productCategoryId where ppc.productId = :productId", nativeQuery = true)
    List<ProductCategory> getAllCategoriesByProductId(@Param("productId") Long productId);
}
