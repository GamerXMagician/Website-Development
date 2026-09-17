/* ============================================================================
   PORTFOLIO FILTERING
   Filter projects by category with smooth animations
   ============================================================================ */

document.addEventListener('DOMContentLoaded', function() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filterValue = this.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Filter and animate projects
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          // Show card
          card.style.display = 'grid';
          card.style.animation = 'none';
          // Trigger reflow to restart animation
          void card.offsetWidth;
          card.style.animation = 'fadeInUp 0.6s ease-out';
        } else {
          // Hide card
          card.style.display = 'none';
        }
      });
    });
  });
});
