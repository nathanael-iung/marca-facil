import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import {
  trigger,
  transition,
  style,
  query,
  group,
  animate
} from '@angular/animations';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' }), {
          optional: true
        }),
        group([
          query(
            ':enter',
            [
              style({ opacity: 0, transform: 'translateY(20px)' }),
              animate(
                '300ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              )
            ],
            { optional: true }
          ),
          query(
            ':leave',
            [
              style({ opacity: 1, transform: 'translateY(0)' }),
              animate(
                '300ms ease-in',
                style({ opacity: 0, transform: 'translateY(-20px)' })
              )
            ],
            { optional: true }
          )
        ])
      ])
    ])
  ]
})
export class AppComponent {
  title = 'web';

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }

}
