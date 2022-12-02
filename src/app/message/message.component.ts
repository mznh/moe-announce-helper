import { Output, EventEmitter, 
  AfterViewInit,ViewChild, 
  Component, OnInit, OnChanges, 
  Input, HostBinding} from '@angular/core';
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
  @Input() inputMessageIsLocked:boolean;
  @Output() textChangeEvent = new EventEmitter<MessageData>();

  isCopied:boolean;
  isLocked:boolean;

  constructor(private clipboard: Clipboard){ 
    this.isCopied = false;
    this.isLocked = this.inputMessageIsLocked;
  }


  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.messageValue.nativeElement.value = this.inputMessageText;
  }

  ngOnChanges(){
    this.isLocked = this.inputMessageIsLocked
  }

  public copyToClipboard(){
    //const messageText = this.messageValue.nativeElement.value;
    const messageText = this.inputMessageText;

    this.clipboard.copy(messageText)
    this.isCopied = true;
  }

  public copyToClipboardWithCmdStyle(){
    //const messageText = this.messageValue.nativeElement.value;
    const messageText = this.inputMessageText;
    const moeCmd = this.inputMessageType;
    const copyText = "/" + moeCmd + " " + messageText.replace(/\r?\n/g,"");

    this.clipboard.copy(copyText);
    this.isCopied = true;
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
  public onMouse(){
    this.messageValue.nativeElement.blur();
  }
  public clickTypeSelectForm(){
    this.typeValue.open()
  }

}
