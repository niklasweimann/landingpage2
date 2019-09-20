import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ParticlesModule } from 'angular-particle';

import { AppComponent } from './app.component';
import { HostedServicesComponentComponent } from './sidebar/hosted-services-component/hosted-services-component.component';
import { SocialMediaComponentComponent } from './social-media-component/social-media-component.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    HostedServicesComponentComponent,
    SocialMediaComponentComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    ParticlesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
