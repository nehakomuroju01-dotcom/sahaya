package com.sahaya;

import com.sahaya.services.DemoDataSeederService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BackendApplicationTests {

    @Autowired
    private DemoDataSeederService demoDataSeederService;

    @Test
    void seedDemoData() {
        demoDataSeederService.resetAndSeed();
    }

}
