import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ControllerService } from '../controller.service';
import { EventComponent } from "../event/event.component";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  @ViewChild(EventComponent) event:EventComponent;

  constructor(private controllerService:ControllerService) {
  }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    // ページ開いたときに localstrage からロード
    setTimeout(()=>{this.loadData()},300);
  }


  saveData(){
    console.log("main-save")
    this.controllerService.saveEvent()
  }
  loadData(){
    console.log("main-load")
    this.controllerService.loadEventFromLocalStrage()
    this.event.updateMessages();
  }

}
