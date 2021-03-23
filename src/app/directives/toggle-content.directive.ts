import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appToggleContent]'
})
export class ToggleContentDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('click') onClick() {
    let contentEl = this.el.nativeElement.parentElement.querySelector('.content-body');
    if(contentEl.classList.contains("clipped")) {
      this.renderer.removeClass(contentEl, 'clipped');
      this.el.nativeElement.innerHTML = "...Read Less"
    }else {
      this.renderer.addClass(contentEl, 'clipped');
      this.el.nativeElement.innerHTML = "Read More..."
    }
  }

}
