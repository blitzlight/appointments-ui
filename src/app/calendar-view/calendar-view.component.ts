import { Component, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';


@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  locale: string = 'en';

  viewChange = new EventEmitter<CalendarView>();

  viewDateChange = new EventEmitter<Date>();

  CalendarView = CalendarView;

  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];

  changeDay(date: Date) {
    this.viewDate = date;
    this.view = CalendarView.Day;
  }

}
