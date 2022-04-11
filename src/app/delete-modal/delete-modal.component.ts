import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { ControllerService } from '../controller.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit {

  constructor(
    private controllerService:ControllerService,
    public dialogRef: MatDialogRef<DeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {eventId:number,eventName:string},
  ) {}

  ngOnInit(): void {
  }

  deleteEvent(){
    this.controllerService.deleteEvent(this.data.eventId);
    this.dialogRef.close()
  }
  closeMe(){
    this.dialogRef.close()
  }

}
