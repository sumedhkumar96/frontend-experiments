document.addEventListener('DOMContentLoaded', () => {
    const uploaderNameInput = document.getElementById('uploader-name');
    const nameError = document.getElementById('name-error');
    const fileDropZone = document.getElementById('file-drop-zone');
    const uploadedFileBox = document.getElementById('uploaded-file-box');
    const uploadButton = document.querySelector('button[type="submit"]');
    const fileInput = document.getElementById('file-input');
    let uploadedFile = null; // Store the uploaded file here

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        uploadedFile = file; // Store the uploaded file
        handleFileUpload(file);
    });

    // Function to handle file upload and update the file box
    function handleFileUpload(file) {
        if (file) {
            uploadedFileBox.innerHTML = `<p>Uploaded File: ${file.name}</p>`;
            fileDropZone.classList.add('file-uploaded');
            uploadButton.disabled = false; // Enable the "Upload" button
        } else {
            uploadedFileBox.innerHTML = `<p>No file uploaded</p>`;
            fileDropZone.classList.remove('file-uploaded');
            uploadButton.disabled = true; // Disable the "Upload" button
        }
    }

    // Enable clicking inside the file drop zone to trigger file input
    fileDropZone.addEventListener('click', () => {
        fileInput.click();
    });

    uploadButton.addEventListener('click', () => {
        // Check if there is an uploaded file
        if (uploadedFile) {
            const uploaderName = uploaderNameInput.value.trim();

            // Validate Uploader Name
            if (!uploaderName) {
                nameError.textContent = 'Uploader Name is required';
            } else {
                nameError.textContent = '';
                // Perform the upload action here (e.g., store in web storage)
                localStorage.setItem('uploadedFileName', uploadedFile.name);
                alert(`Uploading File: ${uploadedFile.name}`);
                // Reset the form and clear the uploaded file
                uploadedFile = null;
                handleFileUpload(null); // Clear the uploaded file box
                document.getElementById('my-form').reset();
            }
        }
    });

    // Form validation for Uploader Name
    uploaderNameInput.addEventListener('input', () => {
        const uploaderName = uploaderNameInput.value.trim();
        if (!uploaderName) {
            nameError.textContent = 'Uploader Name is required';
        } else {
            nameError.textContent = '';
        }
    });

        // Function to fetch IP address and location
        async function fetchUserIpAndLocation() {
            try {
                const response = await fetch('http://ip-api.com/json/', {
                    method: 'GET'
                });
    
                if (response.ok) {
                    const data = await response.json();
                    displayUserIpAndLocation(data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error(error);
                document.getElementById('user-ip').textContent = 'IP Address: Not available';
                document.getElementById('user-location').textContent = 'Location: Not available';
            }
        }
    
        // Function to display user IP address and location
        function displayUserIpAndLocation(data) {
            const userIpElement = document.getElementById('user-ip');
            const userLocationElement = document.getElementById('user-location');
    
            if (data.query) {
                userIpElement.textContent = `IP Address: ${data.query}`;
            } else {
                userIpElement.textContent = 'IP Address: Not available';
            }
    
            if (data.country && data.regionName && data.city) {
                userLocationElement.textContent = `Location: ${data.country}, ${data.regionName}, ${data.city}`;
            } else {
                userLocationElement.textContent = 'Location: Not available';
            }
        }
    
        // Call the function to fetch and display user IP address and location
        fetchUserIpAndLocation();
});