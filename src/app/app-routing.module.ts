import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {MainComponent} from "./pages/main/main.component";
import {GalleryComponent} from "./pages/gallery/gallery/gallery.component";
import {ResumeComponent} from "./pages/resume/resume/resume.component";

const routes: Routes = [
  {path: '', component: MainComponent, title: 'Niklas Weimann'},
  {path: 'gallery', component: GalleryComponent, title: 'Gallery - Niklas Weimann'},
  {path: 'resume', component: ResumeComponent, title: 'Resume - Niklas Weimann'},
  {path: '**', component: MainComponent, title: 'Niklas Weimann'}, // fallback route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
