// Mobile menu toggle
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-menu-toggle]');
  if (t) {
    document.querySelector('.nav-links')?.classList.toggle('open');
  }
  // Adventure pick toggle (contact)
  const pick = e.target.closest('.pick');
  if (pick) {
    pick.parentElement.querySelectorAll('.pick').forEach(p => p.classList.remove('active'));
    pick.classList.add('active');
  }
});

// Form submit demo
document.addEventListener('submit', (e) => {
  if (e.target.matches('[data-demo-form]')) {
    e.preventDefault();
    alert('Thanks! Our team will be in touch soon.');
    e.target.reset();
  }
});
// Image gallery functionality
document.addEventListener('click', (e) => {
  const thumb = e.target.closest('.thumb');
  if (thumb) {
    e.preventDefault(); // Prevent default link behavior
    const heroGallery = thumb.closest('.hero-gallery');
    if (heroGallery) {
      const mainImage = heroGallery.querySelector('.main-image');
      const newSrc = thumb.src;
      const newAlt = thumb.alt;
      
      // Update main image
      mainImage.src = newSrc;
      mainImage.alt = newAlt;
      
      // Update active thumbnail
      heroGallery.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    }
  }
});
// Authentication form validation
document.addEventListener('submit', (e) => {
  if (e.target.matches('.auth-form')) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Basic validation
    if (e.target.querySelector('#password') && e.target.querySelector('#confirmPassword')) {
      // Sign up form validation
      if (data.password !== data.confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
      }
      
      if (data.password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
      }
      
      if (!data.terms) {
        alert('Please agree to the Terms of Service and Privacy Policy.');
        return;
      }
      
      // Simulate successful sign up
      alert('Account created successfully! Please login with your new credentials.');
      window.location.href = 'login.html';
    } else {
      // Login form validation
      if (!data.email || !data.password) {
        alert('Please fill in all required fields.');
        return;
      }
      
      // Simulate successful login
      alert('Login successful! Welcome to Picnic Games.');
      // Redirect to a dashboard or back to previous page
      const referrer = document.referrer || 'index.html';
      window.location.href = referrer;
    }
  }
});

// Social login handlers
document.addEventListener('click', (e) => {
  if (e.target.matches('.btn-social')) {
    e.preventDefault();
    const provider = e.target.classList.contains('btn-google') ? 'Google' : 'Facebook';
    alert(`Continue with ${provider} - This would integrate with ${provider}'s OAuth service.`);
  }
});
// Video Modal functionality
document.addEventListener('DOMContentLoaded', () => {
  const watchStoryBtn = document.getElementById('watchStoryBtn');
  const videoModal = document.getElementById('videoModal');
  const closeVideoModal = document.getElementById('closeVideoModal');
  const storyVideo = document.getElementById('storyVideo');

  // Open video modal
  if (watchStoryBtn) {
    watchStoryBtn.addEventListener('click', () => {
      videoModal.classList.add('show');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      
      // Auto-play video when modal opens
      if (storyVideo) {
        setTimeout(() => {
          storyVideo.play().catch(e => {
            console.log('Auto-play prevented:', e);
          });
        }, 300);
      }
    });
  }

  // Close video modal
  function closeModal() {
    videoModal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Pause video when modal closes
    if (storyVideo) {
      storyVideo.pause();
      storyVideo.currentTime = 0; // Reset to beginning
    }
  }

  // Close modal when clicking X button
  if (closeVideoModal) {
    closeVideoModal.addEventListener('click', closeModal);
  }

  // Close modal when clicking outside the modal content
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('show')) {
      closeModal();
    }
  });

  // Handle video end
  if (storyVideo) {
    storyVideo.addEventListener('ended', () => {
      // Optionally keep modal open or close after video ends
      // closeModal(); // Uncomment to close modal when video ends
    });
  }
});

// Highlight active nav link by current path
(function () {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });
})();
