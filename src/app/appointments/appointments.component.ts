import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppointmentField } from '../core/constant/AppointmentField';
import { AppointmentModel } from '../core/model/appointment-model';
import * as moment from "moment";
import { AppointmentService } from '../core/service/appointment.service';
import { AppointmentDTO } from '../core/model/appointment-dto';
import { DatePipe, Time } from '@angular/common';

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

  displayAppointmentModal: boolean = false;
  submitConfirmationModal: boolean = false;
  deleteConfirmationModal: boolean = false;
  isSubmitDisabled: boolean = true;
  isFilterDisabled: boolean = false;
  hasConflict: boolean = false;

  startDateFilter: Date;
  endDateFilter: Date ;

  isoFormat = 'YYYY-MM-DD';
  timeFormat = 'HH:mm:ss';

  ngOnInit(): void {
    this.cols = [
      { header: 'Doctor', field: 'doctorName'},
      { header: 'Patient', field: 'patientName'},
      { header: 'Start Time', field: 'startTime'},
      { header: 'End Time', field: 'endTime'},
      { header: 'Comments', field: 'comments'},
    ];

    this.getAllAppointments();
    this.createAppointmentForm();
    this.validateDateFilters()
  }

  getAllAppointments() {
    let start = this.datePipe.transform(this.startDateFilter, 'yyyy-MM-dd HH:mm');
    let end = this.datePipe.transform(this.endDateFilter, 'yyyy-MM-dd HH:mm');
    this.appointmentService.getAllAppointments(start, end).subscribe(
      response => {
        this.appointments = response;
      }
    );
  }

  createAppointmentForm() {
    this.appointmentForm = this.formBuilder.group({
      doctorName: [],
      patientName: [],
      startDate: [],
      endDate: [],
      startTime: [],
      endTime: [],
      comments: []
    });
  }

  createAppointment() {
    this.displayAppointmentModal = true;
    this.appointmentForm.reset();
    this.appointmentForm.get(AppointmentField.START_DATE).setValue(new Date());
    this.appointmentForm.get(AppointmentField.END_DATE).setValue(new Date());
    this.appointmentForm.get(AppointmentField.START_TIME).setValue(new Date());
    this.appointmentForm.get(AppointmentField.END_TIME).setValue(new Date());
  }

  editAppointment() {
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
  }

  deleteAppointment () {
    if (null !== this.selectedAppointment) {
      this.appointmentService.deleteAppointment(this.selectedAppointment.id).subscribe(
        response => {
          this.getAllAppointments();
        },
        error => {}
      )
    }
  }

  showDeleteConfirmationModal() {
    this.deleteConfirmationModal = true;
  }

  showConfirmationModal() {
    this.submitConfirmationModal = true;
  }

  submitFields() {
    this.submitConfirmationModal = false;
    this.displayAppointmentModal=false;

    console.log(this.mapAppointmentformToModel());
    this.appointmentService.saveAppointment(this.mapAppointmentformToModel()).subscribe(
      response => {
        this.getAllAppointments();
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

    if (null !== this.selectedAppointment && null !== this.selectedAppointment.id) {
      appointmentObj.id = this.selectedAppointment.id;
    }
    appointmentObj.doctorName = this.appointmentForm.get(AppointmentField.DOCTOR_NAME).value;
    appointmentObj.patientName = this.appointmentForm.get(AppointmentField.PATIENT_NAME).value;
    appointmentObj.startDateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 
                                              startTime.getHours(), startTime.getMinutes());
    appointmentObj.endDateTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 
                                            endTime.getHours(), endTime.getMinutes());
    appointmentObj.comments = this.appointmentForm.get(AppointmentField.COMMENTS).value;
    return appointmentObj;
  }
  
  validateDateFilters() {
    this.isFilterDisabled = this.isNullorUndefined(this.startDateFilter) || this.isNullorUndefined(this.endDateFilter);
  }

  saveDateFilters() {
    this.getAllAppointments();
  }

  checkFormValidity() {
    const startDate: Date  = this.appointmentForm.get(AppointmentField.START_DATE).value;
    const endDate: Date  = this.appointmentForm.get(AppointmentField.END_DATE).value;
    const startTime: Date  = this.appointmentForm.get(AppointmentField.START_TIME).value;
    const endTime: Date  = this.appointmentForm.get(AppointmentField.END_TIME).value;
    const startDateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 
                                              startTime.getHours(), startTime.getMinutes());
    const endDateTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 
                                            endTime.getHours(), endTime.getMinutes());
    console.log(startDateTime)
    console.log(endDateTime)
    let start = this.datePipe.transform(startDateTime, 'yyyy-MM-dd HH:mm');
    let end = this.datePipe.transform(endDateTime, 'yyyy-MM-dd HH:mm');
    this.appointmentService.checkAppointmentConflict(
      undefined !== this.selectedAppointment.id ? this.selectedAppointment.id.toString(): "0", 
        start, end).subscribe(
      response => {
        this.isSubmitDisabled = response;
        this.hasConflict = response;
      },
      error => {}
    );
  }

  isNullorUndefined(value) {
    return null === value || undefined === value ? true: false;
  }

}
