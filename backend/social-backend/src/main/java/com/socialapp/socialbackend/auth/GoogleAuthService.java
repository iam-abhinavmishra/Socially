package com.socialapp.socialbackend.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.socialapp.socialbackend.model.User;
import com.socialapp.socialbackend.repository.UserRepository;
import com.socialapp.socialbackend.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.UUID;

@Service
public class GoogleAuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Value("${google.client-id}")
    private String googleClientId;

    public GoogleAuthService(
            UserRepository userRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public User loginWithGoogle(String credential) {

        try {
            GoogleIdTokenVerifier verifier =
                    new GoogleIdTokenVerifier.Builder(
                            new NetHttpTransport(),
                            GsonFactory.getDefaultInstance()
                    )
                            .setAudience(
                                    Collections.singletonList(googleClientId)
                            )
                            .build();

            GoogleIdToken idToken = verifier.verify(credential);

            if (idToken == null) {
                throw new RuntimeException("Invalid Google credential");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String googleName = (String) payload.get("name");

            if (email == null || email.isBlank()) {
                throw new RuntimeException("Google account email not found");
            }

            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> createGoogleUser(email, googleName));

            return user;

        } catch (Exception e) {
            throw new RuntimeException("Google login failed", e);
        }
    }

    private User createGoogleUser(String email, String googleName) {

        String username = createUniqueUsername(email, googleName);

        User user = new User();

        user.setUsername(username);
        user.setEmail(email);

        /*
         * Google users do not use your normal password login.
         * A random encoded password is stored because the database
         * may expect the password field to contain a value.
         */
        user.setPassword(
                passwordEncoder.encode(UUID.randomUUID().toString())
        );

        return userRepository.save(user);
    }

    private String createUniqueUsername(String email, String googleName) {

        String baseUsername;

        if (googleName != null && !googleName.isBlank()) {
            baseUsername = googleName
                    .toLowerCase()
                    .replaceAll("[^a-z0-9]", "");
        } else {
            baseUsername = email
                    .substring(0, email.indexOf("@"))
                    .toLowerCase()
                    .replaceAll("[^a-z0-9]", "");
        }

        if (baseUsername.isBlank()) {
            baseUsername = "googleuser";
        }

        String username = baseUsername;
        int counter = 1;

        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter;
            counter++;
        }

        return username;
    }

    public String generateJwt(User user) {
        return jwtService.generateToken(user.getEmail());
    }
}