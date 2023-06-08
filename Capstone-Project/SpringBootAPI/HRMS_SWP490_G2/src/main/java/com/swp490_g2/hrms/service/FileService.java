package com.swp490_g2.hrms.service;

import com.swp490_g2.hrms.entity.File;
import com.swp490_g2.hrms.entity.User;
import com.swp490_g2.hrms.repositories.FileRepository;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

@Service
@Getter
public class FileService {

    private final String UPLOAD_ROOT = "uploads";
    private final Path root = Paths.get(UPLOAD_ROOT);
    private FileRepository fileRepository;

    @Autowired
    public void setFileRepository(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    public void init() {
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    private Optional<String> getExtension(String filename) {
        return Optional.ofNullable(filename)
                .filter(f -> f.contains("."))
                .map(f -> f.substring(filename.lastIndexOf(".") + 1));
    }

    public String save(MultipartFile file, String... paths) {
        try {
            Path path = Paths.get(UPLOAD_ROOT, paths);
            if (!Files.exists(path))
                Files.createDirectories(path);

            Path filePath = path.resolve("file_" + new Date().getTime() + "." + getExtension(file.getOriginalFilename()).get());
            Files.copy(file.getInputStream(), filePath);
            return filePath.toString();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public Resource load(String filename) {
        try {
            filename = filename.substring(1, filename.length() - 1);
            Resource resource = new FileSystemResource(filename);

            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }

    public void deleteAll() {
        FileSystemUtils.deleteRecursively(root.toFile());
    }

    public Stream<Path> loadAll(String... paths) {
        try {
            Path folderPath = Paths.get(UPLOAD_ROOT, paths);
            return Files.walk(folderPath, 1).filter(path -> !path.equals(folderPath)).map(folderPath::relativize);
        } catch (IOException e) {
            throw new RuntimeException("Could not load the files!");
        }
    }

    public Set<File> getAll() {
        User user = this.userService.getCurrentUser();
        if(user == null)
            return null;

        Long currentUserId = user.getId();
        return this.fileRepository.findByCreatedBy(currentUserId);
    }
}