import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appShowMenu]'
})
export class ShowMenuDirective {

  constructor(private renderer: Renderer2, private el: ElementRef, ) { 
  }

  @HostListener('click', ['$event']) onClick(event: Event) {
    event.stopPropagation();
    let dropdownMenu = this.el.nativeElement.nextSibling;
    document.querySelectorAll(".dropdown-menu").forEach(function(el){
      el.classList.remove("show");
    })
    if(dropdownMenu.classList.contains("show")) {
      this.renderer.removeClass(dropdownMenu, "show");
    }else {
      this.renderer.addClass(dropdownMenu, "show");
    }
  }

  @HostListener('document:click') clickOutside() {
    document.querySelectorAll(".dropdown-menu").forEach(function(el){
      el.classList.remove("show");
    })
  }

}
