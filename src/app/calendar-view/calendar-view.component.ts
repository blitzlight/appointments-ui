import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { AppointmentDTO } from '../core/model/appointment-dto';
import { AppointmentService } from '../core/service/appointment.service';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
} from 'date-fns';
import { title } from 'process';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarViewComponent implements OnInit {

  constructor(private datePipe: DatePipe,
              private appointmentService: AppointmentService) { }

  locale: string = 'en';
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  viewChange = new EventEmitter<CalendarView>();
  viewDateChange = new EventEmitter<Date>();
  events: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();

  appointments: AppointmentDTO[];

  ngOnInit(): void {
    this.getAllAppointments();
  }

 getAllAppointments() {
    let start = this.datePipe.transform(startOfMonth(new Date()), 'yyyy-MM-dd HH:mm');
    let end = this.datePipe.transform(endOfMonth(new Date()), 'yyyy-MM-dd HH:mm');
    this.appointmentService.getAllAppointments(start, end).subscribe(
      response => {
        this.appointments = response;
        this.mapAppointmentsToCalendar()
        this.refresh.next()
      }
    )
  }

  mapAppointmentsToCalendar() {
    this.appointments.forEach((appointment) => {
      this.events.push({
        id: appointment.id.toString(),
        title: appointment.comments.toString(),
        start: new Date(appointment.startDateTime),
        end: new Date(appointment.endDateTime),
      });
    });
    console.log(this.events)
  }

  changeDay(date: Date) {
    this.viewDate = date;
    this.view = CalendarView.Day;
  }

}
