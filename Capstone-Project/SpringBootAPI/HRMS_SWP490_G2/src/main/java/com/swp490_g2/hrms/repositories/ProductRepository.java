package com.swp490_g2.hrms.repositories;

import com.swp490_g2.hrms.entity.Product;
import com.swp490_g2.hrms.entity.Restaurant;
import com.swp490_g2.hrms.entity.shallowEntities.SearchSpecification;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    @Query(value = "SELECT min(p.price) FROM product p inner join restaurant_product rp on rp.products_productId = p.productId\n" +
            "                      where rp.restaurant_restaurantId = :restaurantId", nativeQuery = true)
    public Double getMinPriceByRestaurantId(Long restaurantId);

    @Query(value = "SELECT max(p.price) FROM product p inner join restaurant_product rp on rp.products_productId = p.productId\n" +
            "                      where rp.restaurant_restaurantId = :restaurantId", nativeQuery = true)
    public Double getMaxPriceByRestaurantId(Long restaurantId);

    @Query(value = """
            select *\s
            from product p\s
                inner join restaurant_product rp on rp.products_productId = p.productId
                where (match (p.productName) against (:text IN NATURAL LANGUAGE MODE)\s
                or p.productName like %:text%)\s
                and rp.restaurant_restaurantId = :restaurantId
                """, nativeQuery = true)
    public Set<Product> fulltextSearch(Long restaurantId, String text);

    @Transactional
    @Modifying
    @Query(value = "delete from product__product_category where productId = :productId and productCategoryId = :productCategoryId", nativeQuery = true)
    int deleteProductProductCategory(@Param("productId") Long productId, @Param("productCategoryId") Long productCategoryId);

    @Transactional
    @Modifying
    @Query(value = "delete from product__product_category where productId = :productId and productCategoryId = :productCategoryId", nativeQuery = true)
    int deleteRestaurantProduct(@Param("productId") Long productId, @Param("productCategoryId") Long productCategoryId);

    Page<Product> findAllDistinctBy(SearchSpecification<Product> specification, Pageable pageable);

    @Query(value = """
            select distinct p.*
            from product p
            	inner join restaurant_product rp on rp.products_productId = p.productId
            	where rp.restaurant_restaurantId = :restaurantId
                ;
            """, nativeQuery = true)
    List<Product> findAllByRestaurantId(Long restaurantId);

    @Modifying
    @Query(value = """
            INSERT INTO `restaurant_product` (`restaurant_restaurantId`, `products_productId`) VALUES (:restaurantId, :productId);
                        
            """, nativeQuery = true)
    void addProductToRestaurant(Long restaurantId, Long productId);

    @Modifying
    @Query(value = """
            DELETE FROM `restaurant_product` WHERE (`restaurant_restaurantId` = :restaurantId) and (`products_productId` = :productId);
            """, nativeQuery = true)
    void deleteProductFromRestaurant(Long restaurantId, Long productId);

    @Query(value = """
            select p.*, sum(opd.quantity) `quantity_count`
            from product p
            	inner join restaurant_product rp on rp.products_productId = p.productId
            	left join order_product_detail opd on opd.product_productId = p.productId
            where p.productStatus = 'ACTIVE'
            group by p.productId
            order by `quantity_count` desc, p.productName
            limit :top
            """, nativeQuery = true)
    List<Product> getTopMostOrdered(Long top);

    @Query(value = "" +
            "select p.* from product as p " +
            "inner join order_product_detail as opd " +
            "on p.productId = opd.product_productId " +
            "inner join order_order_product_detail as oopd " +
            "on opd.orderProductDetailId = oopd.orderProductDetails_orderProductDetailId " +
            "where oopd.order_orderId = :orderId", nativeQuery = true)
    List<Product> getProductsByOrderId(Long orderId);
}
