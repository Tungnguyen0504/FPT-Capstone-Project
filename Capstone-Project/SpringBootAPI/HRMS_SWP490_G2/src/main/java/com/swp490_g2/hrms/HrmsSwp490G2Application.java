package com.swp490_g2.hrms;

import com.swp490_g2.hrms.service.FileService;
import com.swp490_g2.hrms.service.SMSService;
import jakarta.annotation.Resource;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HrmsSwp490G2Application implements CommandLineRunner {
    @Resource
    FileService fileService;

    @Resource
    SMSService smsService;

    public static void main(String[] args) {
        SpringApplication.run(HrmsSwp490G2Application.class, args);
    }

    @Override
    public void run(String... arg) throws Exception {
        fileService.init();
        smsService.init();
    }
}
