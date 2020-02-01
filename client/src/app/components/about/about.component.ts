import { AfterViewInit, Component, OnInit } from '@angular/core';
import 'jarallax';
declare var jarallax: any;

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit{
  
  ngAfterViewInit() {
    jarallax(document.querySelectorAll('.jarallax'), {
      speed: 0.2
    });
  }

  constructor() { }

  ngOnInit() {
  }

}
