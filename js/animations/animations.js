// Fonction pour animer le changement d'étape
function animateStepChange(currentStep, nextStep, direction) {
    const currentSection = document.querySelector(`[data-step="${currentStep}"]`);
    const nextSection = document.querySelector(`[data-step="${nextStep}"]`);
    
    // Définir la direction de l'animation
    const startY = direction === 'next' ? '100%' : '-100%';
    const endY = '0%';
    
    // Cacher l'étape actuelle
    currentSection.style.transition = 'transform 0.5s ease-out';
    currentSection.style.transform = `translateY(${direction === 'next' ? '-100%' : '100%'})`;
    
    // Préparer la prochaine étape
    nextSection.style.transition = 'none';
    nextSection.style.transform = `translateY(${startY})`;
    nextSection.classList.remove('hidden');
    
    // Forcer un reflow pour que la transition fonctionne
    nextSection.offsetHeight;
    
    // Animer la prochaine étape
    nextSection.style.transition = 'transform 0.5s ease-out';
    nextSection.style.transform = `translateY(${endY})`;
    
    // Cacher l'étape précédente après l'animation
    setTimeout(() => {
        currentSection.classList.add('hidden');
        currentSection.style.transform = '';
        nextSection.style.transition = '';
    }, 500);
}

// Fonction pour mettre à jour l'icône de retour
function updateBackIcon(currentStep) {
    const backIcon = document.querySelector('.navbar-icon a');
    if (currentStep === 1) {
        backIcon.href = '/pages/';
    } else {
        backIcon.href = '#';
        backIcon.onclick = (e) => {
            e.preventDefault();
            const prevStep = currentStep - 1;
            animateStepChange(currentStep, prevStep, 'prev');
            updateBackIcon(prevStep);
        };
    }
}

// Écouteurs d'événements pour les boutons de navigation
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('multiStepForm');
    
    form.addEventListener('click', (e) => {
        if (e.target.matches('[data-next]')) {
            const currentStep = parseInt(e.target.closest('.form-step').dataset.step);
            const nextStep = parseInt(e.target.dataset.next);
            animateStepChange(currentStep, nextStep, 'next');
            updateBackIcon(nextStep);
        } else if (e.target.matches('[data-prev]')) {
            const currentStep = parseInt(e.target.closest('.form-step').dataset.step);
            const prevStep = parseInt(e.target.dataset.prev);
            animateStepChange(currentStep, prevStep, 'prev');
            updateBackIcon(prevStep);
        }
    });
    
    // Initialiser l'icône de retour
    updateBackIcon(1);
});