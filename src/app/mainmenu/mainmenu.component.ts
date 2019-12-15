import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.scss'],
})
export class MainmenuComponent implements OnInit, OnDestroy{
  @ViewChild('dataLibrary', {static: true}) dataLibraryNav: ElementRef;
  dataLibraryClick: any;
  constructor(private router: Router, private renderer: Renderer2) { }

  ngOnInit() {
    this.dataLibraryClick = this.renderer.listen(this.dataLibraryNav.nativeElement, 'click', () => {
      setTimeout(() => {
        this.router.navigateByUrl('library');
      }, 200);
    });
  }

  ngOnDestroy(): void {
    this.dataLibraryClick();
  }
}
