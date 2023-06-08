package com.swp490_g2.hrms.service;

import com.swp490_g2.hrms.entity.*;
import com.swp490_g2.hrms.entity.enums.ProductStatus;
import com.swp490_g2.hrms.entity.shallowEntities.SearchSpecification;
import com.swp490_g2.hrms.repositories.*;
import com.swp490_g2.hrms.requests.ProductInformationRequest;
import com.swp490_g2.hrms.requests.SearchRequest;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Getter
public class ProductService {

    private ProductRepository productRepository;

    @Autowired
    public void setProductRepository(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    private FileService fileService;

    @Autowired
    public void setFileRepository(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    private RestaurantRepository restaurantRepository;

    @Autowired
    public void setRestaurantRepository(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    private FileRepository fileRepository;

    @Autowired
    public void setFileService(FileService fileService) {
        this.fileService = fileService;
    }

    private RestaurantService restaurantService;

    @Autowired
    public void setRestaurantService(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    private ProductCategoryRepository productCategoryRepository;

    @Autowired
    public void setProductCategoryRepository(ProductCategoryRepository productCategoryRepository) {
        this.productCategoryRepository = productCategoryRepository;
    }

    public Page<Product> search(SearchRequest request, Long restaurantId) {
        SearchSpecification<Product> specification = new SearchSpecification<>(request);
        List<Product> products = productRepository.findAll(specification);
        List<Product> productsByRestaurantId = productRepository.findAllByRestaurantId(restaurantId);
        List<Product> uniqueProducts = new ArrayList<>();
        products.forEach(product -> {
            if (uniqueProducts.stream().noneMatch(up -> up.getId().equals(product.getId()))
                    && productsByRestaurantId.stream().anyMatch(p -> p.getId().equals(product.getId()))
            ) {
                uniqueProducts.add(product);
            }
        });

        if (request.getSize() == null
                || request.getPage() == null
        ) {
            return new PageImpl<>(uniqueProducts);
        }

        return new PageImpl<>(uniqueProducts.subList(
                request.getSize() * request.getPage(),
                Integer.min(request.getSize() * request.getPage()
                        + request.getSize(), uniqueProducts.size())
        ),
                PageRequest.of(request.getPage(),
                        request.getSize()),
                uniqueProducts.size());
    }

    public Double[] getProductPriceRanges(Long restaurantId) {
        Double[] result = new Double[]{0.0, 0.0};
        result[0] = productRepository.getMinPriceByRestaurantId(restaurantId);
        result[1] = productRepository.getMaxPriceByRestaurantId(restaurantId);
        return result;
    }

    public Set<Product> fulltextSearch(Long restaurantId, String text) {
        return productRepository.fulltextSearch(restaurantId, text);
    }

    public File productImage(User user, MultipartFile imageFile) {
        String path = fileService.save(imageFile, "product", "image");
        File productImage = File.builder()
                .filePath(path)
                .build();
        productImage.setCreatedBy(user.getId());
        productImage.setModifiedBy(user.getId());
        return productImage;
    }

    private void checkValidUserForRestaurant(Long restaurantId) {
        User currentUser = userService.getCurrentUser();
        if (currentUser == null) {
            throw new AccessDeniedException("This request allows seller or admin only.");
        }

        Restaurant ownerRestaurant = restaurantRepository.getOwnerRestaurant(currentUser.getId(), restaurantId).orElse(null);
        if (!currentUser.isAdmin() && (currentUser.isSeller() && ownerRestaurant == null)) {
            throw new AccessDeniedException("This request allows seller or admin only.");
        }
    }

    @Transactional
    public String addNewProduct(Long restaurantId, Product product) {
        checkValidUserForRestaurant(restaurantId);

        Restaurant restaurant = restaurantService.getById(restaurantId);
        if (restaurant == null) {
            return "\"This restaurant with id [" + restaurantId + "] does not exist.\"";
        }

        List<Product> productsOfRestaurant = search(new SearchRequest(), restaurantId).getContent();
        boolean hasSameProductName = productsOfRestaurant.stream().anyMatch(p -> p.getProductName().equals(product.getProductName()));
        if (hasSameProductName) {
            return "\"This product with name [" + product.getProductName() + "] is already existed.\"";
        }

        for (ProductCategory category : product.getCategories()) {
            ProductCategory savedCategory = productCategoryRepository.save(category);
            category.setId(savedCategory.getId());
        }

        Product addedProduct = productRepository.save(product);
        productRepository.addProductToRestaurant(restaurantId, addedProduct.getId());
        return null;
    }

    public Product getById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public void addImage(Long productId, MultipartFile imageFile) {
        Product product = getById(productId);
        if (product == null)
            return;

        String path = fileService.save(imageFile, "product", productId.toString());
        File productImage = File.builder()
                .filePath(path)
                .build();

        User user = userService.getCurrentUser();
        productImage.setCreatedBy(user.getId());
        product.getImages().add(productImage);
        update(product);
    }

    public void deleteImage(Long productId, Long imageId) {
        Product product = getById(productId);
        if (product == null)
            return;

        product.getImages().removeIf(image -> image.getId().equals(imageId));
        update(product);
    }

    @Transactional
    public void deleteProductById(Long restaurantId, Long productId) {
        checkValidUserForRestaurant(restaurantId);

        List<ProductCategory> getAllCategoriesByProductId = productCategoryRepository.getAllCategoriesByProductId(productId);
        for (ProductCategory productCategory : getAllCategoriesByProductId) {
            productRepository.deleteProductProductCategory(productId, productCategory.getId());
        }

        Restaurant restaurant = restaurantService.getById(restaurantId);
        if (restaurant != null) {
            productRepository.deleteProductFromRestaurant(restaurantId, productId);
        }

        productRepository.deleteById(productId);
    }

    public void update(Product product) {
        if (product == null)
            return;

        if (product.getImages() != null) {
            List<File> newImages = new ArrayList<>();
            product.getImages().forEach(image -> {
                if(newImages.stream().noneMatch(i -> i.getId().equals(image.getId()))) {
                    newImages.add(image);
                }
            });

            product.setImages(newImages);
        }

        productRepository.save(product);
    }

    public List<Product> getTopMostOrdered(Long top) {
        if (top == null || top <= 0)
            top = 10L;

        List<Product> topProducts = productRepository.getTopMostOrdered(top);
        topProducts.forEach(product -> {
            Restaurant restaurant = restaurantService.getByProductId(product.getId());
            product.setRestaurant(restaurant);
        });

        return topProducts;
    }

    public List<Product> getProductsByOrderId(Long orderId) {
        return productRepository.getProductsByOrderId(orderId);
    }
}
