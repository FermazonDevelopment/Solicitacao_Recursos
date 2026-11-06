import {
  Component, ElementRef, EventEmitter, HostListener,
  Input, OnChanges, Output, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  styles: [`
    .dp-wrap { position: relative; }

    .dp-trigger {
      display: flex; align-items: center; justify-content: space-between;
      cursor: pointer; user-select: none; gap: 8px;
    }
    .dp-trigger:not(.dp-disabled):hover { border-color: var(--primary); }
    .dp-disabled { opacity: .55; cursor: not-allowed; pointer-events: none; }

    .dp-popup {
      position: absolute; top: calc(100% + 6px); left: 0;
      background: var(--card);
      border: 1px solid var(--border-lt);
      border-radius: var(--r);
      box-shadow: var(--sombra-modal);
      z-index: 9999;
      padding: 16px;
      width: 280px;
      animation: dpFadeIn .15s ease;
    }
    @keyframes dpFadeIn {
      from { opacity:0; transform:translateY(-6px); }
      to   { opacity:1; transform:translateY(0);    }
    }

    .dp-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 14px;
    }
    .dp-nav-btn {
      background: none; border: none; cursor: pointer;
      color: var(--t2); padding: 5px; border-radius: var(--rxs);
      display: flex; align-items: center; justify-content: center;
      transition: background .15s, color .15s;
    }
    .dp-nav-btn:hover { background: var(--primary-dim); color: var(--primary); }

    .dp-period { font-size: 14px; font-weight: 600; color: var(--t1); flex: 1; text-align: center; }

    .dp-dow-row {
      display: grid; grid-template-columns: repeat(7,1fr);
      border-bottom: 1px solid var(--border);
      padding-bottom: 8px; margin-bottom: 6px;
    }
    .dp-dow {
      text-align: center; font-size: 10px; font-weight: 700;
      color: var(--t3); text-transform: uppercase; letter-spacing: .5px; padding: 2px 0;
    }

    .dp-week-row { display: grid; grid-template-columns: repeat(7,1fr); gap: 2px; margin-bottom: 2px; }

    .dp-cell {
      aspect-ratio: 1;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 500; border-radius: 50%;
      cursor: pointer; transition: background .12s, color .12s;
      color: var(--t1); border: 2px solid transparent;
    }
    .dp-cell.dp-empty { cursor: default; pointer-events: none; color: transparent; }
    .dp-cell:not(.dp-empty):hover { background: var(--primary-dim); color: var(--primary); }
    .dp-cell.dp-today { border-color: var(--primary); color: var(--primary); font-weight: 700; }
    .dp-cell.dp-selected {
      background: var(--fz-marinho-2) !important; color: #fff !important;
      border-color: transparent !important;
      box-shadow: 0 2px 8px rgba(16,42,76,.3);
    }
    .dp-cell.dp-past {
      opacity: .35; cursor: not-allowed; pointer-events: none;
    }
  `],
  template: `
    <div class="dp-wrap">
      <div class="dp-trigger form-control"
           [class.dp-disabled]="disabled"
           (click)="toggle()">
        <span [style.color]="displayValue ? 'var(--t1)' : 'var(--t3)'">
          {{ displayValue || placeholder }}
        </span>
        <mat-icon class="icon-sm" style="color:var(--t3);flex-shrink:0">calendar_today</mat-icon>
      </div>

      @if (isOpen) {
        <div class="dp-popup" (click)="$event.stopPropagation()">
          <!-- Navigation -->
          <div class="dp-header">
            <button class="dp-nav-btn" type="button" (click)="prevMonth()">
              <mat-icon class="icon-sm">chevron_left</mat-icon>
            </button>
            <span class="dp-period">{{ MONTH_NAMES[viewMonth] }} {{ viewYear }}</span>
            <button class="dp-nav-btn" type="button" (click)="nextMonth()">
              <mat-icon class="icon-sm">chevron_right</mat-icon>
            </button>
          </div>

          <!-- Day-of-week header -->
          <div class="dp-dow-row">
            @for (n of DAY_NAMES; track n) {
              <div class="dp-dow">{{ n }}</div>
            }
          </div>

          <!-- Calendar grid -->
          @for (week of weeks; track $index) {
            <div class="dp-week-row">
              @for (day of week; track $index) {
                <div class="dp-cell"
                     [class.dp-today]="isToday(day)"
                     [class.dp-selected]="isSelected(day)"
                     [class.dp-empty]="!day"
                     [class.dp-past]="isBeforeMin(day)"
                     (click)="selectDay(day)">
                  {{ day ?? '' }}
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class DatePickerComponent implements OnChanges {
  @Input()  value       = '';
  @Input()  disabled    = false;
  @Input()  placeholder = 'dd/mm/aaaa';
  @Input()  minDate     = '';  // YYYY-MM-DD — days before this are disabled
  @Output() valueChange = new EventEmitter<string>();

  isOpen    = false;
  viewYear  = new Date().getFullYear();
  viewMonth = new Date().getMonth();
  weeks: (number | null)[][] = [];

  readonly DAY_NAMES   = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  readonly MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                          'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  constructor(private el: ElementRef) {}

  get displayValue(): string {
    if (!this.value) return '';
    const [y, m, d] = this.value.split('-');
    return `${d}/${m}/${y}`;
  }

  ngOnChanges(c: SimpleChanges): void {
    if (c['value']?.currentValue) {
      const [y, m] = this.value.split('-').map(Number);
      if (!isNaN(y) && !isNaN(m)) { this.viewYear = y; this.viewMonth = m - 1; }
    }
  }

  toggle(): void {
    if (this.disabled) return;
    if (!this.isOpen) {
      if (this.value) {
        const [y, m] = this.value.split('-').map(Number);
        this.viewYear = y; this.viewMonth = m - 1;
      } else {
        const now = new Date();
        this.viewYear = now.getFullYear(); this.viewMonth = now.getMonth();
      }
      this.buildCalendar();
    }
    this.isOpen = !this.isOpen;
  }

  prevMonth(): void {
    if (this.viewMonth === 0) { this.viewMonth = 11; this.viewYear--; }
    else this.viewMonth--;
    this.buildCalendar();
  }

  nextMonth(): void {
    if (this.viewMonth === 11) { this.viewMonth = 0; this.viewYear++; }
    else this.viewMonth++;
    this.buildCalendar();
  }

  selectDay(day: number | null): void {
    if (!day || this.isBeforeMin(day)) return;
    const m = String(this.viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    this.valueChange.emit(`${this.viewYear}-${m}-${d}`);
    this.isOpen = false;
  }

  isBeforeMin(day: number | null): boolean {
    if (!day || !this.minDate) return false;
    const m = String(this.viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${this.viewYear}-${m}-${d}` < this.minDate;
  }

  isSelected(day: number | null): boolean {
    if (!day || !this.value) return false;
    const m = String(this.viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return this.value === `${this.viewYear}-${m}-${d}`;
  }

  isToday(day: number | null): boolean {
    if (!day) return false;
    const t = new Date();
    return t.getFullYear() === this.viewYear
        && t.getMonth()    === this.viewMonth
        && t.getDate()     === day;
  }

  @HostListener('document:mousedown', ['$event'])
  onOutsideClick(e: MouseEvent): void {
    if (this.isOpen && !this.el.nativeElement.contains(e.target)) {
      this.isOpen = false;
    }
  }

  private buildCalendar(): void {
    const firstDow    = new Date(this.viewYear, this.viewMonth, 1).getDay();
    const daysInMonth = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();
    const offset      = (firstDow + 6) % 7; // segunda = 0

    this.weeks = [];
    let week: (number | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      week.push(d);
      if (week.length === 7) { this.weeks.push(week); week = []; }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      this.weeks.push(week);
    }
  }
}
