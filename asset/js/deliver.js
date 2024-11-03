document.getElementById('deliveryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        destination: {
            country: 'Japan',
            district: 'Tokyo',
            address: 'XXX Hotel'
        },
        pickup: {
            country: 'Hong Kong',
            district: 'Hong Kong Island',
            address: 'XXXXX'
        },
        doorToDoor: true,
        estimatedFee: 342,
        remarks: document.querySelector('textarea').value
    };

    // Here you can handle the form submission
    console.log('Form submitted:', formData);
    alert('Delivery request submitted successfully!');
});