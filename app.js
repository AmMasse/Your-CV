// Main function to generate the CV
function generateCV() {
    const cvData = getFormData();

    // Validate form data
    if (!cvData) {
        alert("Please fill out all required fields!");
        return;
    }

    // Generate formatted content for the CV
    const cvContent = `
        ${createSection('cv-header', `
            <h2>${cvData.fullName}</h2>
            ${cvData.profilePictureURL ? `<img src="${cvData.profilePictureURL}" alt="Profile Picture" class="profile-picture">` : ''}
            <p><strong>Email:</strong> ${cvData.email}</p>
            <p><strong>Phone:</strong> ${cvData.phone}</p>
        `, '')}
        ${createSection('cv-section', '<h3>Bio</h3>', `<p>${cvData.bio}</p>`)}
        ${createSection('cv-section', '<h3>Education</h3>', formatAsList(cvData.education))}
        ${createSection('cv-section', '<h3>Work Experience</h3>', formatAsList(cvData.workExperience))}
        ${createSection('cv-section', '<h3>Skills</h3>', formatAsList(cvData.skills))}
        ${cvData.certifications ? createSection('cv-section', '<h3>Certifications</h3>', formatAsList(cvData.certifications)) : ''}
        ${cvData.references ? createSection('cv-section', '<h3>References</h3>', formatAsList(cvData.references)) : ''}
    `;

    // Output CV and append a download button
    document.getElementById('cvOutput').innerHTML = cvContent + `
        <button id="downloadBtn" onclick="downloadPDF()">Download as PDF</button>
    `;
}

// Helper function to create reusable sections
function createSection(sectionClass, title, content) {
    return `
        <div class="${sectionClass}">
            ${title ? `${title}` : ''}
            ${content}
        </div>
    `;
}

// Function to gather and validate form data
function getFormData() {
    const fields = ['fullName', 'email', 'phone', 'bio', 'education', 'workExperience', 'skills'];
    const cvData = {};
    
    // Loop over each field and store value
    for (let field of fields) {
        const value = document.getElementById(field).value.trim();
        if (!value) {
            document.getElementById(field).focus();
            return null;
        }
        cvData[field] = value;
    }

    cvData.certifications = document.getElementById('certifications').value.trim();
    cvData.references = document.getElementById('references').value.trim();
    const profilePicture = document.getElementById('profilePicture').files[0];
    cvData.profilePictureURL = profilePicture ? URL.createObjectURL(profilePicture) : '';

    return cvData;
}

// Function to format input text into a bulleted list
function formatAsList(input) {
    if (!input) return '';  // Handle null or undefined input
    const items = input.split(/\n|,/).map(item => item.trim()).filter(Boolean);
    return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
}

// Function to download CV as a PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const cvData = getFormData();

    if (!cvData) {
        alert("Please fill out the form before downloading the PDF!");
        return;
    }

    // Set up PDF content with basic formatting
    doc.setFontSize(18);
    doc.text(cvData.fullName, 10, 20);
    doc.setFontSize(12);
    doc.text(`Email: ${cvData.email}`, 10, 30);
    doc.text(`Phone: ${cvData.phone}`, 10, 40);

    const yOffset = 50;
    addPDFSection(doc, "Bio", cvData.bio, yOffset);
    addPDFSection(doc, "Education", formatAsList(cvData.education), yOffset + 20);
    addPDFSection(doc, "Work Experience", formatAsList(cvData.workExperience), yOffset + 40);
    addPDFSection(doc, "Skills", formatAsList(cvData.skills), yOffset + 60);
    if (cvData.certifications) {
        addPDFSection(doc, "Certifications", formatAsList(cvData.certifications), yOffset + 80);
    }
    if (cvData.references) {
        addPDFSection(doc, "References", formatAsList(cvData.references), yOffset + 100);
    }

    // Save the PDF
    doc.save('cv.pdf');
}

// Helper function to add a section to the PDF
function addPDFSection(doc, title, content, yOffset) {
    doc.setFontSize(14);
    doc.text(title, 10, yOffset);
    doc.setFontSize(12);
    doc.text(content, 10, yOffset + 10);
}