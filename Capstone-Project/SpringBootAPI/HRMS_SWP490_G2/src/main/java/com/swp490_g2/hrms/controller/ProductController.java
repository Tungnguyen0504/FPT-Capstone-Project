package com.swp490_g2.hrms.controller;

import com.swp490_g2.hrms.entity.Product;
import com.swp490_g2.hrms.requests.ProductInformationRequest;
import com.swp490_g2.hrms.requests.SearchRequest;
import com.swp490_g2.hrms.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/product")
public class ProductController {
    private final ProductService productService;

    @PostMapping(value = "/search/{restaurantId}")
    public ResponseEntity<Page<Product>> search(@RequestBody SearchRequest request, @PathVariable Long restaurantId) {
        return ResponseEntity.ok(productService.search(request, restaurantId));
    }

    @GetMapping("/get-product-price-ranges-by-restaurant-id/{restaurantId}")
    public ResponseEntity<Double[]> getProductPriceRanges(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(productService.getProductPriceRanges(restaurantId));
    }

    @GetMapping("/fulltext-search")
    public ResponseEntity<Set<Product>> fulltextSearch(@RequestParam String text, @RequestParam Long restaurantId) {
        return ResponseEntity.ok(productService.fulltextSearch(restaurantId, text));
    }

    @PostMapping("/add-new-product/{restaurantId}")
    public ResponseEntity<String> addNewProduct(@PathVariable Long restaurantId, @RequestBody Product product) {
        return ResponseEntity.ok(productService.addNewProduct(restaurantId, product));
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @PutMapping(value = "/add-image/{productId}")
    public void addImage(@PathVariable Long productId,
                         @RequestParam("file") MultipartFile imageFile
    ) {
        productService.addImage(productId, imageFile);
    }

    @PutMapping("/update")
    public void update(@RequestBody Product product) {
        productService.update(product);
    }

    @DeleteMapping("/delete-product-by-id")
    public void deleteProductById(
            @RequestParam("restaurant-id") Long restaurantId,
            @RequestParam("product-id") Long productId
    ) {
        productService.deleteProductById(restaurantId, productId);
    }

    @DeleteMapping("/delete-image")
    public void deleteImage(@RequestParam("product-id") Long productId, @RequestParam("image-id") Long imageId) {
        productService.deleteImage(productId, imageId);
    }

    @GetMapping("/get-top-most-ordered/{top}")
    public ResponseEntity<List<Product>> getTopMostOrdered(@PathVariable Long top) {
        return ResponseEntity.ok(productService.getTopMostOrdered(top));
    }

    @GetMapping("get-products-by-orderId/{orderId}")
    public ResponseEntity<List<Product>> getProductsByOrderId(@PathVariable Long orderId){
        return ResponseEntity.ok(productService.getProductsByOrderId(orderId));
    }
}
