const form = document.getElementById("registrationForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = form.fullName.value;
    const email = form.email.value;

    alert(
        "Registration Successful!\n\n" +
        "Student Name: " + name + "\n" +
        "Email: " + email + "\n\n" +
        "Welcome to INPT 🎓"
    );

    form.reset();
});

//******************************************************** */

const professorSelect = document.getElementById("professor");

const fixedProfessor = "Hassan-Farsi";

professorSelect.addEventListener("change", function () {
    alert("Seriously 😐 you can’t change this professor.");
    professorSelect.value = fixedProfessor;
});

//******************************************************** */

const photoInput = document.getElementById("photo");
const photoPreview = document.getElementById("photoPreview");

photoInput.addEventListener("change", function () {
    const file = photoInput.files[0];

    if (!file) return;

    // Only images
    if (!file.type.startsWith("image/")) {
        alert("Please upload an image file.");
        photoInput.value = "";
        photoPreview.style.display = "none";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        photoPreview.src = e.target.result;
        photoPreview.style.display = "block";
    };

    reader.readAsDataURL(file);
});
