import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {
  HostedServicesComponentComponent
} from './components/side-nav-content/hosted-services-component/hosted-services-component.component';
import {SocialMediaComponentComponent} from './pages/main/social-media-component/social-media-component.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FirstSectionComponent} from './pages/main/main-component/first-section.component';
import {TypewriterDirective} from './typewriter.directive';
import {HeaderComponent} from './components/header/header.component';
import {SideNavComponent} from './components/side-nav/side-nav.component';
import {SideNavContentComponent} from './components/side-nav-content/side-nav-content.component';
import {MainComponent} from './pages/main/main.component';
import {AppRoutingModule} from './app-routing.module';
import {GalleryComponent} from './pages/gallery/gallery/gallery.component';

@NgModule({
  declarations: [
    AppComponent,
    HostedServicesComponentComponent,
    SocialMediaComponentComponent,
    TypewriterDirective,
    HeaderComponent,
    SideNavComponent,
    SideNavContentComponent,
    MainComponent,
    FirstSectionComponent,
    GalleryComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
