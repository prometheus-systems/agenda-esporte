import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable,range,zip } from 'rxjs'
import { timer } from 'rxjs/observable/timer'
@Component({
  selector: 'timer',

  template: `<p [style.color]="areTenSecsRemainings?'red':''">{{timerValue.hours|number :'2.0'}}:{{timerValue.minutes|number :'2.0'}}:{{timerValue.seconds|number :'2.0'}}</p>`,
  styles: [`h1 { font-family: Lato; }`]
})
export class TimerComponent implements OnInit {
  @Input() value: number
  @Output('onComplete') timerOver: EventEmitter<any> = new EventEmitter<any>();
  timerValue
  areTenSecsRemainings:boolean=false;
  constructor() { }

  ngOnInit() {
    let source$; /*= range(0, this.value);
    zip(
      timer(0, 1000),
      (x) => { return x }
    ).map(x => {
      return this.value - x

    })*/

    source$.subscribe(seconds => {
      // console.log(seconds)
      let mins = parseInt("" + seconds / 60);
      let secs = seconds % 60;
      let hrs = parseInt("" + mins / 60);
      mins = mins % 60
      if(secs<11) this.areTenSecsRemainings=true
      let res = {
        'hours': hrs,
        'minutes': mins,
        'seconds': secs
      }

      this.timerValue=res;
    }, () => this.timerOver.emit('TIMER ERROR'), () => this.timerOver.emit('TIMER OVER'))
  }

 



}
