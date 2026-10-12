package com.sahaya.services;

import com.sahaya.dto.ChatResponse;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class ChatService {

    public ChatResponse reply(String message) {

        String text = message.toLowerCase(Locale.ROOT).trim();

        if (containsAny(text, "hello", "hi", "hey", "namaste")) {
            return new ChatResponse(
                    "Hi! Welcome to Sahaya. I can help you with donations, "
                            + "claims, volunteering, and food safety. What do you need help with?",
                    "GREETING"
            );
        }

        if (containsAny(text, "donate", "donation", "donor")) {
            return new ChatResponse(
                    "To donate, sign in with a donor account and create a listing. "
                            + "Add the item title, type, quantity, pickup location, "
                            + "and expiry date. Only list items that are safe and suitable to donate.",
                    "DONATIONS"
            );
        }

        if (containsAny(text, "claim", "receiver", "ngo", "shelter")) {
            return new ChatResponse(
                    "Receiver organizations must register and be verified by an admin "
                            + "before claiming donations. Browse available listings and "
                            + "claim only the quantity your organization can use.",
                    "CLAIMS"
            );
        }

        if (containsAny(text, "volunteer", "mission", "pickup", "pick up")) {
            return new ChatResponse(
                    "Volunteers can view available pickup missions, accept a mission, "
                            + "and mark the pickup after collecting the donation. "
                            + "Follow the handover process to confirm delivery.",
                    "VOLUNTEERING"
            );
        }

        if (containsAny(text, "food safety", "expired", "expiry", "spoiled", "spoilt")) {
            return new ChatResponse(
                    "Please never donate spoiled, contaminated, or unsafe food. "
                            + "Check packaging, storage conditions, and expiry information. "
                            + "Do not distribute food if its safety is uncertain.",
                    "FOOD_SAFETY"
            );
        }

        if (containsAny(text, "impact", "statistics", "dashboard", "environment")) {
            return new ChatResponse(
                    "Sahaya aims to reduce waste by connecting surplus resources "
                            + "with organizations that need them. Impact statistics can "
                            + "show donations, quantities redistributed, and completed missions.",
                    "IMPACT"
            );
        }

        if (containsAny(text, "thank", "thanks")) {
            return new ChatResponse(
                    "You're welcome! Every safe donation and successful handover "
                            + "helps Sahaya bring useful resources to people and communities.",
                    "THANKS"
            );
        }

        return new ChatResponse(
                "I'm Sahaya Assistant. I can help with creating donations, "
                        + "claiming items, receiver verification, volunteer missions, "
                        + "food safety, and impact tracking. Try asking about one of these topics!",
                "GENERAL"
        );
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }
        return false;
    }
}