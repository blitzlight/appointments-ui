import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppointmentsComponent } from 'src/app/appointments/appointments.component';
import { AppointmentDTO } from '../model/appointment-dto';
import { AppointmentModel } from '../model/appointment-model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private BASE_URL = 'http://localhost:8085/appointments-api/appointment';

  constructor(private http: HttpClient) { }

  getAllAppointments(startDate: string, endDate: string) {
    const url = `${this.BASE_URL}/getAllAppointments`;
    const httpParam = new HttpParams().append('startDateTime', startDate)
                                      .append('endDateTime', endDate);
    const httpOptions = {
      params: httpParam
    };
    return this.http.get<AppointmentDTO[]>(url, httpOptions);
  }

  saveAppointment(appointment: AppointmentModel) {
    const url = `${this.BASE_URL}/saveAppointment`;
    return this.http.post<AppointmentModel>(url, appointment);
  }

  deleteAppointment(id: Number) {
    const url = `${this.BASE_URL}/deleteAppointment?appointmentId=${id}`;
    return this.http.delete<AppointmentModel>(url);
  }

  checkAppointmentConflict(id: string, startDateTime: string, endDateTime: string) {
    const url = `${this.BASE_URL}/checkAppointmentConflict`;
    const httpParam = new HttpParams().append('id', id)
                                      .append('startDateTime', startDateTime)
                                      .append('endDateTime', endDateTime);
    const httpOptions = {
      params: httpParam
    };
    return this.http.get<any>(url, httpOptions);
  }
  
}
