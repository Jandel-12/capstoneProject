// Import CSS files
import '../css/main.css';
import '../css/modules.css';
import '../css/challenges.css';

// Import data
import { CHALLENGES, MODULES } from '../data/challenges.js';

// Import core classes
import { ChallengeEngine } from './core/ChallengeEngine.js';
import { PreviewManager } from './core/PreviewManager.js';

// Import utilities
import { getElement, getElements, addClass, removeClass, toggleClass, debounce } from './utils/dom.js';
import { Storage } from './utils/storage.js';

// ===== APPLICATION STATE =====
class AppState {
  constructor() {
    this.currentView = 'home';
    this.selectedModule = null;
    this.currentChallengeIndex = 0;
    this.hintLevel = 0;
    this.completedChallenges = Storage.get('completedChallenges') || [];
    this.userCode = '';
  }

  setView(view) {
    this.currentView = view;
  }

  setModule(moduleId) {
    this.selectedModule = moduleId;
  }

  setChallenge(index) {
    this.currentChallengeIndex = index;
    this.hintLevel = 0;
  }

  incrementHint() {
    this.hintLevel++;
  }

  addCompletedChallenge(challengeId) {
    if (!this.completedChallenges.includes(challengeId)) {
      this.completedChallenges.push(challengeId);
      Storage.set('completedChallenges', this.completedChallenges);
    }
  }

  getCurrentChallenge() {
    if (!this.selectedModule) return null;
    return CHALLENGES[this.selectedModule][this.currentChallengeIndex];
  }

  getTotalChallenges() {
    if (!this.selectedModule) return 0;
    return CHALLENGES[this.selectedModule].length;
  }
}

// ===== UI CONTROLLER =====
class UIController {
  constructor(state) {
    this.state = state;
    this.previewManager = new PreviewManager();
    this.challengeEngine = null;
    
    this.elements = {
      // Views
      homeView: getElement('homeView'),
      challengeView: getElement('challengeView'),
      
      // Home View
      modulesGrid: getElement('modulesGrid'),
      
      // Challenge View - Header
      backBtn: getElement('backBtn'),
      challengeTitle: getElement('challengeTitle'),
      challengeProgress: getElement('challengeProgress'),
      difficultyBadge: getElement('difficultyBadge'),
      
      // Challenge View - Instructions
      challengeInstructions: getElement('challengeInstructions'),
      hintBox: getElement('hintBox'),
      hintText: getElement('hintText'),
      
      // Challenge View - Editor
      codeEditor: getElement('codeEditor'),
      
      // Challenge View - Buttons
      resetBtn: getElement('resetBtn'),
      hintBtn: getElement('hintBtn'),
      checkBtn: getElement('checkBtn'),
      
      // Challenge View - Preview & Results
      previewFrame: getElement('previewFrame'),
      validationResult: getElement('validationResult'),
      resultIcon: getElement('resultIcon'),
      resultMessage: getElement('resultMessage'),
      errorList: getElement('errorList'),
      nextBtn: getElement('nextBtn')
    };
    
    this.bindEvents();
  }

 bindEvents() {
  // Navigation
  this.elements.backBtn.addEventListener('click', () => this.showHomeView());
  this.elements.nextBtn.addEventListener('click', () => this.handleNextChallenge());
  
  // Challenge actions
  this.elements.resetBtn.addEventListener('click', () => this.handleReset());
  this.elements.hintBtn.addEventListener('click', () => this.handleHint());
  this.elements.checkBtn.addEventListener('click', () => this.handleCheck());
  
  // Live preview with debounce - ONLY ONE LISTENER!
  const debouncedPreview = debounce(() => {
    this.updatePreview();
  }, 500);
  
  this.elements.codeEditor.addEventListener('input', (e) => {
    this.state.userCode = e.target.value;
    debouncedPreview();
  });
}

  // ===== VIEW SWITCHING =====
  
  showHomeView() {
    this.state.setView('home');
    removeClass(this.elements.homeView, 'hidden');
    removeClass(this.elements.challengeView, 'active');
    this.renderModules();
  }

  showChallengeView() {
    this.state.setView('challenge');
    addClass(this.elements.homeView, 'hidden');
    addClass(this.elements.challengeView, 'active');
    this.loadChallenge();
  }

  // ===== HOME VIEW =====
  
  renderModules() {
    const modulesHTML = MODULES.map(module => {
      const completed = this.state.completedChallenges.filter(
        id => id.startsWith(module.id)
      ).length;
      
      return `
        <div class="module-card ${module.locked ? 'locked' : ''}"
             onclick="${module.locked ? '' : `app.startModule('${module.id}')`}">
          <div class="module-header">
            <div class="module-icon ${module.color}">${module.icon}</div>
            <div class="module-info">
              <h3>${module.name}</h3>
              <p>${module.challenges} challenges • ${completed}/${module.challenges} completed</p>
              ${completed > 0 ? `<p class="module-progress">⭐ ${completed} stars earned</p>` : ''}
              ${module.locked ? '<p class="locked-badge">🔒 Complete previous modules to unlock</p>' : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    this.elements.modulesGrid.innerHTML = modulesHTML;
  }

  // ===== CHALLENGE VIEW =====
  
  loadChallenge() {
    const challenge = this.state.getCurrentChallenge();
    if (!challenge) return;
    
    this.challengeEngine = new ChallengeEngine(challenge);
    
    // Update header
    this.elements.challengeTitle.textContent = challenge.title;
    this.elements.challengeProgress.textContent = 
      `Challenge ${this.state.currentChallengeIndex + 1} of ${this.state.getTotalChallenges()}`;
    this.elements.difficultyBadge.textContent = challenge.difficulty;
    this.elements.difficultyBadge.className = `difficulty-badge ${challenge.difficulty}`;
    
    // Update instructions
    this.elements.challengeInstructions.textContent = challenge.instructions;
    
    // Set starter code
    this.state.userCode = challenge.starterCode;
    this.elements.codeEditor.value = challenge.starterCode;
    
    // Reset UI
    addClass(this.elements.hintBox, 'hidden');
    addClass(this.elements.validationResult, 'hidden');
    addClass(this.elements.nextBtn, 'hidden');
    this.elements.hintBtn.disabled = false;
    
    // Update preview
    this.updatePreview();
  }

updatePreview() {
  const challenge = this.state.getCurrentChallenge();
  const challengeType = challenge ? challenge.type || 'html' : 'html';
  
  this.previewManager.update(
    this.elements.previewFrame,
    this.state.userCode,
    challengeType
  );
}

  // ===== CHALLENGE ACTIONS =====
  
  handleReset() {
    const challenge = this.state.getCurrentChallenge();
    this.state.userCode = challenge.starterCode;
    this.elements.codeEditor.value = challenge.starterCode;
    addClass(this.elements.validationResult, 'hidden');
    this.updatePreview();
  }

  handleHint() {
    const challenge = this.state.getCurrentChallenge();
    
    if (this.state.hintLevel < challenge.hints.length) {
      removeClass(this.elements.hintBox, 'hidden');
      this.elements.hintText.textContent = challenge.hints[this.state.hintLevel];
      this.state.incrementHint();
      
      if (this.state.hintLevel >= challenge.hints.length) {
        this.elements.hintBtn.disabled = true;
      }
    }
  }

  handleCheck() {
    const challenge = this.state.getCurrentChallenge();
    const code = this.state.userCode;
    
    // Show loading state
    removeClass(this.elements.validationResult, 'hidden');
    this.elements.validationResult.className = 'validation-result';
    this.elements.resultIcon.textContent = '⏳';
    this.elements.resultMessage.textContent = 'Validating...';
    this.elements.errorList.innerHTML = '';
    addClass(this.elements.nextBtn, 'hidden');
    
    // Handle async validation (for JavaScript challenges)
    const result = this.challengeEngine.validate(code);
    
    if (result instanceof Promise) {
      result.then(validationResult => {
        this.displayValidationResult(validationResult);
        
        if (validationResult.success) {
          this.state.addCompletedChallenge(challenge.id);
        }
      }).catch(error => {
        this.displayValidationResult({
          success: false,
          errors: ['Validation error: ' + error.message]
        });
      });
    } else {
      // Synchronous validation (HTML/CSS)
      this.displayValidationResult(result);
      
      if (result.success) {
        this.state.addCompletedChallenge(challenge.id);
      }
    }
  }

  displayValidationResult(result) {
    removeClass(this.elements.validationResult, 'hidden');
    
    if (result.success) {
      this.elements.validationResult.className = 'validation-result success';
      this.elements.resultIcon.textContent = '✓';
      this.elements.resultMessage.textContent = 'Perfect! Challenge Complete!';
      this.elements.errorList.innerHTML = '';
      removeClass(this.elements.nextBtn, 'hidden');
    } else {
      this.elements.validationResult.className = 'validation-result error';
      this.elements.resultIcon.textContent = '✗';
      this.elements.resultMessage.textContent = 'Not quite right. Keep trying!';
      this.elements.errorList.innerHTML = result.errors
        .map(err => `<li>• ${err}</li>`)
        .join('');
      addClass(this.elements.nextBtn, 'hidden');
    }
  }

  handleNextChallenge() {
    const totalChallenges = this.state.getTotalChallenges();
    
    if (this.state.currentChallengeIndex < totalChallenges - 1) {
      this.state.setChallenge(this.state.currentChallengeIndex + 1);
      this.loadChallenge();
    } else {
      // Module completed
      this.showHomeView();
    }
  }
}

// ===== APPLICATION CLASS =====
class Application {
  constructor() {
    this.state = new AppState();
    this.ui = new UIController(this.state);
  }

  init() {
    // Show initial view
    if (this.state.currentView === 'home') {
      this.ui.showHomeView();
    }
  }

  startModule(moduleId) {
    const module = MODULES.find(m => m.id === moduleId);
    if (module && !module.locked) {
      this.state.setModule(moduleId);
      this.state.setChallenge(0);
      this.ui.showChallengeView();
    }
  }
}

// ===== INITIALIZE APP =====
let app;

document.addEventListener('DOMContentLoaded', () => {
  app = new Application();
  app.init();
  
  // Make app globally accessible for onclick handlers
  window.app = app;
});

export default Application;