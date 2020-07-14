import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HostedServicesComponentComponent } from './sidebar/hosted-services-component/hosted-services-component.component';
import { SocialMediaComponentComponent } from './social-media-component/social-media-component.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MainComponentComponent } from './main-component/main-component.component';
import {TypewriterDirective} from './typewriter.directive';

@NgModule({
  declarations: [
    AppComponent,
    HostedServicesComponentComponent,
    SocialMediaComponentComponent,
    SidebarComponent,
    MainComponentComponent,
    TypewriterDirective
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
