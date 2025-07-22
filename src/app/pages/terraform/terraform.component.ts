import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-terraform',
  templateUrl: './terraform.component.html',
  styleUrls: ['./terraform.component.scss']
})
export class TerraformComponent implements OnInit, AfterViewInit {
  planInput: string = '';
  useJson: boolean = true;
  resultsHtml: string = '';
  summaryResultHtml: string = '';
  showSummary: boolean = false;
  summarizeLoading: boolean = false;

  readonly COLLAPSE_THRESHOLD = 5;

  groupedChanges: {
    create: any[];
    modify: any[];
    destroy: any[];
    replace: any[];
    [key: string]: any[];
  } = {
    create: [],
    modify: [],
    destroy: [],
    replace: []
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // No initial analyze call here, as we want to wait for user interaction or URL load
  }

  ngAfterViewInit(): void {
    // Attempt to load plan.json from URL after the view has been initialized
    this.loadPlanFromUrl();
  }

  /**
   * A simple diffing function that highlights differences between two strings.
   * This is a basic implementation of the Longest Common Subsequence algorithm.
   * @param {string} oldStr The old string.
   * @param {string} newStr The new string.
   * @returns {string} An HTML string with additions and deletions highlighted.
   */
  diffStrings(oldStr: string, newStr: string): string {
    console.log('diffStrings called with:', { oldStr, newStr });
    
    if (!oldStr && !newStr) return '';
    if (!oldStr) return `<span class="diff-add">${this.escapeHtml(newStr)}</span>`;
    if (!newStr) return `<span class="diff-del">${this.escapeHtml(oldStr)}</span>`;

    // Simple word-based diff for better readability
    if (oldStr === newStr) {
      return this.escapeHtml(oldStr);
    }

    // If strings are very different, show them separately
    if (oldStr.length === 0) {
      return `<span class="diff-add">${this.escapeHtml(newStr)}</span>`;
    }
    if (newStr.length === 0) {
      return `<span class="diff-del">${this.escapeHtml(oldStr)}</span>`;
    }

    // Show before -> after for clear distinction
    const result = `<span class="diff-del">${this.escapeHtml(oldStr)}</span> → <span class="diff-add">${this.escapeHtml(newStr)}</span>`;
    console.log('Diff result:', result);
    return result;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  analyze(): void {
    this.resultsHtml = '';
    this.showSummary = false;
    this.groupedChanges = { create: [], modify: [], destroy: [], replace: [] };

    if (this.planInput.trim() === '') {
      return;
    }

    let changes: any[] = [];
    if (this.useJson) {
      let plan;
      try {
        plan = JSON.parse(this.planInput);
      } catch (e) {
        this.resultsHtml = '<div class="change destroy-border"><div class="resource-title destroy">Ungültiges JSON</div><div class="attribute">Bitte überprüfe deinen Input.</div></div>';
        return;
      }

      changes = plan.resource_changes || [];
      if (changes.length === 0 && (plan.planned_values || this.planInput.includes('"resource_changes": []'))) {
        this.resultsHtml = '<div class="change add-border"><div class="resource-title add">Keine Änderungen</div><div class="attribute">Dein Plan hat keine Änderungen an der Infrastruktur zur Folge.</div></div>';
        return;
      }
    } else {
      // Fallback for plain text parsing
      const lines = this.planInput.split('\n');
      let currentResource: string | null = null;
      let currentBlock: string[] = [];

      const flushBlock = () => {
        if (!currentResource) return;

        const isReplacement = currentBlock.some(line =>
          line.includes('(forces replacement)') || line.includes('# forces replacement') || line.includes('must be replaced')
        );
        const isCreate = currentResource.includes('(create)') || currentResource.startsWith('+ resource');
        const isDelete = currentResource.includes('(destroy)') || currentResource.startsWith('- resource');
        const isUpdate = currentResource.startsWith('~ resource');

        let actionType = 'modify';
        if (isReplacement) {
          actionType = 'replace';
        } else if (isCreate) {
          actionType = 'create';
        } else if (isDelete) {
          actionType = 'destroy';
        } else if (isUpdate) {
          actionType = 'modify';
        }

        changes.push({
          address: currentResource,
          change: {
            actions: [actionType],
            replacement_reasons: isReplacement ? currentBlock.filter(line =>
              line.includes('(forces replacement)') || line.includes('# forces replacement') || line.includes('must be replaced')
            ).map(line => line.trim()) : []
          },
          details: currentBlock
        });
        currentResource = null;
        currentBlock = [];
      };

      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.match(/^(# .* (will be|is a data source))|^([~+-] resource)/)) {
          flushBlock();
          currentResource = trimmedLine.replace(/ \{$/, '').replace(/ \(destroy\)$/, '').replace(/ \(create\)$/, '').replace(/ \(tainted\)$/, '').trim();
        } else if (trimmedLine.startsWith('{') || trimmedLine.startsWith('}')) {
          // skip
        } else if (currentResource) {
          currentBlock.push(line);
        }
      });
      flushBlock();
    }

    // Group changes by type
    changes.forEach(change => {
      const action = change.change.actions[0];
      if (this.groupedChanges[action as keyof typeof this.groupedChanges]) {
        this.groupedChanges[action as keyof typeof this.groupedChanges].push(change);
      } else {
        this.groupedChanges.modify.push(change);
      }
    });
  }

  /**
   * Renders basic Markdown text to HTML.
   * Supports headings (#, ##), lists (-), bold (**), italic (*), and newlines.
   * @param {string} markdownText The Markdown string to render.
   * @returns {string} The HTML string.
   */
  renderMarkdown(markdownText: string): string {
    let html = markdownText;

    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    const lines = html.split('\n');
    let inList = false;
    let processedLines: string[] = [];

    lines.forEach(line => {
      if (line.match(/^(\s*)[*-]\s/)) {
        if (!inList) {
          processedLines.push('<ul>');
          inList = true;
        }
        processedLines.push(`<li>${line.replace(/^(\s*)[*-]\s/, '').trim()}</li>`);
      } else {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push(line);
      }
    });
    if (inList) {
      processedLines.push('</ul>');
    }
    html = processedLines.join('\n');

    html = html.split('\n').map(line => {
      if (line.trim() === '' || line.startsWith('<h') || line.startsWith('<ul') || line.startsWith('</ul')) {
        return line;
      }
      return `<p>${line}</p>`;
    }).join('');

    return html;
  }

  async summarizePlan(): Promise<void> {
    this.showSummary = true;
    this.summarizeLoading = true;
    this.summaryResultHtml = '<h2>Zusammenfassung des Plans <span class="loading-spinner"></span></h2><p>Generiere Zusammenfassung...</p>';

    let promptContent = '';

    if (this.useJson) {
      let plan;
      try {
        plan = JSON.parse(this.planInput);
      } catch (e) {
        this.summaryResultHtml = '<div class="error-message"><h2>Fehler</h2><p>Ungültiges JSON für die Zusammenfassung. Bitte überprüfe deinen Input.</p></div>';
        this.summarizeLoading = false;
        return;
      }

      const changes = plan.resource_changes || [];
      if (changes.length === 0) {
        promptContent = 'Der Terraform-Plan hat keine Änderungen an der Infrastruktur zur Folge.';
      } else {
        promptContent = 'Fasse die folgenden Terraform-Planänderungen prägnant zusammen, formatiert als Markdown. Konzentriere dich auf den Typ der Änderung (erstellen, aktualisieren, löschen, ersetzen) und die betroffenen Ressourcen. Wenn es Ersetzungen gibt, erwähne diese und die Gründe dafür. Verwende Überschriften für Abschnitte und Listen für Ressourcen.\n\nÄnderungen:\n';
        changes.forEach((change: any) => {
          const actions = change.change.actions.join(', ');
          let replacementReasons = '';
          if (change.change.replacement_reasons && change.change.replacement_reasons.length > 0) {
            replacementReasons = ` (Gründe für Ersetzung: ${change.change.replacement_reasons.join(', ')})`;
          }
          promptContent += `- Ressource: ${change.address}, Aktion: ${actions}${replacementReasons}\n`;
        });
      }
    } else {
      if (this.planInput.trim() === '') {
        promptContent = 'Der Terraform-Plan ist leer.';
      } else {
        promptContent = 'Fasse die wichtigsten Änderungen in diesem Terraform-Plan-Output prägnant zusammen, formatiert als Markdown. Identifiziere Ressourcen, Aktionen (erstellen, ändern, löschen, ersetzen) und wichtige Attribute, die geändert werden. Gib eine prägnante Übersicht. Verwende Überschriften für Abschnitte und Listen für Ressourcen.\n\nTerraform Plan Output:\n' + this.planInput.slice(0, 4000);
      }
    }

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: promptContent }] });
      const payload = { contents: chatHistory };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await this.http.post<any>(apiUrl, payload).toPromise();

      if (response && response.candidates && response.candidates.length > 0 &&
        response.candidates[0].content && response.candidates[0].content.parts &&
        response.candidates[0].content.parts.length > 0) {
        const text = response.candidates[0].content.parts[0].text;
        this.summaryResultHtml = `<h2>Zusammenfassung des Plans</h2>${this.renderMarkdown(text)}`;
      } else {
        this.summaryResultHtml = '<div class="error-message"><h2>Fehler</h2><p>Konnte keine Zusammenfassung generieren. Unerwartete Antwort von der API.</p></div>';
        console.error('Unexpected API response:', response);
      }
    } catch (error: any) {
      this.summaryResultHtml = `<div class="error-message"><h2>Fehler</h2><p>Fehler beim Generieren der Zusammenfassung: ${error.message || error}</p></div>`;
      console.error('Error calling Gemini API:', error);
    } finally {
      this.summarizeLoading = false;
    }
  }

  handleFileInput(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.planInput = e.target.result;
        this.analyze();
      };
      reader.readAsText(file);
    }
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.add('drag-over');
  }

  handleDragLeave(event: DragEvent): void {
    event.stopPropagation();
    (event.target as HTMLElement).classList.remove('drag-over');
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.remove('drag-over');

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.planInput = e.target.result;
        this.analyze();
      };
      reader.readAsText(file);
    }
  }

  /**
   * Attempts to load plan.json from the current URL's directory.
   * This is useful when hosted on GitLab Pages or with the Cloudflare Worker.
   */
  async loadPlanFromUrl(): Promise<void> {
    // Check for planId in URL (for Cloudflare Worker integration)
    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get('planId');

    if (planId) {
      // Replace YOUR_WORKER_URL with the actual URL of your Cloudflare Worker
      const workerBaseUrl = "YOUR_WORKER_URL";
      try {
        const response = await this.http.get(`${workerBaseUrl}/plan/${planId}`).toPromise();
        this.planInput = JSON.stringify(response, null, 2) || '';
        this.useJson = true;
        this.analyze();
      } catch (error: any) {
        this.resultsHtml = `<div class="change destroy-border"><div class="resource-title destroy">Fehler beim Laden des Plans</div><div class="attribute">Konnte Plan mit ID "${planId}" nicht vom Worker laden. Details: ${error.message || error}</div></div>`;
        console.error('Error fetching plan from worker:', error);
      }
    } else if (this.planInput.trim() === '') {
      // Fallback to loading plan.json from same directory (for GitLab Pages direct hosting)
      try {
        const response = await this.http.get('plan.json', { responseType: 'text' }).toPromise();
        this.planInput = response || '';
        this.analyze();
      } catch (error) {
        // If plan.json is not found or not OK, just clear results
        this.resultsHtml = '';
        console.error('Error fetching plan.json locally:', error);
      }
    }
  }

  toggleResourceDetails(resource: any, event: Event): void {
    const detailsDiv = (event.currentTarget as HTMLElement).nextElementSibling as HTMLElement;
    const toggleIcon = (event.currentTarget as HTMLElement).querySelector('.toggle-icon') as HTMLElement;

    if (detailsDiv && toggleIcon) {
      const isHidden = detailsDiv.style.display === 'none';
      detailsDiv.style.display = isHidden ? 'block' : 'none';
      toggleIcon.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
    }
  }

  getOrderedTypes(): string[] {
    return ['create', 'modify', 'destroy', 'replace'];
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'create': return '➕';
      case 'modify': return '🔄';
      case 'destroy': return '➖';
      case 'replace': return '⚠️';
      default: return '';
    }
  }

  getTitleForType(type: string): string {
    switch (type) {
      case 'create': return 'Erstellen';
      case 'modify': return 'Ändern';
      case 'destroy': return 'Löschen';
      case 'replace': return 'Ersetzen';
      default: return '';
    }
  }

  getChangeBorderClass(change: any): string {
    const actions = change.change.actions;
    if (actions.includes('replace')) {
      return 'replace-border';
    } else if (actions.includes('create')) {
      return 'add-border';
    } else if (actions.includes('destroy')) {
      return 'destroy-border';
    } else if (actions.includes('update')) {
      return 'modify-border';
    }
    return '';
  }

  // Helper methods for template
  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  hasKey(obj: any, key: string): boolean {
    return obj && obj.hasOwnProperty(key);
  }

  getJsonValue(value: any): string {
    return JSON.stringify(value);
  }

  shouldShowAttribute(change: any, key: string): boolean {
    const after = change.change.after || {};
    const before = change.change.before || {};
    const valAfter = after[key];
    const valBefore = before[key];
    return JSON.stringify(valAfter) !== JSON.stringify(valBefore);
  }

  getDiffHtml(change: any, key: string): string {
    const after = change.change.after || {};
    const before = change.change.before || {};
    const valAfter = after[key];
    const valBefore = before[key];
    
    console.log(`Diffing key: ${key}`, { before: valBefore, after: valAfter });
    
    if (before.hasOwnProperty(key) && after.hasOwnProperty(key)) {
      if (typeof valBefore === 'string' && typeof valAfter === 'string') {
        // Direct string comparison with diff highlighting
        const diffResult = this.diffStrings(valBefore, valAfter);
        console.log(`Diff result for ${key}:`, diffResult);
        return diffResult;
      } else if (typeof valBefore === 'object' && typeof valAfter === 'object') {
        // Handle objects - show JSON comparison
        const beforeJson = JSON.stringify(valBefore, null, 2);
        const afterJson = JSON.stringify(valAfter, null, 2);
        if (beforeJson === afterJson) {
          return this.escapeHtml(beforeJson);
        } else {
          return `<div><span class="diff-del">${this.escapeHtml(beforeJson)}</span></div><div><span class="diff-add">${this.escapeHtml(afterJson)}</span></div>`;
        }
      } else {
        // For non-strings, convert to string and diff
        const beforeStr = this.valueToString(valBefore);
        const afterStr = this.valueToString(valAfter);
        const diffResult = this.diffStrings(beforeStr, afterStr);
        console.log(`Non-string diff result for ${key}:`, diffResult);
        return diffResult;
      }
    } else if (after.hasOwnProperty(key)) {
      const valueStr = this.valueToString(valAfter);
      return `<span class="diff-add">${this.escapeHtml(valueStr)}</span>`;
    } else {
      const valueStr = this.valueToString(valBefore);
      return `<span class="diff-del">${this.escapeHtml(valueStr)}</span>`;
    }
  }

  private valueToString(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }

  parsePlainTextDiff(line: string): {key: string, before: string, after: string} | null {
    if (!line.includes('->')) return null;
    
    const parts = line.split('->');
    if (parts.length !== 2) return null;
    
    const keyPart = parts[0].match(/(.*?)\s*=\s*/);
    const key = keyPart ? keyPart[1].trim() : '';
    const before = parts[0].replace(keyPart ? keyPart[0] : '', '').trim();
    const after = parts[1].trim();
    
    const cleanBefore = (before.startsWith('"') && before.endsWith('"')) ? before.slice(1, -1) : before;
    const cleanAfter = (after.startsWith('"') && after.endsWith('"')) ? after.slice(1, -1) : after;
    
    return { key, before: cleanBefore, after: cleanAfter };
  }

}