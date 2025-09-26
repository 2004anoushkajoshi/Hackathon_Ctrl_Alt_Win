// Auto rickshaw animation for highlights section

document.addEventListener('DOMContentLoaded', function() {
    initializeAnimation();
});

function initializeAnimation() {
    // Get DOM elements
    const rickshaw = document.querySelector('.auto-rickshaw');
    const markers = document.querySelectorAll('.text-marker');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    if (!rickshaw || !startBtn) return;
    
    // Animation variables
    let animationId;
    let position = -100;
    let isAnimating = false;
    let direction = 1; // 1 for right, -1 for left
    
    // Define points along the road with their positions and corresponding text markers
    const points = [
        { x: 15, marker: 0 },   // Point A - Marker 1
        { x: 30, marker: 1 },   // Point B - Marker 2
        { x: 50, marker: 2 },   // Point C - Marker 3
        { x: 70, marker: 3 },   // Point D - Marker 4
        { x: 85, marker: 4 }    // Point E - Marker 5
    ];
    
    // Track which markers have been shown
    let shownMarkers = [];
    
    // Calculate Y position based on X for the curved road
    function calculateY(x) {
        // Simplified curve calculation based on the SVG path
        if (x < 500) {
            return 50 + (x / 500) * 20; // First half of the curve
        } else {
            return 70 - ((x - 500) / 500) * 60; // Second half of the curve
        }
    }
    
    // Start animation
    function startAnimation() {
        if (isAnimating) return;
        
        isAnimating = true;
        animate();
    }
    
    // Pause animation
    function pauseAnimation() {
        isAnimating = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    }
    
    // Reset animation
    function resetAnimation() {
        pauseAnimation();
        position = -100;
        direction = 1;
        updateRickshawPosition();
        
        // Hide all markers
        markers.forEach(marker => {
            marker.style.opacity = '0';
        });
        
        shownMarkers = [];
    }
    
    // Update rickshaw position and check for markers
    function updateRickshawPosition() {
        // Calculate position in percentage of container width
        const containerWidth = document.querySelector('.animation-container').offsetWidth;
        const percentX = (position / containerWidth) * 100;
        
        // Update rickshaw position
        rickshaw.style.left = `${position}px`;
        
        // Calculate Y offset based on curved road
        const yOffset = calculateY(percentX * 10) - 50; // Scale to match SVG
        rickshaw.style.bottom = `${95 + yOffset}px`;
        
        // Flip rickshaw when changing direction
        if (direction === 1) {
            rickshaw.style.transform = 'scaleX(1)';
        } else {
            rickshaw.style.transform = 'scaleX(-1)';
        }
        
        // Check if we've reached any points
        points.forEach((point, index) => {
            // Check if we're close to this point and haven't shown the marker yet
            if (Math.abs(percentX - point.x) < 2 && !shownMarkers.includes(index)) {
                // Show the corresponding marker
                markers[point.marker].style.opacity = '1';
                shownMarkers.push(index);
                
                // Hide the marker after 3 seconds
                setTimeout(() => {
                    markers[point.marker].style.opacity = '0';
                }, 3000);
            }
        });
        
        // Rotate wheels
        const wheels = document.querySelectorAll('.wheel');
        const rotation = (position / 5) % 360;
        wheels.forEach(wheel => {
            wheel.style.transform = `rotate(${rotation}deg)`;
        });
    }
    
    // Main animation function
    function animate() {
        if (!isAnimating) return;
        
        // Move the rickshaw
        position += 2 * direction;
        
        // Change direction at boundaries
        const containerWidth = document.querySelector('.animation-container').offsetWidth;
        if (position > containerWidth + 100) {
            direction = -1;
        } else if (position < -100) {
            direction = 1;
        }
        
        updateRickshawPosition();
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Event listeners
    startBtn.addEventListener('click', startAnimation);
    pauseBtn.addEventListener('click', pauseAnimation);
    resetBtn.addEventListener('click', resetAnimation);
    
    // Initialize
    resetAnimation();
    
    // Add some random movement to trees for wind effect
    const trees = document.querySelectorAll('.tree');
    trees.forEach(tree => {
        tree.style.transform = `translateX(${Math.random() * 10 - 5}px)`;
    });
    
    // Click on rickshaw to toggle animation
    rickshaw.addEventListener('click', function() {
        if (isAnimating) {
            pauseAnimation();
        } else {
            startAnimation();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Reset animation on resize to maintain proper positioning
        const wasAnimating = isAnimating;
        pauseAnimation();
        updateRickshawPosition();
        if (wasAnimating) {
            startAnimation();
        }
    });
}