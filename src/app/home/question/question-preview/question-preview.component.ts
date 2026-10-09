import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { EventLevel, Events, QuestionAppearanceView } from 'src/app/model/events';
import { Questions } from 'src/app/model/questions';
import { EventsService } from 'src/app/services/events.service';

export interface LevelConfig {
  levelNumber: number;
  levelName: string;
  tag: string;
  color: string;
  bgLight: string;
  icon: string;
  description: string;
  defaultQuestions: number;
  totalTime?: number; // in seconds
}

@Component({
  selector: 'app-question-preview',
  templateUrl: './question-preview.component.html',
  styleUrls: ['./question-preview.component.scss'],
})
export class QuestionPreviewComponent implements OnInit {
  questionList: any[] = [];
  questionListFilter: any;
  isClicked: boolean = false;
  eventData: Events;
  isLoading: boolean = false;
  selectedLevelTab: number | string = 'ALL';
  searchTerm: string = '';

  readonly levelDefinitions: LevelConfig[] = [
    {
      levelNumber: 1,
      levelName: 'Foundation Practice',
      tag: 'Easy',
      color: '#16a34a',
      bgLight: '#ecfdf5',
      icon: 'leaf-outline',
      description: 'Understand key concepts and basic facts.',
      defaultQuestions: 25
    },
    {
      levelNumber: 2,
      levelName: 'School Exam Readiness',
      tag: 'Moderate',
      color: '#2563eb',
      bgLight: '#eff6ff',
      icon: 'book-outline',
      description: 'Practice important questions from the school exam perspective.',
      defaultQuestions: 25
    },
    {
      levelNumber: 3,
      levelName: 'Concept Application',
      tag: 'Application',
      color: '#f59e0b',
      bgLight: '#fffbeb',
      icon: 'bulb-outline',
      description: 'Apply your knowledge to different types of questions.',
      defaultQuestions: 25
    },
    {
      levelNumber: 4,
      levelName: 'Higher-Order Thinking',
      tag: 'Proficiency',
      color: '#e11d48',
      bgLight: '#fff1f2',
      icon: 'settings-outline',
      description: 'Solve challenging questions and strengthen your problem-solving skills.',
      defaultQuestions: 25
    },
    {
      levelNumber: 5,
      levelName: 'Mastery & Challenge',
      tag: 'Advanced',
      color: '#7c3aed',
      bgLight: '#f5f3ff',
      icon: 'trophy-outline',
      description: 'Tackle advanced questions for complete mastery of the chapter.',
      defaultQuestions: 25
    }
  ];

  constructor(
    private toastController: ToastController,
    private firestore: AngularFirestore,
    public eventsService: EventsService,
    private router: Router,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.eventsService.getEventData().subscribe(event => {
      this.eventData = event;
      if (this.eventData) {
        this.getAllQuestionsForEvent();
      }
    });
  }

  viewQuestionRelatedToEvent() {
    if (this.eventData) {
      this.getAllQuestionsForEvent();
    } else {
      this.presentToast('No Event Selected for Setting Questions');
    }
  }

  getAllQuestionsForEvent() {
    this.isLoading = true;
    this.questionList = [];

    // Helper map of existing level allocations
    const existingQuestionLevels = new Map<string, number>();
    if (this.eventData?.levels && Array.isArray(this.eventData.levels)) {
      this.eventData.levels.forEach((lvl: any) => {
        if (lvl.questions && Array.isArray(lvl.questions)) {
          lvl.questions.forEach((q: any) => {
            if (q?.id) existingQuestionLevels.set(q.id, Number(lvl.levelNumber) || 1);
          });
        }
      });
    }

    if (this.eventData?.questions && Array.isArray(this.eventData.questions)) {
      this.eventData.questions.forEach((q: any) => {
        if (q?.id && !existingQuestionLevels.has(q.id)) {
          existingQuestionLevels.set(q.id, Number(q.level) || 1);
        }
      });
    }

    const processResults = (data: any) => {
      this.isLoading = false;
      const rawList: any[] = [];
      data.forEach((res: any) => {
        const qus: any = res.data();
        if (existingQuestionLevels.has(qus.id)) {
          qus.isSelected = true;
          qus.level = existingQuestionLevels.get(qus.id);
          qus.isExistPreviously = true;
        } else {
          qus.isSelected = false;
          qus.level = null;
        }
        rawList.push(qus);
      });
      this.questionList = this.sortQuestionsDeterministically(rawList);
    };

    if (this.eventData?.moduleId) {
      this.firestore.collection('questions', ref =>
        ref.where('class.id', '==', this.eventData.classId)
          .where('subject.id', '==', this.eventData.subjectId)
          .where('module.id', '==', this.eventData.moduleId)
          .where('board', '==', this.eventData.boardName)
      ).get().subscribe({
        next: (data) => processResults(data),
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          this.presentToast('Error loading questions');
        }
      });
    } else {
      this.firestore.collection('questions', ref =>
        ref.where('class.id', '==', this.eventData.classId)
          .where('subject.id', '==', this.eventData.subjectId)
          .where('board', '==', this.eventData.boardName)
      ).get().subscribe({
        next: (data) => processResults(data),
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          this.presentToast('Error loading questions');
        }
      });
    }
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2500,
      position: 'bottom'
    });
    await toast.present();
  }

  // Set or toggle question level
  setLevelForQuestion(question: any, levelNumber: number) {
    this.isClicked = true;
    if (question.isSelected && question.level === levelNumber) {
      // Toggle off
      question.isSelected = false;
      question.level = null;
    } else {
      // Assign level
      question.isSelected = true;
      question.level = levelNumber;
    }
  }

  // Checkbox toggle: if checking with no level, assign to active tab level or Level 1
  selectQuestion(event: any, question: any) {
    this.isClicked = true;
    if (event.detail.checked) {
      question.isSelected = true;
      if (!question.level) {
        question.level = typeof this.selectedLevelTab === 'number' ? this.selectedLevelTab : 1;
      }
    } else {
      question.isSelected = false;
      question.level = null;
    }
  }

  // Get total questions assigned to a specific level
  getLevelCount(levelNumber: number): number {
    return this.questionList.filter(q => q.isSelected && Number(q.level) === levelNumber).length;
  }

  // Total questions assigned across all levels
  getTotalAssignedCount(): number {
    return this.questionList.filter(q => q.isSelected && q.level).length;
  }

  // Tab switch
  changeLevelTab(tab: any) {
    this.selectedLevelTab = tab;
  }

  // Filtered questions based on selected tab and search query
  getFilteredQuestions(): any[] {
    let list = this.questionList;

    if (this.selectedLevelTab !== 'ALL') {
      const targetLevel = Number(this.selectedLevelTab);
      list = list.filter(q => q.isSelected && Number(q.level) === targetLevel);
    }

    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      list = list.filter(q => (q.text && q.text.toLowerCase().includes(term)));
    }

    return list;
  }

  // Auto-distribute: Takes available or selected questions and divides into 5 levels (e.g. 20 or 25 each or evenly)
  autoDistributeQuestions(perLevel: number = 25) {
    this.isClicked = true;
    if (this.questionList.length === 0) {
      this.presentToast('No questions available to distribute.');
      return;
    }

    // Update level definition targets
    this.levelDefinitions.forEach(def => def.defaultQuestions = perLevel);

    // Reset all first
    this.questionList.forEach(q => {
      q.isSelected = false;
      q.level = null;
    });

    let currentLvl = 1;
    let countInLvl = 0;

    for (let i = 0; i < this.questionList.length; i++) {
      if (currentLvl > 5) break;

      this.questionList[i].isSelected = true;
      this.questionList[i].level = currentLvl;
      countInLvl++;

      if (countInLvl >= perLevel) {
        currentLvl++;
        countInLvl = 0;
      }
    }

    const assigned = this.getTotalAssignedCount();
    this.presentToast(`Auto-assigned ${assigned} questions across 5 levels (${perLevel} per level).`);
  }

  // Select all visible questions for current tab level
  checkUncheckAll(event: any) {
    this.isClicked = true;
    const isChecked = event.detail.checked;
    const visibleQuestions = this.getFilteredQuestions();

    if (isChecked) {
      const targetLevel = typeof this.selectedLevelTab === 'number' ? this.selectedLevelTab : 1;
      visibleQuestions.forEach(q => {
        q.isSelected = true;
        q.level = targetLevel;
      });
    } else {
      visibleQuestions.forEach(q => {
        q.isSelected = false;
        q.level = null;
      });
    }
  }

  // Clear all level selections
  clearAllSelections() {
    this.isClicked = true;
    this.questionList.forEach(q => {
      q.isSelected = false;
      q.level = null;
    });
    this.presentToast('All question assignments cleared.');
  }

  save() {
    const selectedQuestions = this.questionList.filter(qus => qus.isSelected === true);

    // Default any selected without level to Level 1
    selectedQuestions.forEach(q => {
      if (!q.level) q.level = 1;
    });

    // Calculate per-question time from event settings
    const perQTime = Number(this.eventData?.perQuestionHour) > 0
      ? Number(this.eventData.perQuestionHour)
      : (Number(this.eventData?.totalHour) > 0 && selectedQuestions.length > 0
          ? (Number(this.eventData.totalHour) / selectedQuestions.length)
          : 25.2);

    // Build 5 level objects
    const structuredLevels: EventLevel[] = this.levelDefinitions.map(def => {
      const levelQues: QuestionAppearanceView[] = selectedQuestions
        .filter(q => Number(q.level) === def.levelNumber)
        .map(q => ({
          id: q.id,
          correctAnswer: q.answers && q.answers.length > 0 ? q.answers[0] : '',
          level: def.levelNumber
        }));

      const levelTotalTime = Math.round(levelQues.length * perQTime);

      return {
        levelNumber: def.levelNumber,
        levelName: def.levelName,
        tag: def.tag,
        description: def.description,
        totalQuestions: levelQues.length,
        totalTime: levelTotalTime,
        questions: levelQues
      };
    });

    // Master questions list
    const questionAppearanceList: QuestionAppearanceView[] = selectedQuestions.map(q => ({
      id: q.id,
      correctAnswer: q.answers && q.answers.length > 0 ? q.answers[0] : '',
      level: Number(q.level) || 1
    }));

    const updatePayload: any = {
      questions: questionAppearanceList,
      levels: structuredLevels,
      totalQuestions: selectedQuestions.length,
      status: 'UPCOMING'
    };

    this.firestore.collection('events').doc(this.eventData.id)
      .set(JSON.parse(JSON.stringify(updatePayload)), { merge: true })
      .then(() => {
        this.presentToast(`Saved ${selectedQuestions.length} questions across 5 levels successfully!`);
        this.navCtrl.back();
      })
      .catch((err) => {
        console.error(err);
        this.presentToast('Error saving event questions.');
      });
  }

  goBack() {
    this.navCtrl.back();
  }

  sortQuestionsDeterministically(questions: any[]): any[] {
    if (!questions || !Array.isArray(questions)) return [];

    return questions.slice().sort((a, b) => {
      // 1. Primary: seqno (assigned upload sequence)
      const aSeq = a.seqno != null && !isNaN(Number(a.seqno)) ? Number(a.seqno) : null;
      const bSeq = b.seqno != null && !isNaN(Number(b.seqno)) ? Number(b.seqno) : null;
      if (aSeq !== null && bSeq !== null && aSeq !== bSeq) {
        return aSeq - bSeq;
      }
      if (aSeq !== null && bSeq === null) return -1;
      if (aSeq === null && bSeq !== null) return 1;

      // 2. Secondary: order
      const aOrder = a.order != null && !isNaN(Number(a.order)) ? Number(a.order) : null;
      const bOrder = b.order != null && !isNaN(Number(b.order)) ? Number(b.order) : null;
      if (aOrder !== null && bOrder !== null && aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      if (aOrder !== null && bOrder === null) return -1;
      if (aOrder === null && bOrder !== null) return 1;

      // 3. Tertiary: Leading question number from question text (e.g. "1. ", "Q1", "1)")
      const aNum = this.extractLeadingNumber(a.text);
      const bNum = this.extractLeadingNumber(b.text);
      if (aNum !== null && bNum !== null && aNum !== bNum) {
        return aNum - bNum;
      }

      // 4. Quaternary: createdAt
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (aTime && bTime && aTime !== bTime) {
        return aTime - bTime;
      }

      // 5. Final deterministic tie-breaker: document ID
      const aId = String(a.id || '');
      const bId = String(b.id || '');
      return aId.localeCompare(bId);
    });
  }

  private extractLeadingNumber(text: string): number | null {
    if (!text || typeof text !== 'string') return null;
    const match = text.trim().match(/^(?:q(?:uestion)?\s*[\.\:\-]?\s*)?(\d+)[\.\)\:\s]/i);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      return !isNaN(num) ? num : null;
    }
    return null;
  }
}
