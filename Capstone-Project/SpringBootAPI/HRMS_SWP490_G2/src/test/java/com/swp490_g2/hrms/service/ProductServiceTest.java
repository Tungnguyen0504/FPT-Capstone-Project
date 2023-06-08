package com.swp490_g2.hrms.service;

import com.swp490_g2.hrms.repositories.FileRepository;
import com.swp490_g2.hrms.repositories.ProductCategoryRepository;
import com.swp490_g2.hrms.repositories.ProductRepository;
import com.swp490_g2.hrms.repositories.RestaurantRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private FileService fileService;

    @Mock
    private UserService userService;

    @Mock
    private RestaurantRepository restaurantRepository;

    @Mock
    private FileRepository fileRepository;

    @Mock
    private RestaurantService restaurantService;

    @Mock
    private ProductCategoryRepository productCategoryRepository;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void tearDown() {
    }

}
