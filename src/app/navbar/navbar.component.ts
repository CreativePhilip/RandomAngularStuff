import {Component, OnInit} from '@angular/core';
import {Router, RouterEvent} from "@angular/router";
import {filter} from "rxjs/operators";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit
{

  currentPathName = ""

  paths = [
    {path: "", name: "Home", icon: "home", color: "primary"},
    {path: "trigonometry-adder", name: "Trigonometry Adder", icon: "functions", color: "accent"},
  ]

  constructor(private router: Router)
  {
  }

  ngOnInit(): void
  {
    this.router.events.pipe(filter(event => event instanceof RouterEvent))
      .subscribe((router: RouterEvent) => {
          const url = router.url.replace("/", "")
          this.currentPathName = this.paths.find(e => e.path === url).name
        })
  }


calculateHeight(toolbar)
{
  const windowHeight = window.innerHeight
  const toolbarHeight = toolbar.offsetHeight
  return `${windowHeight - toolbarHeight}px`
}

}
