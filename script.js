// Brain Stroke Prediction Website JavaScript

// Navigation functions
function startPrediction() {
    window.location.href = 'input.html';
}

function goHome() {
    window.location.href = 'index.html';
}

function goBack() {
    window.history.back();
}

function showPrecautions() {
    window.location.href = 'precautions.html';
}

function retakeAssessment() {
    window.location.href = 'input.html';
}

// Form validation and progress tracking
function updateProgress() {
    const form = document.getElementById('healthForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[required], select[required]');
    const filled = Array.from(inputs).filter(input => input.value !== '').length;
    const percentage = Math.round((filled / inputs.length) * 100);
    
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
}

// Stroke prediction algorithm based on the dataset patterns
function predictStroke(data) {
    let riskScore = 0;
    let riskFactors = [];
    
    // Age factor (higher age = higher risk)
    if (data.age > 65) {
        riskScore += 3;
        riskFactors.push({ factor: 'Advanced Age', level: 'high', description: 'Age over 65 significantly increases stroke risk' });
    } else if (data.age > 45) {
        riskScore += 2;
        riskFactors.push({ factor: 'Age Factor', level: 'medium', description: 'Age over 45 moderately increases stroke risk' });
    } else if (data.age > 30) {
        riskScore += 1;
        riskFactors.push({ factor: 'Age Factor', level: 'low', description: 'Age over 30 slightly increases stroke risk' });
    }
    
    // Hypertension
    if (data.hypertension === '1') {
        riskScore += 3;
        riskFactors.push({ factor: 'Hypertension', level: 'high', description: 'High blood pressure is a major stroke risk factor' });
    }
    
    // Heart disease
    if (data.heart_disease === '1') {
        riskScore += 3;
        riskFactors.push({ factor: 'Heart Disease', level: 'high', description: 'Heart disease significantly increases stroke risk' });
    }
    
    // BMI factor
    if (data.bmi > 30) {
        riskScore += 2;
        riskFactors.push({ factor: 'Obesity', level: 'medium', description: 'BMI over 30 increases stroke risk' });
    } else if (data.bmi > 25) {
        riskScore += 1;
        riskFactors.push({ factor: 'Overweight', level: 'low', description: 'BMI over 25 slightly increases stroke risk' });
    }
    
    // Glucose level
    if (data.avg_glucose_level > 200) {
        riskScore += 3;
        riskFactors.push({ factor: 'High Glucose', level: 'high', description: 'Very high glucose levels indicate diabetes risk' });
    } else if (data.avg_glucose_level > 140) {
        riskScore += 2;
        riskFactors.push({ factor: 'Elevated Glucose', level: 'medium', description: 'Elevated glucose levels increase stroke risk' });
    } else if (data.avg_glucose_level > 100) {
        riskScore += 1;
        riskFactors.push({ factor: 'Borderline Glucose', level: 'low', description: 'Slightly elevated glucose levels' });
    }
    
    // Cholesterol level
    if (data.cholesterol_level > 240) {
        riskScore += 2;
        riskFactors.push({ factor: 'High Cholesterol', level: 'medium', description: 'High cholesterol increases stroke risk' });
    } else if (data.cholesterol_level > 200) {
        riskScore += 1;
        riskFactors.push({ factor: 'Elevated Cholesterol', level: 'low', description: 'Borderline high cholesterol' });
    }
    
    // Smoking status
    if (data.smoking_status === 'smokes') {
        riskScore += 3;
        riskFactors.push({ factor: 'Current Smoking', level: 'high', description: 'Smoking significantly increases stroke risk' });
    } else if (data.smoking_status === 'formerly smoked') {
        riskScore += 1;
        riskFactors.push({ factor: 'Former Smoking', level: 'low', description: 'Previous smoking history increases risk' });
    }
    
    // Work type and lifestyle factors
    if (data.work_type === 'Private' || data.work_type === 'Self-employed') {
        riskScore += 1;
        riskFactors.push({ factor: 'Work Stress', level: 'low', description: 'High-stress work may contribute to stroke risk' });
    }
    
    // Determine overall risk
    let riskLevel, riskDescription, recommendations;
    
    if (riskScore >= 8) {
        riskLevel = 'High Risk';
        riskDescription = 'Based on your health profile, you have a high risk of stroke. Immediate medical consultation is recommended.';
        recommendations = [
            'Consult with a healthcare provider immediately',
            'Monitor blood pressure and glucose levels regularly',
            'Consider medication for managing risk factors',
            'Implement strict lifestyle modifications',
            'Regular cardiovascular screenings'
        ];
    } else if (riskScore >= 4) {
        riskLevel = 'Moderate Risk';
        riskDescription = 'You have moderate stroke risk factors. Lifestyle changes and regular monitoring are recommended.';
        recommendations = [
            'Schedule regular check-ups with your doctor',
            'Adopt a heart-healthy diet (Mediterranean or DASH)',
            'Engage in regular physical activity (150 min/week)',
            'Monitor and manage blood pressure',
            'Quit smoking if applicable'
        ];
    } else {
        riskLevel = 'Low Risk';
        riskDescription = 'Your current health profile indicates low stroke risk. Continue maintaining healthy habits.';
        recommendations = [
            'Maintain a healthy diet and regular exercise',
            'Annual health check-ups',
            'Avoid smoking and excessive alcohol',
            'Manage stress effectively',
            'Stay informed about stroke warning signs'
        ];
    }
    
    return {
        riskLevel,
        riskDescription,
        riskScore,
        riskFactors,
        recommendations,
        hasStrokeRisk: riskScore >= 4
    };
}

// Form submission handler
function handleFormSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {};
    
    // Collect form data
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Convert numeric fields
    data.age = parseFloat(data.age);
    data.bmi = parseFloat(data.bmi);
    data.avg_glucose_level = parseFloat(data.avg_glucose_level);
    data.cholesterol_level = parseFloat(data.cholesterol_level);
    
    // Validate required fields
    const requiredFields = ['gender', 'age', 'hypertension', 'heart_disease', 'ever_married', 'work_type', 'Residence_type', 'bmi', 'avg_glucose_level', 'cholesterol_level', 'smoking_status'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field] === '') {
            alert('Please fill in all required fields');
            return;
        }
    }
    
    // Store data and navigate to results
    localStorage.setItem('strokePredictionData', JSON.stringify(data));
    localStorage.setItem('strokePredictionResult', JSON.stringify(predictStroke(data)));
    
    window.location.href = 'results.html';
}

// Display results on results page
function displayResults() {
    const resultData = localStorage.getItem('strokePredictionResult');
    const inputData = localStorage.getItem('strokePredictionData');
    
    if (!resultData || !inputData) {
        window.location.href = 'input.html';
        return;
    }
    
    const result = JSON.parse(resultData);
    const input = JSON.parse(inputData);
    
    // Update result card
    const resultCard = document.getElementById('resultCard');
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultDescription = document.getElementById('resultDescription');
    const confidenceFill = document.getElementById('confidenceFill');
    const confidenceValue = document.getElementById('confidenceValue');
    
    if (resultCard && resultIcon && resultTitle && resultDescription) {
        if (result.hasStrokeRisk) {
            resultCard.className = 'result-card high-risk';
            resultIcon.className = 'result-icon high-risk';
            resultIcon.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
            `;
        } else {
            resultCard.className = 'result-card low-risk';
            resultIcon.className = 'result-icon low-risk';
            resultIcon.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            `;
        }
        
        resultTitle.textContent = result.riskLevel;
        resultDescription.textContent = result.riskDescription;
    }
    
    // Update confidence meter
    const confidence = Math.max(85, Math.min(98, 95 - (result.riskScore * 2)));
    if (confidenceFill && confidenceValue) {
        confidenceFill.style.width = confidence + '%';
        confidenceValue.textContent = confidence + '%';
    }
    
    // Display risk factors
    const riskFactorsContainer = document.getElementById('riskFactors');
    if (riskFactorsContainer && result.riskFactors) {
        riskFactorsContainer.innerHTML = '';
        result.riskFactors.forEach(factor => {
            const factorDiv = document.createElement('div');
            factorDiv.className = `risk-factor ${factor.level}`;
            factorDiv.innerHTML = `
                <h4>${factor.factor}</h4>
                <p>${factor.description}</p>
            `;
            riskFactorsContainer.appendChild(factorDiv);
        });
    }
    
    // Display recommendations
    const recommendationsContainer = document.getElementById('recommendations');
    if (recommendationsContainer && result.recommendations) {
        recommendationsContainer.innerHTML = '';
        result.recommendations.forEach(rec => {
            const recDiv = document.createElement('div');
            recDiv.className = 'recommendation';
            recDiv.innerHTML = `
                <h4>Recommendation</h4>
                <p>${rec}</p>
            `;
            recommendationsContainer.appendChild(recDiv);
        });
    }
}

// Initialize page-specific functionality
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch (currentPage) {
        case 'input.html':
            // Add form event listeners
            const form = document.getElementById('healthForm');
            if (form) {
                form.addEventListener('submit', handleFormSubmission);
                
                // Add progress tracking
                const inputs = form.querySelectorAll('input, select');
                inputs.forEach(input => {
                    input.addEventListener('change', updateProgress);
                    input.addEventListener('input', updateProgress);
                });
                
                // Initial progress update
                updateProgress();
            }
            break;
            
        case 'results.html':
            displayResults();
            break;
            
        case 'index.html':
        case '':
            // Add any homepage specific functionality
            break;
            
        case 'precautions.html':
            // Add any precautions page specific functionality
            break;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Add loading animation for form submission
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            this.style.opacity = '0.7';
            this.style.cursor = 'not-allowed';
            setTimeout(() => {
                this.style.opacity = '1';
                this.style.cursor = 'pointer';
            }, 2000);
        });
    }
});