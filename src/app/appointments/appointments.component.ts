import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentField } from '../core/constant/AppointmentField';
import { AppointmentModel } from '../core/model/appointment-model';
import * as moment from "moment";
import { AppointmentService } from '../core/service/appointment.service';
import { AppointmentDTO } from '../core/model/appointment-dto';
import { DatePipe, Time } from '@angular/common';
import {
  startOfMonth,
  endOfMonth
} from 'date-fns';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {

  constructor(private datePipe: DatePipe,
              private formBuilder: FormBuilder,
              private appointmentService: AppointmentService) { }

  cols: any[] = [];
  appointments: AppointmentDTO[] = [];
  selectedAppointment: AppointmentDTO;
  appointmentForm: FormGroup;

  formMode: string;

  displayAppointmentModal: boolean = false;
  submitConfirmationModal: boolean = false;
  deleteConfirmationModal: boolean = false;

  doctorList: string[] = []
  selectedDoctor: string;
  
  isSubmitDisabled: boolean = true;
  isFilterDisabled: boolean = false;
  hasConflictFlag: boolean = false;
  invalidDateRangeFlag: boolean = false;
  isTimeRangeValid: boolean = false;

  startDateFilter: Date;
  endDateFilter: Date ;

  isoFormat = 'YYYY-MM-DD';
  timeFormat = 'HH:mm:ss';

  ngOnInit(): void {
    this.cols = [
      { header: 'Doctor', field: AppointmentField.DOCTOR_NAME },
      { header: 'Patient', field: AppointmentField.PATIENT_NAME },
      { header: 'Start Time', field: 'startTime'},
      { header: 'End Time', field: 'endTime'},
      { header: 'Comments', field: AppointmentField.COMMENTS },
    ];
    if (this.isNullorUndefined(this.startDateFilter) || this.isNullorUndefined(this.endDateFilter)) {
      this.startDateFilter = startOfMonth(new Date);
      this.endDateFilter = endOfMonth(new Date);
    }
    this.getAllAppointments();
    this.createAppointmentForm();
    this.validateDateFilters()
  }

  getAllAppointments() {
    let start = this.datePipe.transform(this.startDateFilter.setHours(0,0,0,0), 'yyyy-MM-ddTHH:mm:ss')
    let end = this.datePipe.transform(this.endDateFilter.setHours(23,59,59,59), 'yyyy-MM-ddTHH:mm:ss')
    this.appointmentService.getAllAppointments(start, end).subscribe(
        response => {
          this.appointments = response;
        }
    );
  }

  createAppointmentForm() {
    this.appointmentForm = this.formBuilder.group({
      doctorName: ['', Validators.required],
      patientName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      comments: ['', Validators.required]
    });
  }

  createAppointment() {
    this.formMode = 'submit';
    this.displayAppointmentModal = true;
    this.appointmentForm.reset();
    this.generateDoctorOptions();
  }

  editAppointment() {
    this.formMode = 'edit';
    if (null !== this.selectedAppointment) {
      this.displayAppointmentModal = true;
      const startDateTime: Date = new Date(this.selectedAppointment.startDateTime);
      const endDateTime: Date = new Date(this.selectedAppointment.endDateTime);
      this.appointmentForm.get(AppointmentField.DOCTOR_NAME).setValue(this.selectedAppointment.doctorName);
      this.appointmentForm.get(AppointmentField.PATIENT_NAME).setValue(this.selectedAppointment.patientName);
      this.appointmentForm.get(AppointmentField.START_DATE).setValue(startDateTime);
      this.appointmentForm.get(AppointmentField.END_DATE).setValue(endDateTime);
      this.appointmentForm.get(AppointmentField.START_TIME).setValue(startDateTime);
      this.appointmentForm.get(AppointmentField.END_TIME).setValue(endDateTime);
      this.appointmentForm.get(AppointmentField.COMMENTS).setValue(this.selectedAppointment.comments);
    }
    this.generateDoctorOptions();
  }

  deleteAppointment () {
    if (null !== this.selectedAppointment) {
      this.appointmentService.deleteAppointment(this.selectedAppointment.id).subscribe(
        response => {
          this.getAllAppointments();
          this.selectedAppointment = null;
        },
        error => {}
      )
    }
  }

  generateDoctorOptions() {

  }

  checkFormValidity() {
    const startDate: Date  = this.appointmentForm.get(AppointmentField.START_DATE).value;
    const endDate: Date  = this.appointmentForm.get(AppointmentField.END_DATE).value;
    const startTime: Date  = this.appointmentForm.get(AppointmentField.START_TIME).value;
    const endTime: Date  = this.appointmentForm.get(AppointmentField.END_TIME).value;

    if ((!this.isNullorUndefined(endTime) && endTime.getHours() == 17 && endTime.getMinutes() > 0)
          || (!this.isNullorUndefined(endTime) && endTime.getHours() > 17 )
            || (!this.isNullorUndefined(startTime) && startTime.getHours() < 9)) {
      this.isTimeRangeValid = true;
    } else {
      this.isTimeRangeValid = false;
    }

    if (!this.isNullorUndefined(startDate) && !this.isNullorUndefined(endDate)
          && !this.isNullorUndefined(startTime) && !this.isNullorUndefined(endTime)) {
        const startDateTime = new Date(startDate.getFullYear(), startDate.getMonth(), 
                                startDate.getDate(), startTime.getHours(), startTime.getMinutes());
        const endDateTime = new Date(endDate.getFullYear(), endDate.getMonth(),
                              endDate.getDate(), endTime.getHours(), endTime.getMinutes());
        let start = this.datePipe.transform(startDateTime, 'yyyy-MM-dd HH:mm');
        let end = this.datePipe.transform(endDateTime, 'yyyy-MM-dd HH:mm');
      if (!(startDateTime > endDateTime)) {
        this.invalidDateRangeFlag = false;
          let id = !this.isNullorUndefined(this.selectedAppointment)
                      && !this.isNullorUndefined(this.selectedAppointment.id)
                        ? this.selectedAppointment.id.toString()
                        : 'null';
          this.appointmentService.checkAppointmentConflictWithId(id, start, end).subscribe(
            hasConflict => {
              this.hasConflictFlag = hasConflict;
            },
            error => {}
          );
      } else {
        this.invalidDateRangeFlag = true;
      }
    }
  }

  submitFields() {
    this.submitConfirmationModal = false;
    this.displayAppointmentModal= false;
    this.appointmentService.saveAppointment(this.mapAppointmentformToModel()).subscribe(
      response => {
        this.getAllAppointments();
        this.selectedAppointment = null;
      },
      error => {}
    );
  }

  mapAppointmentformToModel(): AppointmentModel {
    const appointmentObj = new AppointmentModel();
    const startDate: Date  = this.appointmentForm.get(AppointmentField.START_DATE).value;
    const endDate: Date  = this.appointmentForm.get(AppointmentField.END_DATE).value;
    const startTime: Date  = this.appointmentForm.get(AppointmentField.START_TIME).value;
    const endTime: Date  = this.appointmentForm.get(AppointmentField.END_TIME).value;

    appointmentObj.id = !this.isNullorUndefined(this.selectedAppointment) 
                          && !this.isNullorUndefined(this.selectedAppointment.id)
                            ? this.selectedAppointment.id
                            : null;
    
    appointmentObj.doctorName = this.appointmentForm.get(AppointmentField.DOCTOR_NAME).value;
    appointmentObj.patientName = this.appointmentForm.get(AppointmentField.PATIENT_NAME).value;
    appointmentObj.startDateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 
                                              startTime.getHours(), startTime.getMinutes());
    appointmentObj.endDateTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 
                                            endTime.getHours(), endTime.getMinutes());
    appointmentObj.comments = this.appointmentForm.get(AppointmentField.COMMENTS).value;
    return appointmentObj;
  }

  showDeleteConfirmationModal() {
    this.deleteConfirmationModal = true;
  }

  showConfirmationModal() {
    this.submitConfirmationModal = true;
  }

  closeConfirmationModel() {
    this.displayAppointmentModal=false;
    this.hasConflictFlag = false;
    this.invalidDateRangeFlag = false;
  }
  
  validateDateFilters() {
    this.isFilterDisabled = this.isNullorUndefined(this.startDateFilter) || this.isNullorUndefined(this.endDateFilter);
  }

  filterAppointmentDates() {
    this.getAllAppointments();
  }

  isNullorUndefined(value) {
    return null === value || undefined === value ? true: false;
  }

}
