export class SimpleQuoteModal {
    constructor() {
        this.state = {
            bhk: null,
            package: null
        };
        this.init();
    }

    init() {
        this.renderModal();
        this.bindEvents();
    }

    renderModal() {
        const modalHTML = `
            <div class="simple-quote-overlay" id="simpleQuoteModal">
                <div class="simple-quote-modal">
                    <div class="modal-header">
                        <h3 class="modal-title">Get an Estimate</h3>
                        <button class="close-modal" aria-label="Close">&times;</button>
                    </div>

                    <div class="modal-body">
                        <!-- Configuration -->
                        <div class="form-section">
                            <div class="section-title">Home Size</div>
                            <div class="options-grid" id="bhkOptions">
                                ${['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Villa'].map(type => `
                                    <div class="option-card" data-type="bhk" data-value="${type}">${type}</div>
                                `).join('')}
                            </div>
                            <span class="error-msg" id="bhkError">Please select a home size</span>
                        </div>

                        <!-- Package -->
                        <div class="form-section">
                            <div class="section-title">Package Type</div>
                            <div class="options-grid" id="packageOptions">
                                ${['Essential', 'Premium', 'Luxury'].map(type => `
                                    <div class="option-card" data-type="package" data-value="${type}">${type}</div>
                                `).join('')}
                            </div>
                            <span class="error-msg" id="packageError">Please select a package</span>
                        </div>

                        <!-- Contact Details -->
                        <div class="form-section">
                            <div class="section-title">Your Details</div>
                            
                            <div class="form-group">
                                <input type="text" id="sqName" class="form-input" placeholder="Full Name">
                                <span class="error-msg">Name is required</span>
                            </div>

                            <div class="form-group">
                                <input type="tel" id="sqPhone" class="form-input" placeholder="Phone Number">
                                <span class="error-msg">Valid phone number is required</span>
                            </div>

                            <div class="form-group">
                                <input type="email" id="sqEmail" class="form-input" placeholder="Email Address">
                                <span class="error-msg">Valid email is required</span>
                            </div>

                            <div class="form-group">
                                <select id="sqCity" class="form-select">
                                    <option value="" disabled selected>Select City</option>
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Other">Other</option>
                                </select>
                                <span class="error-msg">Please select a city</span>
                            </div>
                        </div>

                        <button id="sqSubmitBtn" class="whatsapp-btn">
                            <span>Get Quote via WhatsApp</span>
                        </button>

                        <p class="privacy-text">
                            By submitting, you agree to our privacy policy. 
                            Protected by reCAPTCHA and Google Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        this.elements = {
            modal: document.getElementById('simpleQuoteModal'),
            closeBtn: document.querySelector('.close-modal'),
            submitBtn: document.getElementById('sqSubmitBtn'),
            bhkOptions: document.getElementById('bhkOptions'),
            packageOptions: document.getElementById('packageOptions'),
            inputs: {
                name: document.getElementById('sqName'),
                phone: document.getElementById('sqPhone'),
                email: document.getElementById('sqEmail'),
                city: document.getElementById('sqCity')
            }
        };
    }

    bindEvents() {
        // Open Modal
        document.addEventListener('click', (e) => {
            if (e.target.matches('.get-quote-btn')) {
                e.preventDefault();
                this.open();
            }
        });

        // Close Modal
        this.elements.closeBtn.addEventListener('click', () => this.close());
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) this.close();
        });

        // Option Selection
        this.bindOptionSelection(this.elements.bhkOptions, 'bhk');
        this.bindOptionSelection(this.elements.packageOptions, 'package');

        // Submit
        this.elements.submitBtn.addEventListener('click', () => this.submit());
    }

    bindOptionSelection(container, stateKey) {
        container.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', () => {
                // Deselect all in this group
                container.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
                // Select clicked
                card.classList.add('selected');
                // Update state
                this.state[stateKey] = card.dataset.value;
                // Clear error
                document.getElementById(`${stateKey}Error`).style.display = 'none';
            });
        });
    }

    validate() {
        let isValid = true;
        const data = {};

        // Validate Options
        if (!this.state.bhk) {
            document.getElementById('bhkError').style.display = 'block';
            isValid = false;
        }
        if (!this.state.package) {
            document.getElementById('packageError').style.display = 'block';
            isValid = false;
        }

        // Validate Inputs
        // Name
        if (!this.elements.inputs.name.value.trim()) {
            this.elements.inputs.name.classList.add('error');
            isValid = false;
        } else {
            this.elements.inputs.name.classList.remove('error');
            data.name = this.elements.inputs.name.value.trim();
        }

        // Phone
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(this.elements.inputs.phone.value.trim().replace(/\D/g, ''))) {
            this.elements.inputs.phone.classList.add('error');
            isValid = false;
        } else {
            this.elements.inputs.phone.classList.remove('error');
            data.phone = this.elements.inputs.phone.value.trim();
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.elements.inputs.email.value.trim())) {
            this.elements.inputs.email.classList.add('error');
            isValid = false;
        } else {
            this.elements.inputs.email.classList.remove('error');
            data.email = this.elements.inputs.email.value.trim();
        }

        // City
        if (!this.elements.inputs.city.value) {
            this.elements.inputs.city.classList.add('error');
            isValid = false;
        } else {
            this.elements.inputs.city.classList.remove('error');
            data.city = this.elements.inputs.city.value;
        }

        return isValid ? data : null;
    }

    submit() {
        const formData = this.validate();
        if (!formData) return;

        const text = `*New Quote Request*
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
City: ${formData.city}

*Requirement:*
Configuration: ${this.state.bhk}
Package: ${this.state.package}`;

        window.open(`https://wa.me/919397979979?text=${encodeURIComponent(text)}`, '_blank');
        this.close();
    }

    open() {
        this.elements.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.elements.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}
