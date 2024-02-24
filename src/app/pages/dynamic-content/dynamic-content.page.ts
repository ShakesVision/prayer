import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dynamic-content',
  templateUrl: './dynamic-content.page.html',
  styleUrls: ['./dynamic-content.page.scss'],
})
export class DynamicContentPage implements OnInit {
  pageTitle: string = '';
  htmlContent: SafeHtml = '';

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.pageTitle =
          this.router.getCurrentNavigation()?.extras?.state?.['pageTitle'];
        this.htmlContent =
          this.router.getCurrentNavigation()?.extras?.state?.['htmlContent'];
      }
    });
  }

  setDynamicContent(title: string, content: string) {
    this.pageTitle = title;
    this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
