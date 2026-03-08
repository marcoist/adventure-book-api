package com.pictet.adventurebook.validation;

import java.util.List;

public record ValidationResult(
        boolean valid,
        List<String> errors
) {
    public static ValidationResult success() {
        return new ValidationResult(true, List.of());
    }

    public static ValidationResult invalid(List<String> errors) {
        return new ValidationResult(false, errors);
    }

    public static ValidationResult invalid(String error) {
        return new ValidationResult(false, List.of(error));
    }
}
