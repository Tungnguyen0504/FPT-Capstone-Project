package com.swp490_g2.hrms.controller;

import com.swp490_g2.hrms.entity.File;
import com.swp490_g2.hrms.service.FileService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/file")
public class FileController {
    private final FileService fileService;

    @PostMapping("/load")
    @ResponseBody
    public ResponseEntity<Resource> load(@RequestBody String filePath) {
        Resource file = fileService.load(filePath);
        if(file == null)
            return ResponseEntity.ok(null);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

    @GetMapping("/get-all")
    public ResponseEntity<Set<File>> getAll()
    {
        return ResponseEntity.ok(fileService.getAll());
    }


}
