import { Component, Inject, Renderer2, OnDestroy, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnDestroy {
  isMenuOpen = false;

constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth > 768 && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.updateBodyScroll();
  }

  // Add this method to handle link clicks
  closeMenu() {
    this.isMenuOpen = false;
    this.updateBodyScroll();
  }

   private updateBodyScroll() {
    if (this.isMenuOpen) {
      this.renderer.addClass(this.document.body, 'no-scroll');
    } else {
      this.renderer.removeClass(this.document.body, 'no-scroll');
    }
  }

  // Ensure the class is removed if the user navigates away
  // and the header gets destroyed while the menu is still open
  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'no-scroll');
  }
}
