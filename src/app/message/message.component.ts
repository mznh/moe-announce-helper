import { Output, EventEmitter, AfterViewInit,ViewChild, Component, OnInit, OnChanges, Input} from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FormBuilder } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import { MessageData } from '../model/message-data';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @ViewChild('messageValue') messageValue:any;
  @ViewChild('typeValue') typeValue:any;
  @Input() inputMessageId:number;
  @Input() inputMessageType:string;
  @Input() inputMessageText:string;
  @Output() textChangeEvent = new EventEmitter<MessageData>();

  constructor(private clipboard: Clipboard){ 
  }


  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.messageValue.nativeElement.value = this.inputMessageText;
  }

  public copyToClipboard(){
    //const messageText = this.messageValue.nativeElement.value;
    const messageText = this.inputMessageText;
    //console.log("kore kopi ")
    //console.log(messageText)

    this.clipboard.copy(messageText)
  }

  public copyToClipboardWithCmdStyle(){
    //const messageText = this.messageValue.nativeElement.value;
    const messageText = this.inputMessageText;
    const moeCmd = this.inputMessageType;
    const copyText = "/" + moeCmd + " " + messageText.replace(/\r?\n/g,"");

    //console.log("kore kopi ")
    //console.log(messageText)
    this.clipboard.copy(copyText)
  }

  public deleteMessage(){
    this.textChangeEvent.emit({
      id: this.inputMessageId,
      msgType: "delete",
      text: ""
    });
  }
  public nameChange(){
  }

  public typeChange(value:string){
    this.textChangeEvent.emit({
      id: this.inputMessageId,
      msgType: value,
      text: this.inputMessageText
    });
  }
  public textChange(){
    const messageText = this.messageValue.nativeElement.value;
    this.textChangeEvent.emit({
      id: this.inputMessageId,
      msgType: this.inputMessageType,
      text: messageText
    });
  }
  public onSelect(){
    this.textChangeEvent.emit({
      id: this.inputMessageId,
      msgType: this.inputMessageType,
      text: this.inputMessageText
    });
  }

}
