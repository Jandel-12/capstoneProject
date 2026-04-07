
// Import CSS files
import '../css/main.css';
import '../css/modules.css';
import '../css/challenges.css';
import '../css/challenge-list.css';

// Import data
// challenges loaded from API now
let CHALLENGES = {};
let MODULES = [];

// Import core classes
import { ChallengeEngine } from './core/ChallengeEngine.js';
import { PreviewManager } from './core/PreviewManager.js';

// Import utilities and authentication
import dom, { getElement, getElements, addClass, removeClass, hide, toggleClass } from './utils/dom.js';
import { Storage, Auth, ProgressTracker} from './utils/storage.js';

// ===== AUTH CHECK =====
if (!Auth.isLoggedIn()) {
  window.location.href = 'login.html';
}


// ===== APPLICATION STATE =====
class AppState {
    constructor() {
    this.currentView = 'home';
    this.selectedModule = null;
    this.currentChallengeIndex = 0;
    this.hintLevel = 0;
    this.completedChallenges = Storage.get('completedChallenges') || [];
    this.userCode = '';
    this.showingChallengeList = false;
    this.user = Auth.getUser();

    // 🆕 Sync progress from API in background
    this.syncProgress();
  }

  async syncProgress() {
    try {
      const progress = await ProgressTracker.getProgress();
      this.completedChallenges = progress.completedChallenges;
      Storage.set('completedChallenges', this.completedChallenges);
    } catch (err) {
      console.warn('Progress sync failed:', err);
    }
  }

  setView(view) {
    this.currentView = view;
  }

  setModule(moduleId) {
    this.selectedModule = moduleId;
    this.showingChallengeList = true; // Show challenge list when module selected
  }

  setChallenge(index) {
    this.currentChallengeIndex = index;
    this.hintLevel = 0;
    this.showingChallengeList = false; // Hide challenge list when challenge selected
  }

  incrementHint() {
    this.hintLevel++;
  }

addCompletedChallenge(challengeId) {
  if (!this.completedChallenges.includes(challengeId)) {
    this.completedChallenges.push(challengeId);
    Storage.set('completedChallenges', this.completedChallenges);

    const challenge = this.getCurrentChallenge();
    
    // 🔍 Debug logs
    console.log('Saving progress for:', challengeId);
    console.log('Token:', localStorage.getItem('studentToken'));
    console.log('Challenge:', challenge);

    ProgressTracker.completeChallenge(
      challengeId,
      challenge ? challenge.title : '',
      challenge ? challenge.type || '' : ''
    );
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
      challengeListView: getElement('challengeListView'), 
      challengeView: getElement('challengeView'),
      
      // Home View
      modulesGrid: getElement('modulesGrid'),
      
      // Challenge List View
      challengeListContainer: getElement('challengeListContainer'),
      moduleTitle: getElement('moduleTitle'),
      backToModulesBtn: getElement('backToModulesBtn'),
      
      // Challenge View - Header
      backBtn: getElement('backBtn'),
      challengeTitle: getElement('challengeTitle'),
      challengeProgress: getElement('challengeProgress'),
      difficultyBadge: getElement('difficultyBadge'),

      
      // Challenge View - Instructions
      challengeInstructions: getElement('challengeInstructions'),
      hintBox: getElement('hintBox'),
      hintText: getElement('hintText'),
      hideChallenge: getElement('hideBtn'),
      
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
    this.elements.backBtn.addEventListener('click', () => this.showChallengeListView());
    this.elements.nextBtn.addEventListener('click', () => this.handleNextChallenge());
    this.elements.backToModulesBtn.addEventListener('click', () => this.showHomeView());
    
    // Challenge actions
    this.elements.resetBtn.addEventListener('click', () => this.handleReset());
    this.elements.hintBtn.addEventListener('click', () => this.handleHint());
    this.elements.checkBtn.addEventListener('click', () => this.handleCheck());
    this.elements.hideChallenge.addEventListener('click', ()=> this.handleChallengeHide())
    
    // Live preview with debounce
    let previewTimeout;
    this.elements.codeEditor.addEventListener('input', (e) => {
      this.state.userCode = e.target.value;
      
      // Clear previous timeout
      clearTimeout(previewTimeout);
      
      // Wait 500ms after user stops typing before updating preview
      previewTimeout = setTimeout(() => {
        this.updatePreview();
      }, 500);
    });
  }

  // ===== VIEW SWITCHING =====
  
  showHomeView() {
    this.state.setView('home');
    this.state.selectedModule = null;
    this.state.showingChallengeList = false;
    
    removeClass(this.elements.homeView, 'hidden');
    addClass(this.elements.challengeListView, 'hidden');
    removeClass(this.elements.challengeView, 'active');
    this.renderModules();
  }

  showChallengeListView() {
    this.state.setView('challengeList');
    this.state.showingChallengeList = true;
    
    addClass(this.elements.homeView, 'hidden');
    removeClass(this.elements.challengeListView, 'hidden');
    removeClass(this.elements.challengeView, 'active');
    this.renderChallengeList();
  }

  showChallengeView() {
    this.state.setView('challenge');
    this.state.showingChallengeList = false;
    
    addClass(this.elements.homeView, 'hidden');
    addClass(this.elements.challengeListView, 'hidden');
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
             onclick="${module.locked ? '' : `app.selectModule('${module.id}')`}">
          <div class="module-header">
            <div class="module-icon ${module.color}">${module.icon}</div>
            <div class="module-info">
              <h3>${module.name}</h3>
             
              ${completed > 0 ? `<p class="module-progress">⭐ ${completed} stars earned</p>` : ''}
              ${module.locked ? '<p class="locked-badge">🔒 Complete previous modules to unlock</p>' : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    this.elements.modulesGrid.innerHTML = modulesHTML;
  }

  // ===== CHALLENGE LIST VIEW =====
  
  renderChallengeList() {
    const module = MODULES.find(m => m.id === this.state.selectedModule);
    if (!module) return;
    
    const challenges = CHALLENGES[this.state.selectedModule];
    
    // Update module title
    this.elements.moduleTitle.innerHTML = `
      <div class="module-icon ${module.color}" style="display: inline-block; width: 40px; height: 40px; text-align: center; line-height: 40px; border-radius: 8px; margin-right: 12px;">
        ${module.icon}
      </div>
      <span>${module.name}</span>
    `;
    
    // Render challenge cards
    const challengesHTML = challenges.map((challenge, index) => {
      const isCompleted = this.state.completedChallenges.includes(challenge.id);
      const difficultyColor = {
        'easy': 'green',
        'medium': 'yellow',
        'hard': 'red'
      }[challenge.difficulty];
      
      return `
        <div class="challenge-card ${isCompleted ? 'completed' : ''}"
             onclick="app.startChallenge(${index})">
          <div class="challenge-card-header">
            <div class="challenge-number">${index + 1}</div>
            <div class="challenge-info">
              <h3>${challenge.title}</h3>
              <div class="challenge-meta">
                <span class="difficulty-tag ${difficultyColor}">${challenge.difficulty}</span>
                ${isCompleted ? '<span class="completed-tag">✓ Completed</span>' : ''}
              </div>
            </div>
          </div>
          <div class="challenge-footer">
            <span class="hint-count">💡 ${challenge.hints.length} hints available</span>
            ${isCompleted ? '<span class="star-earned">⭐ Star Earned</span>' : ''}
          </div>
        </div>
      `;
    }).join('');
    
    this.elements.challengeListContainer.innerHTML = challengesHTML;
  }

  // ===== CHALLENGE VIEW =====
  
  loadChallenge() {
    const challenge = this.state.getCurrentChallenge();
    if (!challenge) return;
    
    this.challengeEngine = new ChallengeEngine(challenge);
    
    // Update header
    this.elements.challengeTitle.textContent = challenge.title;
  
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
   handleChallengeHide(){
    const instructions = this.elements.challengeInstructions
    const hideTextContent = this.elements.hideChallenge;
    if(hideTextContent.textContent === "hide"){
      hideTextContent.textContent = "show"
    }
    else
    {
      hideTextContent.textContent = "hide"
    }
    toggleClass(instructions, 'hidden')

  }
}

 
// ===== APPLICATION CLASS =====
class Application {
  constructor() {
    this.state = new AppState();
    this.ui = new UIController(this.state);
  }

  async init() {
    try {
      const token = Auth.getToken();
      const res = await fetch('https://el-royale-api.onrender.com/api/challenges', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      // Build MODULES and CHALLENGES from API response
      MODULES = Object.values(data).map(d => ({
        id: d.module.id,
        name: d.module.name,
        icon: d.module.icon,
        color: d.module.color,
        locked: d.module.locked,
        challenges: d.challenges.length
      }));

      CHALLENGES = {};
      Object.values(data).forEach(d => {
        CHALLENGES[d.module.id] = d.challenges;
      });

    } catch (err) {
      console.error('Failed to load challenges from API:', err);
    }

    if (this.state.currentView === 'home') {
      this.ui.showHomeView();
    }
  }

  startModule(moduleId) {
    const module = MODULES.find(m => m.id === moduleId);
    if (module && !module.locked) {
      this.state.setModule(moduleId);
      this.ui.showChallengeListView();
    }
  }

  selectModule(moduleId) {
    const module = MODULES.find(m => m.id === moduleId);
    if (module && !module.locked) {
      this.state.setModule(moduleId);
      this.ui.showChallengeListView();
    }
  }

  startChallenge(index) {
    this.state.setChallenge(index);
    this.ui.showChallengeView();
  }

  logout() {
  Auth.logout(); // clears studentToken and redirects to login.html
  }
}

// ===== INITIALIZE APP =====
let app;

document.addEventListener('DOMContentLoaded', () => {
  app = new Application();
  app.init(); // now async
  window.app = app;
});

export default Application;