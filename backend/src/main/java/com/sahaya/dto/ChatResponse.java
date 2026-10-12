package com.sahaya.dto;

public class ChatResponse {

    private String reply;
    private String category;

    public ChatResponse() {}

    public ChatResponse(String reply, String category) {
        this.reply = reply;
        this.category = category;
    }

    public String getReply() {
        return reply;
    }

    public String getCategory() {
        return category;
    }
}