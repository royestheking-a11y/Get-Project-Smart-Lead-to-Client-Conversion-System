const isValidEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const emails = [
    "max@mxwebdesign.com",
    "test@gmail.com",
    "  max@mxwebdesign.com  ", // should be trimmed before check
    "invalid-email",
    "max@mxwebdesign", // missing TLD, but regex expects dot
    "max@.com"
];

console.log("Validation Results:");
emails.forEach(e => {
    const normalized = e.trim().toLowerCase();
    console.log(`'${e}' -> '${normalized}': ${isValidEmail(normalized)}`);
});
