package com.swp490_g2.hrms.controller;

import org.apache.commons.io.IOUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;

import static java.nio.charset.StandardCharsets.UTF_8;

@RestController
@RequestMapping("/.well-known/pki-validation")
public class StaticContentController {
    @GetMapping(
            value = "/DD9D69AD06FDEBD3DA9134BAEDC9C12C.txt"
    )
    public ResponseEntity<String> getFile() throws IOException {
        Resource resource = new FileSystemResource("uploads/DD9D69AD06FDEBD3DA9134BAEDC9C12C.txt");
        try (Reader reader = new InputStreamReader(resource.getInputStream(), UTF_8)) {
            return ResponseEntity.ok(FileCopyUtils.copyToString(reader));
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}
