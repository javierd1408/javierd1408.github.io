// Tel input config
const input = document.querySelector("#telefono");
if (input) {
    window.intlTelInput(input, {
        preferredCountries: ["ve", "ar", "co", "cl", "us", "es"],
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
    });
}

// Evitar envío real del form
document.querySelector("#contact-form").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Formulario listo para integrar backend o mailto.");
});
