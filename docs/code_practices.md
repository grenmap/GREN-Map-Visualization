# Code practices
This visualization uses consistent patterns for adding features.
This document will explain how to follow those patterns and use the existing features.
To see how these patterns are applied and how to extend existing functionality, please see the [architecture documentation](architecture.md).

## Parts of the application

### Components
A component is a piece of the UI that performs a specific task. For example, the map component displays the map while the drawer component creates a sliding drawer.
For the official documentation, click [here.](https://angular.io/guide/architecture-components)

Components have 3 parts:
 - an html file associated with the structure of the view (template)
 - a scss file that controls the styling for the component (styles)
 - a ts file that controls the logic of the view (controller)

Styles created for one component will only apply in the context of that component. Therefore, if you create a style in a component scss file, you will not be able to reuse that style in annother component. For more generalized styles, look to the 'styles.scss' file in the main src directory.

The controller file is a typescript source file used to control the logic of the component.
The controller should have any logic that is needed to have dynamic functionality that isn't provided by the styles or html.
Controllers should not be doing heavy computations of data or performing complex changes to data that will be reused by other components.

Components should never perform actions such as making network requests or accessing local storage directly.
For tasks like this, create a service or extend an existing one, and then import that service into the component.

### Services
A service is an injectable singleton that provides a specific piece of functionality for the application. For the official documentation, click [here](https://angular.io/guide/architecture-services)

Services may depend on other services, but should never rely on a component.
If sending changes to a component is desired, the service should use a BehaviorSubject provided by the RXJS library(See the later section about how to do this effectively).

## Common patterns and how to follow them

### Data flow
In this project data should come from a couple of services, and then be subscribed to by components that wish to display the state.

For example, lets say we want to display all of the nodes at a specific zoom level. Instead of requesting that data directly from the map, the data should come from a service that requests the appropriate data.

Don't:
```ts
class ExampleComponent {

    constructor(private http: HttpClient) {}

    async getData() {
        let data = await http.get('someurl.com').toPromise();
    }
}
```

Do:

```ts
class ExampleService {

    constructor(private http: HttpClient) {}

    async getData() {
        return await http.get('someurl.com').toPromise();
    }
}
class ExampleComponent {

    constructor(private exampleService: ExampleService) {}

    async getData() {
        let data = await this.exampleService.getData();
    }
}
```

### Reactive code
Sometimes we want our code to redraw part of the ui when a variable has changed. To do this, we need to use a publish/subscribe mechanism.
Angular recommends using the RXJS library, as it is a standard set of tools that provides the ability to make code that reacts to a value being changed.

The structure used in this project is called a [BehaviorSubject](https://www.learnrxjs.io/learn-rxjs/subjects/behaviorsubject).
This structure provides the ability to react to a value being changed, as well as being able to get the most current value that has been set.

Example:

```ts
import { BehaviorSubject } from 'rxjs';

const subject = new BehaviorSubject(123);
subject.subscribe((value) => { console.log(value); }); // Will immediately output 123 to the console
subject.next(456); // The subscriber we registered on the previous line will output 456 to the console
console.log(subject.value); // Will output the last value to the console, which is 456
```

This is very useful, but a precaution needs to be taken. Subscribing to a BehaviorSubject creates a subscription
that will stick around until explicitly unsubscribed.
If a component or service subscribes to a value, it must make sure that it unsubscribes when it is destroyed.

Example:
```ts
class ExampleComponent implements OnInit, OnDestroy{

    exampleSubscription: Subscription;

    constructor(private someService: SomeService) {}

    ngOnInit() {
        this.exampleSubscription = someService.someBehaviorSubject.subscribe(v => console.log(v));
    }

    ngOnDestroy() { this.exampleSubscription.unsubscribe(); }
}
```

This makes sure that when the component is constantly created and destroyed, there aren't any subscriptions left over
calling dead code. If this is not done, you may start to see the performance slow or strange behavior that was not intended.

Templates can also make use of BehaviorSubjects by using the 'async" pipe. This will tell the template to rerender a part of the template
whenever the value changes.

Example:

```ts
class ExampleController {
    constructor(public someService: SomeService) { }
}
```

```html
<ol *ngFor="let user of (someService.users | async)">
    <li>{{user}}</li>
</ol>
```

In the above example, the template is using the async pipe to say that it will redraw the ui whenever the 'users' subject changes.
When the async pipe is used, you don't need to worry about unsubscribing. Angular will handle this for you.
