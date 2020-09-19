import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { AppointmentsComponent } from './appointments/appointments.component';

import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { TableModule } from 'primeng/table'
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule as CalendarPrimeNG } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';

import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    CalendarViewComponent,
    HeaderComponent,
    AppointmentsComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory, }),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    
    TableModule,
    CheckboxModule,
    CalendarPrimeNG,
    DialogModule,
    DropdownModule,
    InputTextModule,

  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
