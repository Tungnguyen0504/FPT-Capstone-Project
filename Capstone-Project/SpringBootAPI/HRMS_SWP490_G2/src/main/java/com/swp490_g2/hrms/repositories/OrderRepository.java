package com.swp490_g2.hrms.repositories;

import com.swp490_g2.hrms.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByOrderCreatorId(Long id);

    @Query(value = "SELECT o.* FROM `order` o JOIN user u\n" +
            "ON o.orderCreator_userId = u.userId JOIN order_order_product_detail oopd\n" +
            "ON o.orderId = oopd.order_orderId JOIN order_product_detail opd \n" +
            "ON oopd.orderProductDetails_orderProductDetailId = opd.orderProductDetailId JOIN product p\n" +
            "ON opd.product_productId = p.productId JOIN restaurant_product rp\n" +
            "ON p.productId = rp.products_productId JOIN restaurant r\n" +
            "ON rp.restaurant_restaurantId = r.restaurantId\n" +
            "WHERE u.userId = :userId AND r.restaurantId = :restaurantId", nativeQuery = true)
    List<Order> getOrderByUSerIdAndRestaurantId(@Param("userId") Long userId, @Param("restaurantId") Long restaurantId);


    @Query(value = """
            SELECT count(distinct(o.orderId)) totalOrders,
                sum(opd.price * opd.quantity) totalSales,
                date_format(convert_tz(o.completedAt, "+00:00" ,"+07:00"), "%d-%m-%Y")
            FROM `order` o
                inner join order_order_product_detail oopd on oopd.order_orderId = o.orderId
                inner join order_product_detail opd on opd.orderProductDetailId = oopd.orderProductDetails_orderProductDetailId
                inner join restaurant_product rp on rp.products_productId = opd.product_productId
            where o.orderStatus = "COMPLETED"
                and rp.restaurant_restaurantId = :restaurantId
                and date(convert_tz(o.completedAt, "+00:00" ,"+07:00")) in (
                    date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval 6 + 7 * :offset day),
                    date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval 5 + 7 * :offset day),
                    date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval 4 + 7 * :offset day),
                    date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval 3 + 7 * :offset day),
                    date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval 2 + 7 * :offset day),
                    date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval 1 + 7 * :offset day),
                    date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval 0 + 7 * :offset day))
            group by date_format(convert_tz(o.completedAt, "+00:00" ,"+07:00"), "%d-%m-%Y")
            ;
            """, nativeQuery = true)
    List<Object> getReportIncomeOverTimeByRestaurantIdByWeekAndByCompletedOrderStatus(Long restaurantId, int offset);

    @Query(value = """
            SELECT count(distinct(o.orderId)) totalOrders,
                sum(opd.price * opd.quantity) totalSales,
                date_format(convert_tz(o.abortedAt, "+00:00" ,"+07:00"), "%d-%m-%Y")
            FROM `order` o
                inner join order_order_product_detail oopd on oopd.order_orderId = o.orderId
                inner join order_product_detail opd on opd.orderProductDetailId = oopd.orderProductDetails_orderProductDetailId
                inner join restaurant_product rp on rp.products_productId = opd.product_productId
            where o.orderStatus = "ABORTED"
                and rp.restaurant_restaurantId = :restaurantId
                and date(convert_tz(o.abortedAt, "+00:00" ,"+07:00")) in (
                    date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval 6 + 7 * :offset day),
                    date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval 5 + 7 * :offset day),
                    date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval 4 + 7 * :offset day),
                    date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval 3 + 7 * :offset day),
                    date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval 2 + 7 * :offset day),
                    date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval 1 + 7 * :offset day),
                    date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval 0 + 7 * :offset day))
            group by date_format(convert_tz(o.abortedAt, "+00:00" ,"+07:00"), "%d-%m-%Y")
            ;
            """, nativeQuery = true)
    List<Object> getReportIncomeOverTimeByRestaurantIdByWeekAndByAbortedOrderStatus(Long restaurantId, int offset);

    @Query(value = """
            SELECT count(distinct(o.orderId)) totalOrders,
            	sum(opd.price * opd.quantity) totalSales,
            	date_format(convert_tz(o.completedAt, "+00:00" ,"+07:00"), "%d-%m-%Y")
            FROM `order` o
            	inner join order_order_product_detail oopd on oopd.order_orderId = o.orderId
            	inner join order_product_detail opd on opd.orderProductDetailId = oopd.orderProductDetails_orderProductDetailId
            	inner join restaurant_product rp on rp.products_productId = opd.product_productId
            where o.orderStatus = "COMPLETED"
            	and rp.restaurant_restaurantId = :restaurantId
            	and date(convert_tz(o.completedAt, "+00:00" ,"+07:00"))
            	    between date_format(date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval :offset month), "%Y-%m-01")
            		    and last_day(date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval :offset month))
            group by date_format(convert_tz(o.completedAt, "+00:00" ,"+07:00"), "%d-%m-%Y")
            ;
            """, nativeQuery = true)
    List<Object> getReportIncomeOverTimeByRestaurantIdByMonthAndCompletedOrderStatus(Long restaurantId, int offset);

    @Query(value = """
            SELECT count(distinct(o.orderId)) totalOrders,
            	sum(opd.price * opd.quantity) totalSales,
            	date_format(convert_tz(o.abortedAt, "+00:00" ,"+07:00"), "%d-%m-%Y")
            FROM `order` o
            	inner join order_order_product_detail oopd on oopd.order_orderId = o.orderId
            	inner join order_product_detail opd on opd.orderProductDetailId = oopd.orderProductDetails_orderProductDetailId
            	inner join restaurant_product rp on rp.products_productId = opd.product_productId
            where o.orderStatus = "ABORTED"
            	and rp.restaurant_restaurantId = :restaurantId
            	and date(convert_tz(o.abortedAt, "+00:00" ,"+07:00"))
            	    between date_format(date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval :offset month), "%Y-%m-01")
            		    and last_day(date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval :offset month))
            group by date_format(convert_tz(o.abortedAt, "+00:00" ,"+07:00"), "%d-%m-%Y")
            ;
            """, nativeQuery = true)
    List<Object> getReportIncomeOverTimeByRestaurantIdByMonthAndAbortedOrderStatus(Long restaurantId, int offset);

    @Query(value = """
            SELECT count(distinct(o.orderId)) totalOrders,
            	sum(opd.price * opd.quantity) totalSales,
            	date_format(convert_tz(o.completedAt, "+00:00" ,"+07:00"), "%m-%Y")
            FROM `order` o
            	inner join order_order_product_detail oopd on oopd.order_orderId = o.orderId
            	inner join order_product_detail opd on opd.orderProductDetailId = oopd.orderProductDetails_orderProductDetailId
            	inner join restaurant_product rp on rp.products_productId = opd.product_productId
            where o.orderStatus = "COMPLETED"
            	and rp.restaurant_restaurantId = :restaurantId
            	and date(convert_tz(o.completedAt, "+00:00" ,"+07:00"))
            	    between date_format(date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval :offset year), "%Y-01-01")
            		    and date_format(date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval :offset year), "%Y-12-31")
            group by date_format(convert_tz(o.completedAt, "+00:00" ,"+07:00"), "%m-%Y")
            ;
            """, nativeQuery = true)
    List<Object> getReportIncomeOverTimeByRestaurantIdByYearAndCompletedOrderStatus(Long restaurantId, int offset);

    @Query(value = """
            SELECT count(distinct(o.orderId)) totalOrders,
            	sum(opd.price * opd.quantity) totalSales,
            	date_format(convert_tz(o.abortedAt, "+00:00" ,"+07:00"), "%m-%Y")
            FROM `order` o
            	inner join order_order_product_detail oopd on oopd.order_orderId = o.orderId
            	inner join order_product_detail opd on opd.orderProductDetailId = oopd.orderProductDetails_orderProductDetailId
            	inner join restaurant_product rp on rp.products_productId = opd.product_productId
            where o.orderStatus = "ABORTED"
            	and rp.restaurant_restaurantId = :restaurantId
            	and date(convert_tz(o.abortedAt, "+00:00" ,"+07:00"))
            	    between date_format(date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval :offset year), "%Y-01-01")
            		    and date_format(date_sub(date(convert_tz(now(), "+00:00" ,"+07:00")), interval :offset year), "%Y-12-31")
            group by date_format(convert_tz(o.abortedAt, "+00:00" ,"+07:00"), "%m-%Y")
            ;
            """, nativeQuery = true)
    List<Object> getReportIncomeOverTimeByRestaurantIdByYearAndAbortedOrderStatus(Long restaurantId, int offset);
}
