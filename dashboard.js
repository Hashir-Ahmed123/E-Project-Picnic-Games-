// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (typeof window.firebaseAuth === 'undefined') {
        console.error('Firebase not initialized');
        window.location.href = 'login.html';
        return;
    }

    const { auth, onAuthStateChanged, signOut } = window.firebaseAuth;

    // Check authentication state
    auth.onAuthStateChanged(function(user) {
        if (!user) {
            // User is not signed in, redirect to login
            window.location.href = 'login.html';
            return;
        }

        // User is signed in, load dashboard data
        loadUserData(user);
        loadDashboardData();
        setupEventListeners();
    });

    // Load user data into dashboard
    function loadUserData(user) {
        // Update user profile information
        document.getElementById('userName').textContent = user.displayName || 'User';
        document.getElementById('userEmail').textContent = user.email;
        
        // Format member since date
        const creationTime = user.metadata.creationTime;
        const memberSince = new Date(creationTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
        document.getElementById('memberSince').textContent = memberSince;

        // Update avatar if user has photo URL
        if (user.photoURL) {
            document.getElementById('userAvatar').src = user.photoURL;
        }

        // Generate avatar based on email if no photo URL
        if (!user.photoURL) {
            // Use a simple text-based avatar as fallback
            const firstLetter = (user.displayName || user.email).charAt(0).toUpperCase();
            const avatarUrl = `https://ui-avatars.com/api/?name=${firstLetter}&background=random&color=fff&size=100`;
            const avatarImg = document.getElementById('userAvatar');
            
            // Load avatar with error handling
            avatarImg.onload = function() {
                console.log('Avatar loaded successfully');
            };
            avatarImg.onerror = function() {
                console.log('Avatar failed to load, using fallback');
                // Fallback to a colored circle with initial
                this.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23${Math.floor(Math.random()*16777215).toString(16)}'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='40' font-family='Arial'%3E${firstLetter}%3C/text%3E%3C/svg%3E`;
            };
            avatarImg.src = avatarUrl;
        }
    }

    // Load dashboard data (bookings, stats, etc.)
    function loadDashboardData() {
        // Simulate loading data (in real app, this would come from a database)
        setTimeout(() => {
            // Update stats with sample data
            document.getElementById('totalBookings').textContent = '3';
            document.getElementById('upcomingTrips').textContent = '1';
            document.getElementById('favoriteResorts').textContent = '2';
            document.getElementById('totalSpent').textContent = '$850';

            // Load sample bookings
            loadSampleBookings();
        }, 1000);
    }

    // Load sample bookings data
    function loadSampleBookings() {
        const bookingsList = document.getElementById('bookingsList');
        
        // Sample booking data
        const bookings = [
            {
                id: 1,
                resort: 'Pine Whispers Retreat',
                date: '2024-06-15',
                status: 'upcoming',
                price: '$240',
                image: 'img/resort-pine.jpg'
            },
            {
                id: 2,
                resort: 'Azure Coast Resort',
                date: '2024-03-10',
                status: 'completed',
                price: '$310',
                image: 'img/resort-azure.jpg'
            },
            {
                id: 3,
                resort: 'Mirror Lake Lodge',
                date: '2024-02-20',
                status: 'completed',
                price: '$215',
                image: 'img/resort-mirror.jpg'
            }
        ];

        if (bookings.length === 0) {
            bookingsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <p>No bookings yet</p>
                    <a href="resorts.html" class="btn btn-primary">Book Your First Adventure</a>
                </div>
            `;
            return;
        }

        bookingsList.innerHTML = bookings.map(booking => `
            <div class="booking-item">
                <div class="booking-image">
                    <img src="${booking.image}" alt="${booking.resort}" />
                </div>
                <div class="booking-details">
                    <h4>${booking.resort}</h4>
                    <p class="booking-date">
                        <i class="fas fa-calendar"></i> ${formatDate(booking.date)}
                    </p>
                    <p class="booking-price">${booking.price}</p>
                </div>
                <div class="booking-status">
                    <span class="status-badge status-${booking.status}">
                        ${booking.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                    </span>
                </div>
            </div>
        `).join('');
    }

    // Setup event listeners
    function setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async function(e) {
                e.preventDefault();
                try {
                    await signOut();
                    showMessage('Logged out successfully', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } catch (error) {
                    console.error('Logout error:', error);
                    showMessage('Error logging out', 'error');
                }
            });
        }

        // Edit profile button
        const editProfileBtn = document.getElementById('editProfileBtn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', function() {
                showEditProfileModal();
            });
        }

        // Avatar upload
        const avatarUpload = document.getElementById('avatarUpload');
        if (avatarUpload) {
            avatarUpload.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    // Validate file type
                    if (!file.type.startsWith('image/')) {
                        showMessage('Please select an image file', 'error');
                        return;
                    }
                    
                    // Validate file size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        showMessage('Image size should be less than 5MB', 'error');
                        return;
                    }
                    
                    // Handle avatar upload (in real app, upload to Firebase Storage)
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const avatarImg = document.getElementById('userAvatar');
                        avatarImg.src = e.target.result;
                        
                        // Update user profile in Firebase (in real app)
                        if (auth.currentUser) {
                            // Note: In production, you'd upload to Firebase Storage first
                            // then update the user's photoURL
                            showMessage('Avatar updated successfully!', 'success');
                        }
                    };
                    reader.onerror = function() {
                        showMessage('Error reading image file', 'error');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    // Show edit profile modal
    function showEditProfileModal() {
        const user = auth.currentUser;
        if (!user) return;

        // Create modal HTML
        const modalHtml = `
            <div class="modal-overlay" id="editProfileModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Edit Profile</h3>
                        <button class="modal-close" id="closeModal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="editProfileForm">
                            <div class="form-group">
                                <label for="editName">Display Name</label>
                                <input type="text" id="editName" name="name" value="${user.displayName || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="editEmail">Email</label>
                                <input type="email" id="editEmail" name="email" value="${user.email}" disabled>
                                <small>Email cannot be changed</small>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="btn btn-ghost" id="cancelEdit">Cancel</button>
                                <button type="submit" class="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Setup modal event listeners
        const modal = document.getElementById('editProfileModal');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelEdit');
        const form = document.getElementById('editProfileForm');

        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const newName = document.getElementById('editName').value.trim();
            
            if (!newName) {
                showMessage('Please enter a display name', 'error');
                return;
            }

            try {
                const user = auth.currentUser;
                await user.updateProfile({
                    displayName: newName
                });

                // Update UI
                document.getElementById('userName').textContent = newName;
                showMessage('Profile updated successfully!', 'success');
                closeModal();
                
            } catch (error) {
                console.error('Error updating profile:', error);
                showMessage('Error updating profile', 'error');
            }
        });
    }

    // Helper function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Simple MD5 hash function for Gravatar
    function md5(string) {
        // This is a simplified version - in production, use a proper crypto library
        let hash = 0;
        if (string.length === 0) return hash.toString();
        for (let i = 0; i < string.length; i++) {
            const char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }
});

// Add dashboard-specific styles
const dashboardStyles = document.createElement('style');
dashboardStyles.textContent = `
    .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
        margin-top: 32px;
    }

    .dashboard-card {
        background: var(--card);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: var(--shadow);
    }

    .card-header {
        padding: 20px;
        border-bottom: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .card-header h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--ink-2);
    }

    .card-header i {
        color: var(--green-deep);
        margin-right: 8px;
    }

    .card-body {
        padding: 20px;
    }

    .profile-info {
        display: flex;
        gap: 20px;
        align-items: flex-start;
    }

    .profile-avatar {
        position: relative;
    }

    .profile-avatar img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: block !important;
        max-width: 100px !important;
        max-height: 100px !important;
    }

    .avatar-upload {
        position: absolute;
        bottom: 0;
        right: 0;
        background: var(--green-deep);
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 2px solid white;
    }

    .avatar-upload-btn {
        cursor: pointer;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        background: var(--green-deep);
        border: 2px solid white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .avatar-upload-btn:hover {
        background: #059669;
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .avatar-upload-btn i {
        font-size: 14px;
        margin: 0;
    }

    .profile-details h3 {
        margin: 0 0 8px 0;
        font-size: 24px;
        color: var(--ink-2);
    }

    .profile-details p {
        margin: 0 0 4px 0;
        color: var(--muted);
    }

    .text-muted {
        color: var(--muted) !important;
    }

    .profile-actions {
        margin-top: 16px;
    }

    .btn-sm {
        padding: 8px 16px;
        font-size: 14px;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 16px;
    }

    .stat-item {
        text-align: center;
        padding: 16px;
        background: var(--bg-soft);
        border-radius: 12px;
    }

    .stat-number {
        font-size: 32px;
        font-weight: 700;
        color: var(--green-deep);
        margin-bottom: 4px;
    }

    .stat-label {
        font-size: 14px;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .bookings-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .booking-item {
        display: flex;
        gap: 16px;
        padding: 16px;
        background: var(--bg-soft);
        border-radius: 12px;
        align-items: center;
    }

    .booking-image img {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        object-fit: cover;
    }

    .booking-details {
        flex: 1;
    }

    .booking-details h4 {
        margin: 0 0 4px 0;
        font-size: 16px;
        color: var(--ink-2);
    }

    .booking-date {
        font-size: 14px;
        color: var(--muted);
        margin: 0 0 4px 0;
    }

    .booking-date i {
        margin-right: 4px;
    }

    .booking-price {
        font-weight: 600;
        color: var(--green-deep);
        margin: 0;
    }

    .booking-status {
        text-align: right;
    }

    .status-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
    }

    .status-upcoming {
        background: #dcfce7;
        color: #166534;
    }

    .status-completed {
        background: #f3f4f6;
        color: #6b7280;
    }

    .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: var(--muted);
    }

    .empty-state i {
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
    }

    .empty-state p {
        margin: 0 0 20px 0;
        font-size: 16px;
    }

    .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
    }

    .action-card {
        display: block;
        padding: 20px;
        background: var(--bg-soft);
        border-radius: 12px;
        text-align: center;
        text-decoration: none;
        color: var(--ink-2);
        transition: all 0.3s ease;
    }

    .action-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow);
        color: var(--green-deep);
    }

    .action-card i {
        font-size: 32px;
        color: var(--green-deep);
        margin-bottom: 12px;
        display: block;
    }

    .action-card h4 {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 600;
    }

    .action-card p {
        margin: 0;
        font-size: 14px;
        color: var(--muted);
    }

    @media (max-width: 768px) {
        .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 16px;
        }

        .profile-info {
            flex-direction: column;
            text-align: center;
        }

        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .booking-item {
            flex-direction: column;
            text-align: center;
        }

        .booking-status {
            text-align: center;
            margin-top: 12px;
        }

        .actions-grid {
            grid-template-columns: 1fr;
        }
    }

    /* Modal Styles */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease-out;
    }

    .modal-content {
        background: white;
        border-radius: 16px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        animation: slideUp 0.3s ease-out;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px;
        border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #1f2937;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        color: #6b7280;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: all 0.2s ease;
    }

    .modal-close:hover {
        background: #f3f4f6;
        color: #374151;
    }

    .modal-body {
        padding: 24px;
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #374151;
    }

    .form-group input {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 16px;
        transition: border-color 0.2s ease;
    }

    .form-group input:focus {
        outline: none;
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    .form-group input:disabled {
        background: #f9fafb;
        color: #6b7280;
        cursor: not-allowed;
    }

    .form-group small {
        display: block;
        margin-top: 4px;
        color: #6b7280;
        font-size: 14px;
    }

    .form-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 24px;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    /* Force avatar styles to override any conflicts */
    #userAvatar {
        width: 100px !important;
        height: 100px !important;
        border-radius: 50% !important;
        object-fit: cover !important;
        border: 3px solid white !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        display: block !important;
        max-width: 100px !important;
        max-height: 100px !important;
        background: #f0f0f0 !important;
    }

    /* Ensure profile avatar container is properly styled */
    .profile-avatar {
        position: relative !important;
        display: inline-block !important;
    }
`;
document.head.appendChild(dashboardStyles);
