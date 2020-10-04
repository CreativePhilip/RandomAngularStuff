import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {TrigAdderComponent} from "./trig-adder/trig-adder.component";


const routes: Routes = [
  { path: "", component: HomeComponent},
  { path: "trigonometry-adder", component: TrigAdderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
