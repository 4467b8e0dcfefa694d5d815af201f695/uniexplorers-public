package com.uniexplorers.imageMicroservice;

import javax.imageio.ImageIO;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import io.trbl.blurhash.BlurHash;
import jakarta.annotation.PostConstruct;

import org.springframework.web.bind.annotation.PostMapping;


@RestController
public class ImageController {

    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);
    @Value("${external_server}")
    private String cloudFront;

    private JsonObject jsonData;
    private final String IMAGES = "uni-images/";



    @PostConstruct
    public void initialize() {
        // Retrieve JSON data from the external server
        updateJsonMap();
    }

    private void updateJsonMap() {
        String jsonString = new RestTemplate().getForObject(cloudFront + "file_hash.json", String.class);
        logger.info("Retrieved latest HASHMAP");
        jsonData = new Gson().fromJson(jsonString, JsonObject.class);
        // try (JsonReader jsonReader = Json.createReader(new StringReader(jsonString))) {
        //     jsonData = jsonReader.readObject();
        // }
    }


    @GetMapping("/{imageid}/low")
    public ResponseEntity<Map<String, String>> getImageLow(@PathVariable String imageid) {
        logger.info(String.format("Getting [ %s ] [LOW]", imageid));
        Map<String, String> res = new HashMap<>();
        // Quite cursed no cap
        try {
            res.put("hash", jsonData.get(imageid).getAsString());
            return ResponseEntity.status(HttpStatus.OK).body(res);
        } catch (NullPointerException e) {
            updateJsonMap();
            try {
                res.put("hash", jsonData.get(imageid).getAsString());
                return ResponseEntity.status(HttpStatus.OK).body(res);
            } catch (Exception e2) {
                /* linear-gradient(
                    120deg,
                    hsl(270deg 100% 7%) 0%,
                    hsl(233deg 46% 14%) 7%,
                    hsl(219deg 50% 18%) 14%,
                    hsl(211deg 51% 22%) 21%,
                    hsl(205deg 49% 27%) 29%,
                    hsl(200deg 44% 31%) 36%,
                    hsl(196deg 38% 36%) 43%,
                    hsl(191deg 31% 42%) 50%,
                    hsl(186deg 24% 48%) 57%,
                    hsl(179deg 22% 54%) 64%,
                    hsl(171deg 24% 62%) 71%,
                    hsl(161deg 28% 70%) 79%,
                    hsl(148deg 32% 79%) 86%,
                    hsl(130deg 43% 88%) 93%,
                    hsl(104deg 100% 95%) 100%
                    )
                */
            res.put("hash", "L8BOdQ00?YIB00~TNtt6?FNtj]WU43");
            return ResponseEntity.status(HttpStatus.OK).body(res);
            }
        }
    }

    @GetMapping("/{imageid}")
    public ResponseEntity<byte[]> getImageHigh(@PathVariable String imageid) {
        /*
         * Simply forwarding the request to cloudFront
         */
        logger.info(String.format("Getting [ %s ] [HIGH]", imageid));
        try {
            return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.IMAGE_JPEG).cacheControl(CacheControl.maxAge(86400, TimeUnit.SECONDS)).body(new RestTemplate().getForObject(cloudFront + IMAGES + imageid, byte[].class));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    

    @PostMapping("/{imageid}")
    public ResponseEntity<String> uploadImage(@PathVariable String imageid, @RequestParam("image") MultipartFile imageFile) {
        // Implement logic to upload the image to the external server
        MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();
        try {
            parts.add("image", new ByteArrayResource(imageFile.getBytes()) {
                @Override
                public String getFilename() {
                    return imageFile.getOriginalFilename();
                }
            });
            String blurHash = BlurHash.encode(ImageIO.read(imageFile.getInputStream()));

            updateJsonMap();
            jsonData.addProperty(imageFile.getOriginalFilename(), blurHash);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<String>(jsonData.toString(), headers);

            try {
                new RestTemplate().put(cloudFront + IMAGES + imageid, imageFile.getResource());
                logger.info(String.format("Uploaded [ %s ]", imageid));

                new RestTemplate().put(cloudFront + "file_hash.json", entity);
                logger.info(String.format("HASHMAP Updated. Added %s", blurHash));
                return ResponseEntity.status(HttpStatus.OK).body("Image uplaoded successfully");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Failed to upload image");
            }

        } catch (RestClientException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(e.getMessage());
        }
    }


}