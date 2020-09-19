import { Time } from '@angular/common';

export class AppointmentDTO {

  id: Number;
  doctorName: String;
  patientName: String;
  startDateTime: Date;
  endDateTime: Date;
  comments: String;
  
}
