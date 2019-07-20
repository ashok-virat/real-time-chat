import { Component,OnChanges,Input,EventEmitter,Output,OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-first-char',
  templateUrl: './first-char.component.html',
  styleUrls: ['./first-char.component.css']
})
export class FirstCharComponent implements OnInit,OnChanges {
@Input() userName:string;
@Input() userBg:string;
@Input() userColor:string;

@Output()
notify:EventEmitter<string>=new EventEmitter<string>();

public previousname;
public firstChar:string;
private _name:string='';
  constructor() { }

  ngOnInit():void {
    this._name=this.userName;

    }

   ngOnChanges(changes:SimpleChanges){
       let userName=changes.userName;
      this._name=userName.currentValue;
      this.previousname=userName.previousValue;
      this.firstChar=this._name[0]
     
   }
   nameClicked(){
     this.notify.emit(this._name)
   }
}