import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  lastUpdated: string = '';

  public appPages = [
    // { title: 'Help', url: '/help', icon: 'help-circle' },
    { title: 'About', url: '/about', icon: 'information-circle' },
    // { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    // { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    // { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    // { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    // { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private router: Router, private http: HttpClient) {}
  ngOnInit() {
    this.fetchLastCommitTime();
  }
  goToDynamicContentPage() {
    const pageTitle = 'About me and this app';
    const htmlContent = `I've slapped this app together in 3-4 days so there's room for improvement. <br><br>
      If you're a user, suggest what would make it better.<br>
      If you're a developer, the app is open source. Pull requests are welcome.<br>
      If you want to volunteer in updating the time sheets, drop me a message at Telegram (@ShakesVision) or WhatsApp. I'll add you as an editor.
      
      <h2>Links</h2>
      
      GitHub: github.com/ShakesVision <br>
      Telegram: t.me/ShakesVision <br>
      WhatsApp: +918956704184 <br>
      Website: www.sarbakaf.com [Freelance services for websites, apps, e-publishing, writing & more] <br>
      Blog (English): www.shakeeb.in <br>
      Blog (Urdu): ur.shakeeb.in <br>
      `;
    let navigationExtras: NavigationExtras = {
      state: { pageTitle, htmlContent },
    };
    this.router.navigate(['dynamic-content'], navigationExtras);
  }

  fetchLastCommitTime() {
    const repoOwner = 'shakesvision';
    const repoName = 'prayer';
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/commits`;

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        if (response.length > 0) {
          const lastCommitTime = response[0].commit.author.date;
          this.lastUpdated = new Date(lastCommitTime).toLocaleString();
        } else {
          this.lastUpdated = '';
        }
      },
      (error) => {
        console.error('Failed to fetch last commit time:', error);
        this.lastUpdated = '';
      }
    );
  }
}
