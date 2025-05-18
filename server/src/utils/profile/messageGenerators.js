exports.generateUpdateMessage = (updatedFields) => {
    const messageComponents = [];
    const updateSuccessFields = updatedFields.filter((field) => ["Username", "Password"].includes(field));
    if (updateSuccessFields.length) {
        messageComponents.push(`${updateSuccessFields.join(", ")} updated successfully.`);
    }
    if (updatedFields.includes("Email")) {
        messageComponents.push("Please check your email to confirm the new email address.");
    } else if (!updatedFields.length) {
        messageComponents.push("No fields were changed.");
    }
    return messageComponents.join(" ");
};
