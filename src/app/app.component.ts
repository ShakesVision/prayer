import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AppPages } from './models/common';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  lastUpdated: string = '';

  public appPages: AppPages[] = [
    { title: 'Help', url: 'help', icon: 'help-circle' },
    { title: 'About', url: 'about', icon: 'information-circle' },
    { title: 'Other apps', url: 'playstore', icon: 'logo-google-playstore' },
  ];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.fetchLastCommitTime();
  }
  goToDynamicContentPage(pageTitle: string, htmlContent: string) {
    let navigationExtras: NavigationExtras = {
      state: { pageTitle, htmlContent },
    };
    this.router.navigate(['dynamic-content'], navigationExtras);
  }
  gotopage(url: AppPages['url']) {
    let pageTitle = '';
    let htmlContent = '';
    switch (url) {
      case 'help':
        pageTitle = 'Help';
        htmlContent = `Although the UI is intuitive, here's a comprehensive list of features for ease of use.
        <p><b>Search: </b>Search for mosque names in Urdu or English to quickly filter out.</p>
        <p><b>Start & end time: </b>Get the start/end times of each Salah for Kamptee (based on latitude & longitude)</p>
        <p><b>Current Salah: </b>Highlights current Salah time.</p>
        <p><b>Consolidated list: </b>Get a consolidated list of Masaajid grouped based on timing. </p>
        <p><b>List on 1 click: </b>On each Salah name click, get the consolidated list for the corresponding Salah.</p>
        <p><b>Copy for WhatsApp: </b>Copy all the timings with mosque names for easy sharing. The times are formatted based on how the official WhatsApp group has been posting them.</p>
          `;
        this.goToDynamicContentPage(pageTitle, htmlContent);
        break;
      case 'about':
        pageTitle = 'About me and this app';
        htmlContent = `<p>I've slapped this app together in 3-4 days so there's room for improvement. </p>
        <ul>  
        <li>If you're a user, suggest what would make it better.</li>
        <li>If you're a developer, the app is open source. Pull requests are welcome.</li>
        <li>If you want to volunteer to update the time sheets, drop me a message on Telegram or WhatsApp. I'll add you as an editor. </li>
          </ul>
        <p>All the timelines are taken from the official WhatsApp group and are updated ASAP in the app as well. As we already have volunteers for each Masjid, we don't necessarily need those many admins for the app (i.e. timesheet used as a backend for this app). We need a few who can update the sheet based on inputs from the WhatsApp group.</p>
        <p>So the gist is - the WhatsApp group remains the app's main data source. I'll create a short video tutorial for the volunteers on how to update the sheet.</p>
        <p>Spoiler: It's nothing tricky - just adding the time in 24-hour format. The only thing is not to mess up the whole sheet while doing so. I will work on creating some backup system to avoid so, someday!</p>
        <p>— Shakeeb Ahmad</p>
          
          <h2>Links</h2>
          <ion-icon slot='start' name='logo-github'></ion-icon> GitHub: <a href="https://github.com/ShakesVision"> @ShakesVision </a> <br>
          <ion-icon slot='start' name='paper-plane'></ion-icon> Telegram : <a href="https://t.me/ShakesVision"> t.me/ShakesVision </a> <br>
          <ion-icon slot='start' name='logo-whatsapp'></ion-icon> WhatsApp: <a href="https://wa.me/+918956704184?text=%27Hello,%20saw%20your%20app%20Prayer%20Times%20-%20Kamptee%27"> +918956704184 </a> <br>
          <ion-icon slot='start' name='globe'></ion-icon> Blog (English) : <a href="https://www.shakeeb.in">shakeeb.in </a> <br>
          <ion-icon slot='start' name='globe'></ion-icon> Blog (Urdu) : <a href="https://ur.shakeeb.in"> ur.shakeeb.in </a> <br>
          `;
        this.goToDynamicContentPage(pageTitle, htmlContent);
        break;
      case 'playstore':
        window.open(
          'https://play.google.com/store/apps/dev?id=8917194327395382081',
          '_blank'
        );
        break;
    }
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
