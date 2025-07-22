import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {MainComponent} from "./pages/main/main.component";
import {GalleryComponent} from "./pages/gallery/gallery/gallery.component";
import {ResumeComponent} from "./pages/resume/resume/resume.component";
import {RxtelegramComponent} from "./pages/rxtelegram/rxtelegram.component";
import {DotaidComponent} from "./pages/dotaid/dotaid.component";
import {WhaComponent} from "./pages/wha/wha.component";
import {TerraformComponent} from "./pages/terraform/terraform.component";

const routes: Routes = [
  {path: '', component: MainComponent, title: 'Niklas Weimann'},
  {path: 'gallery', component: GalleryComponent, title: 'Gallery - Niklas Weimann'},
  {path: 'resume', component: ResumeComponent, title: 'Resume - Niklas Weimann'},
  {path: 'rxtelegram', component: RxtelegramComponent, title: 'RxTelegram - Niklas Weimann'},
  {path: 'dotaid', component: DotaidComponent, title: 'DotAid - Niklas Weimann'},
  {path: 'wha', component: WhaComponent, title: 'Wallpaper Creator - Niklas Weimann'},
  {path: 'terraform', component: TerraformComponent, title: 'Terraform Plan Analyzer - Niklas Weimann'},
  {path: '**', component: MainComponent, title: 'Niklas Weimann'}, // fallback route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
