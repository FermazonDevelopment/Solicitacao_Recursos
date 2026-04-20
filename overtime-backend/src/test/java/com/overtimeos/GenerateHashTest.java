package com.overtimeos;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateHashTest {

    @Test
    void generateHashes() {
        BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
        System.out.println("=== HASHES ===");
        System.out.println("1234       : " + enc.encode("1234"));
        System.out.println("admin@2025 : " + enc.encode("admin@2025"));

        // Verificar hash atual do banco
        String hashAtual = "$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cgrS3OnBoGHJDDnJBBIVa0m";
        System.out.println("Hash atual TI bate com '1234'? " + enc.matches("1234", hashAtual));
    }
}
