package com.swp490_g2.hrms.controller;

import com.swp490_g2.hrms.entity.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/socket-message")
public class SocketMessageController {
    @GetMapping("/fetch")
    public Notification fetch() {
        return null;
    }
}

