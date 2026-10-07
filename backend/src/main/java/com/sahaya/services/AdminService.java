package com.sahaya.services;

import com.sahaya.models.Role;
import com.sahaya.models.User;
import com.sahaya.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getPendingReceivers(User admin) {

        checkAdmin(admin);

        return userRepository.findAll()
                .stream()
                .filter(user ->
                        user.getRole() == Role.RECEIVER_ORG
                                && !user.isVerified()
                )
                .toList();
    }

    public User verifyReceiver(
            Long receiverId,
            User admin
    ) {

        checkAdmin(admin);

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() ->
                        new RuntimeException("Receiver organization not found")
                );

        if (receiver.getRole() != Role.RECEIVER_ORG) {
            throw new RuntimeException(
                    "Selected user is not a receiver organization"
            );
        }

        receiver.setVerified(true);

        return userRepository.save(receiver);
    }

    private void checkAdmin(User user) {

        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException(
                    "Only admins can perform this action"
            );
        }
    }
}