package com.pictet.adventurebook.exception;

public class InvalidSectionException extends RuntimeException {

    public InvalidSectionException(Integer sectionId) {
        super("Section not found with id: " + sectionId);
    }
}
