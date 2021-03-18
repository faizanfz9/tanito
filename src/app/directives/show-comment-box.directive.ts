import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appShowCommentBox]'
})
export class ShowCommentBoxDirective {

  constructor(private el: ElementRef, private renderer: Renderer2,) { }

  @HostListener('click') onClick() {
    let cardEl = this.el.nativeElement.parentElement.parentElement;
    let cmntBoxEl = cardEl.querySelector(".comment-box");
    if(cmntBoxEl.classList.contains("show")) {
      this.renderer.removeClass(cmntBoxEl, "show");
      this.el.nativeElement.style.fill = "#474747";
    }else {
      this.renderer.addClass(cmntBoxEl, "show");
      this.el.nativeElement.style.fill = "#514DC5";
    }
  }
}
