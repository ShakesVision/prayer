import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AppPages } from './models/common';
import {
  LocationListType,
  MasjidServiceService,
} from './services/masjid-service.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  DEFAULT_LOCATION = 'kamptee';
  lastUpdated: string = '';
  githubCommits!: any[];
  locations: LocationListType[] = [];
  selectedLocation!: LocationListType;

  public appPages: AppPages[] = [
    { title: 'Todo', url: 'todo', icon: 'hourglass' },
    { title: 'Changelog', url: 'changelog', icon: 'list' },
    { title: 'Help', url: 'help', icon: 'help-circle' },
    { title: 'About', url: 'about', icon: 'information-circle' },
    { title: 'Other apps', url: 'playstore', icon: 'logo-google-playstore' },
  ];

  /**
   * Popover options for ion-select.
   */
  customPopoverOptions = {
    header: 'Add or switch locations',
    message:
      'You can add custom location with data url - URL should return JSON. Refer the existing sheet URL for example data. Copy & modify to create your own.',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private mService: MasjidServiceService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.fetchLastCommitTime();
    this.mService.loadLocations();
    this.mService.selectedLocation$.subscribe((location) => {
      this.selectedLocation = location;
      this.locations = this.mService.locations;
    });
    console.log(this.locations, this.mService.locations);
  }

  /**
   * Compare function for the ion-select so that the first value in the dropdown can be selected.
   * @param e1 location 1
   * @param e2 location 2
   * @returns boolean
   */
  compareFn(e1: LocationListType, e2: LocationListType): boolean {
    return e1 && e2 ? e1.id == e2.id : e1 == e2;
  }

  /**
   * Navigates to a dynamic content page. The page title and content are passed
   * as parameters. The content is expected to be a string of HTML content.
   * The page title is used as the title of the page and the part of the URL.
   * @param pageTitle the title of the page
   * @param htmlContent the HTML content of the page
   */
  goToDynamicContentPage(pageTitle: string, htmlContent: string) {
    let navigationExtras: NavigationExtras = {
      state: { pageTitle, htmlContent },
    };
    this.router.navigate(['info', pageTitle.toLowerCase()], navigationExtras);
  }
  gotopage(url: AppPages['url']) {
    let pageTitle = '';
    let htmlContent = '';
    let defaultPageTitle = 'About';
    let defaultHtmlContent = `<h2>YAST - Yet Another Salah Time</h2>
    <i>Never miss a Jamaat, near or far <br> لا تفوت جماعة، قريبًا أو بعيدًا</i>

    <p>
      <b>Version 1</b>
      <i>February 25, 2024</i>
    </p>
    <hr style='background: lightgrey;'>
    <p>I've slapped this app together in 3-4 days so there's room for improvement. </p>
    <ul>  
    <li>If you're a user, suggest what would make it better.</li>
    <li>If you're a developer, the app is open source. Pull requests are welcome.</li>
    <li>If you want to volunteer to update the time sheets, drop me a message on Telegram or WhatsApp. I'll add you as an editor. </li>
      </ul>
    <p>All the timelines are taken from the official WhatsApp group and are updated ASAP in the app as well. As we already have volunteers for each Masjid, we don't necessarily need those many admins for the app (i.e. timesheet used as a backend for this app). We need a few who can update the sheet based on inputs from the WhatsApp group.</p>
    <p>So the gist is - the WhatsApp group remains the app's main data source. I'll create a short video tutorial for the volunteers on how to update the sheet.</p>
    <p>Spoiler: It's nothing tricky - just adding the time in 24-hour format. The only thing is not to mess up the whole sheet while doing so. I will work on creating some backup system to avoid so, someday!</p>
    <p>
      <b>Version 2</b>
      <i>December 31, 2024</i>
    </p>
    <hr style='background: lightgrey;'>
    <p>This major update has many things - but the main focus was to generalize the app and not make it location specific such that other people can use it for their own locations.</p>
    <p>Now you can add custom locations, with a link to a Google sheet with all the Jamaat time data. Refer the sheet of the default location (Kamptee) and copy it for your own location. <a href="https://docs.google.com/spreadsheets/d/1T6912yPUI3dCLB61f46TvxjcVB7UbWGP3BeaA43rkiE/edit?usp=sharing"> Sample Sheet </a></p>
    <p>— Shakeeb Ahmad</p>
      
      <h2>Links</h2>
      <ion-icon slot='start' name='logo-github'></ion-icon> GitHub: <a href="https://github.com/ShakesVision"> @ShakesVision </a> <br>
      <ion-icon slot='start' name='paper-plane'></ion-icon> Telegram : <a href="https://t.me/ShakesVision"> t.me/ShakesVision </a> <br>
      <ion-icon slot='start' name='logo-whatsapp'></ion-icon> WhatsApp: <a href="https://wa.me/+918956704184?text=%27Hello,%20saw%20your%20app%20Prayer%20Times%20-%20Kamptee%27"> +918956704184 </a> <br>
      <ion-icon slot='start' name='globe'></ion-icon> Blog (English) : <a href="https://www.shakeeb.in">shakeeb.in </a> <br>
      <ion-icon slot='start' name='globe'></ion-icon> Blog (Urdu) : <a href="https://ur.shakeeb.in"> ur.shakeeb.in </a> <br>
      `;
    switch (url) {
      case 'changelog':
        pageTitle = 'Changelog';
        this.githubCommits.forEach((commit: any, i) => {
          htmlContent += `
            <b>${i + 1}. 
              ${new Date(commit.commit.author.date).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </b>
          <br>
          <i style="margin-left:1rem">${commit.commit.message}</i>
          <br><br>
          `;
        });
        this.goToDynamicContentPage(pageTitle, htmlContent);
        break;
      case 'todo':
        pageTitle = 'Todo';
        htmlContent = `
        <ul>
          <li>Copy button should exclude '-' value salah times.</li>
          <li>Accept Google Sheet URL from user along with the exisiting "JSON End point". Convert the sheet to the json endpoint yourself. Otherwise, other hosts will work using endpoint.</li>
          <li>A way to create snapshot of all timings / ui screen as chart. Preferably export as pdf as well as image. Would be useful in sending daily updates to the "City" Whatsapp groups.</li>
          <li>Update app icon and labels to generalize (YAST) instead of specifying "Kamptee", since we support custom locations now.</li>
          <li>Don't exit the app on back button directly, confirm first.</li>
          <li>Use prayertiming library (batoulapps/adhan-js) instead of API.</li>
        </ul>
        `;
        this.goToDynamicContentPage(pageTitle, htmlContent);
        break;
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
        pageTitle = defaultPageTitle;
        htmlContent = defaultHtmlContent;
        this.goToDynamicContentPage(pageTitle, htmlContent);
        break;
      case 'playstore':
        window.open(
          'https://play.google.com/store/apps/dev?id=8917194327395382081',
          '_blank'
        );
        break;
      default:
        pageTitle = defaultPageTitle;
        htmlContent = defaultHtmlContent;
        this.goToDynamicContentPage(pageTitle, htmlContent);
        break;
    }
  }

  /**
   * Fetches the last commit time from GitHub API, and updates the `lastUpdated`
   * property with the commit date and message. If the API call fails,
   * `lastUpdated` is set to an empty string.
   */
  fetchLastCommitTime() {
    const repoOwner = 'shakesvision';
    const repoName = 'prayer';
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/commits`;

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        if (response.length > 0) {
          const lastCommitTime = response[0].commit.author.date;
          this.lastUpdated = `${new Date(lastCommitTime).toLocaleString()}`;
          this.githubCommits = response;
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

  /**
   * Toggles the 'dark' class on the <body> element to switch between
   * light and dark themes.
   * @param event The event object passed from the ion-toggle component.
   */
  changeTheme(event: any) {
    document.body.classList.toggle('dark');
  }

  handleChange(e: any) {
    console.log('ionChange fired with value: ', e.detail.value);
    this.selectedLocation = e.detail.value;
    this.mService.selectedLocation$.next(this.selectedLocation);
  }

  /**
   * Prompts the user to input a new location (or edit an existing one).
   * If the user clicks 'Save', the new location is added to the list of
   * locations. If the user clicks 'Cancel', the dialog is simply dismissed.
   * @param location The location to edit, or undefined if adding a new location.
   */
  async addLocation(location?: LocationListType) {
    const isDefaultLocation = location?.id === this.DEFAULT_LOCATION;
    const alert = await this.alertController.create({
      header: location ? 'Edit Location' : 'Add Location',
      inputs: [
        {
          name: 'id',
          type: 'text',
          placeholder: 'ID',
          value: location ? location.id : '',
          disabled: isDefaultLocation,
        },
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name',
          value: location ? location.name : '',
          disabled: isDefaultLocation,
        },
        {
          name: 'latitude',
          type: 'text',
          placeholder: 'Latitude',
          value: location ? location.latitude : '',
          disabled: isDefaultLocation,
        },
        {
          name: 'longitude',
          type: 'text',
          placeholder: 'Longitude',
          value: location ? location.longitude : '',
          disabled: isDefaultLocation,
        },
        {
          name: 'url1',
          type: 'text',
          placeholder: 'Data URL (URL 1)',
          value: location ? location.url1 : '',
          disabled: isDefaultLocation,
        },
        {
          name: 'url2',
          type: 'text',
          placeholder: "Backup Data URL (URL 2), incase url1 doesn't work",
          value: location ? location.url2 : '',
          disabled: isDefaultLocation,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          handler: (data) => {
            if (location) {
              // Edit mode: Update the existing location
              this.mService.updateLocation(data);
            } else {
              // Add mode: Create a new location
              this.createLocation(data);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Adds a new location to the list of locations and saves it to local storage.
   * @param data The location data to be added.
   */
  private createLocation(data: LocationListType) {
    this.locations.push(data);
    this.mService.saveLocations();
  }

  /**
   * Deletes a location from the list of locations and saves it to local storage.
   * @param location The location to be deleted.
   */
  async deleteLocation(location: LocationListType) {
    // Prevent deletion of the default location
    if (location.id === this.DEFAULT_LOCATION) return;
    const index = this.locations.findIndex((l) => l.id === location.id);
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'Are you sure you want to delete this location?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            if (index !== -1) {
              this.locations.splice(index, 1);
              const selectedIndex = Math.max(index - 1, 0);
              this.mService.selectedLocation$.next(
                this.locations[selectedIndex]
              );
              this.mService.saveLocations();
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
