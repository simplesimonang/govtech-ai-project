// Data loaded from JSON files
let TOPICS, scenarios, policies;

// State
let currentFilter = 'all';
let selectedEnquiry = null;
let startTime = null;
let citationsViewed = new Set();
let isEditing = false;
let originalDraft = '';
let officerDraft = '';
let retryCount = 0;

// Load data and initialize
async function loadData() {
  [TOPICS, scenarios, policies] = await Promise.all([
    fetch('data/topics.json').then(r => r.json()),
    fetch('data/scenarios.json').then(r => r.json()),
    fetch('data/policies.json').then(r => r.json())
  ]);
  init();
}

function init() {
  renderTopicFilter();
  renderInbox();

  // Event delegation for citation clicks (fixes stacking listener bug)
  document.getElementById('draft-display').addEventListener('click', (e) => {
    const citation = e.target.closest('.citation');
    if (citation) {
      e.preventDefault();
      const policyId = citation.dataset.policy;
      citationsViewed.add(policyId);
      showPolicy(policyId);
    }
  });

  // Check URL param for pre-selected enquiry
  const urlParams = new URLSearchParams(window.location.search);
  const enquiryParam = urlParams.get('enquiry');
  if (enquiryParam) {
    const found = scenarios.find(s => s.id === enquiryParam);
    if (found) selectEnquiry(found);
  }
}

function renderTopicFilter() {
  const container = document.getElementById('topic-filter');
  container.innerHTML = TOPICS.map(topic => {
    const count = topic.id === 'all'
      ? scenarios.length
      : scenarios.filter(s => s.topic === topic.id).length;
    return `<button class="topic-btn ${topic.id === currentFilter ? 'active' : ''}"
                    onclick="filterByTopic('${topic.id}')">
      ${topic.name}<span class="count">(${count})</span>
    </button>`;
  }).join('');
}

function renderInbox() {
  const container = document.getElementById('inbox-list');
  const filtered = currentFilter === 'all'
    ? scenarios
    : scenarios.filter(s => s.topic === currentFilter);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="padding: 24px; text-align: center; color: #666;">
        <p>No enquiries for this topic.</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(s => `
    <div class="inbox-item ${selectedEnquiry?.id === s.id ? 'selected' : ''}"
         onclick="selectEnquiry(scenarios.find(x => x.id === '${s.id}'))">
      <div class="inbox-item-header">
        <span class="inbox-item-id">#${s.id}</span>
        <span class="inbox-item-time">${s.date}</span>
      </div>
      <div class="inbox-item-preview">${s.preview}</div>
      <span class="topic-label ${s.topic}">${TOPICS.find(t => t.id === s.topic)?.name || 'Other'}</span>
    </div>
  `).join('');
}

function filterByTopic(topicId) {
  currentFilter = topicId;
  renderTopicFilter();
  renderInbox();
}

function selectEnquiry(scenario) {
  selectedEnquiry = scenario;
  startTime = null;
  citationsViewed = new Set();
  isEditing = false;
  officerDraft = '';
  retryCount = 0;

  // Update inbox selection
  renderInbox();

  // Update detail panel
  document.getElementById('empty-state').style.display = 'none';
  document.getElementById('enquiry-detail').style.display = 'block';
  document.getElementById('enquiry-id').textContent = `Enquiry #${scenario.id} (made up)`;
  document.getElementById('enquiry-meta').textContent = `From: ${scenario.email} (made up) | Received: ${scenario.date}`;
  document.getElementById('enquiry-text').innerHTML = scenario.enquiry;

  // Reset reply section
  document.getElementById('generate-section').style.display = 'block';
  document.getElementById('draft-section').style.display = 'none';
  document.getElementById('lookup-failed-section').style.display = 'none';
  document.getElementById('actions-bar').style.display = 'none';
  document.getElementById('policy-panel').classList.remove('visible');

  // Reset timer display
  document.getElementById('timer').textContent = '0:00';
}

function generateDraft() {
  startTime = Date.now();
  document.getElementById('generate-section').style.display = 'none';

  if (!selectedEnquiry.lookupSuccess) {
    showLookupFailed();
    return;
  }

  showDraft();
}

function showDraft() {
  document.getElementById('draft-section').style.display = 'block';
  document.getElementById('lookup-failed-section').style.display = 'none';
  document.getElementById('actions-bar').style.display = 'flex';

  const labelEl = document.getElementById('draft-label');
  const displayEl = document.getElementById('draft-display');

  // Reset classes
  labelEl.className = 'draft-label';
  displayEl.className = 'draft-reply';

  document.getElementById('draft-label-text').textContent = selectedEnquiry.draftLabel;
  displayEl.innerHTML = selectedEnquiry.draftHtml;
  document.getElementById('edit-textarea').value = selectedEnquiry.draftPlain;
  originalDraft = selectedEnquiry.draftPlain;

  if (selectedEnquiry.draftLabelClass) {
    labelEl.classList.add(selectedEnquiry.draftLabelClass);
  }
  if (selectedEnquiry.draftClass) {
    displayEl.classList.add(selectedEnquiry.draftClass);
  }
  // Citation clicks handled by event delegation in init()
}

function showLookupFailed() {
  document.getElementById('draft-section').style.display = 'none';
  document.getElementById('lookup-failed-section').style.display = 'block';
  document.getElementById('actions-bar').style.display = 'none';

  document.getElementById('lookup-failed-message').textContent =
    selectedEnquiry.failureMessage || 'Could not find a matching policy source for this enquiry.';

  // Show kept draft if officer has typed something
  const keptSection = document.getElementById('officer-draft-kept');
  if (officerDraft) {
    keptSection.style.display = 'block';
    document.getElementById('kept-draft-preview').textContent =
      officerDraft.substring(0, 100) + (officerDraft.length > 100 ? '...' : '');
  } else {
    keptSection.style.display = 'none';
  }
}

function retryLookup() {
  retryCount++;

  // Simulate retry - fees always fails per PROMPTS.md
  if (selectedEnquiry.topic === 'fees') {
    document.getElementById('lookup-failed-message').textContent =
      `Retry ${retryCount}: Still no matching policy source found for "fees" topic.`;
    return;
  }

  // For other topics, would succeed (not applicable in current scenarios)
  showDraft();
}

function writeManually() {
  // Switch to manual writing mode
  document.getElementById('lookup-failed-section').style.display = 'none';
  document.getElementById('draft-section').style.display = 'block';
  document.getElementById('actions-bar').style.display = 'flex';

  const labelEl = document.getElementById('draft-label');
  labelEl.className = 'draft-label warning';
  document.getElementById('draft-label-text').textContent = 'Manual reply (no AI draft)';

  const draft = officerDraft || `Dear Resident,

Thank you for your enquiry.

[Your reply here]

Warm regards,
ServiceSG`;

  document.getElementById('draft-display').innerHTML = `<p style="color: #666;">${draft.replace(/\n/g, '<br>')}</p>`;
  document.getElementById('edit-textarea').value = draft;
  originalDraft = draft;

  // Auto-enter edit mode
  isEditing = true;
  document.getElementById('reply-section')?.classList.add('edit-mode');
  document.getElementById('draft-section').classList.add('edit-mode');
  document.getElementById('edit-btn').textContent = 'View Draft';
}

function showPolicy(policyId) {
  const policy = policies[policyId];
  if (policy) {
    document.getElementById('policy-title').textContent = policy.title;
    document.getElementById('policy-content').innerHTML =
      policy.content + `<br><br><em style="font-size: 11px;">Last reviewed: ${policy.lastReviewed}</em>`;
    document.getElementById('policy-panel').classList.add('visible');
  }
}

function closePolicy() {
  document.getElementById('policy-panel').classList.remove('visible');
}

function toggleEdit() {
  isEditing = !isEditing;
  document.getElementById('draft-section').classList.toggle('edit-mode', isEditing);
  document.getElementById('edit-btn').textContent = isEditing ? 'View Draft' : 'Edit Draft';

  // Save officer's work
  if (!isEditing) {
    officerDraft = document.getElementById('edit-textarea').value;
  }
}

function sendReply() {
  const timeSpent = Math.floor((Date.now() - startTime) / 1000);
  const currentText = document.getElementById('edit-textarea').value;
  const wasEdited = currentText !== originalDraft;

  let action = 'Sent without changes';
  if (isEditing && wasEdited) {
    action = 'Sent after editing';
  }

  showResult(action, timeSpent);
}

function rewriteFromScratch() {
  const timeSpent = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById('edit-textarea').value = 'Dear Resident,\n\n';
  isEditing = true;
  document.getElementById('draft-section').classList.add('edit-mode');
  document.getElementById('edit-btn').textContent = 'View Draft';

  showResult('Rewrote from scratch', timeSpent);
}

function showResult(action, timeSpent) {
  const mins = Math.floor(timeSpent / 60);
  const secs = timeSpent % 60;
  const topicName = TOPICS.find(t => t.id === selectedEnquiry.topic)?.name || 'Other';

  document.getElementById('stat-scenario').textContent = `#${selectedEnquiry.id}`;
  document.getElementById('stat-topic').textContent = topicName;
  document.getElementById('stat-action').textContent = action;
  document.getElementById('stat-time').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  document.getElementById('stat-citations').textContent =
    citationsViewed.size + ' of ' + (selectedEnquiry.citationCount || 0);

  if (action === 'Rewrote from scratch') {
    document.getElementById('modal-title').textContent = 'Draft Cleared';
    document.getElementById('modal-message').textContent = 'You chose to rewrite from scratch.';
  } else {
    document.getElementById('modal-title').textContent = 'Reply Sent';
    document.getElementById('modal-message').textContent = 'Your reply has been recorded.';
  }

  document.getElementById('result-modal').classList.add('visible');
}

function closeModal() {
  document.getElementById('result-modal').classList.remove('visible');

  // Reset for next enquiry
  selectedEnquiry = null;
  document.getElementById('empty-state').style.display = 'flex';
  document.getElementById('enquiry-detail').style.display = 'none';
  document.getElementById('enquiry-id').textContent = 'Select an enquiry';
  document.getElementById('enquiry-meta').textContent = '';
  renderInbox();
}

// Timer update
setInterval(() => {
  if (startTime) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    document.getElementById('timer').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}, 1000);

// Start loading
loadData();
