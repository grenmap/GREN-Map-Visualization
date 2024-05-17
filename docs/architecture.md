# Architecture
This project follows a pattern for how different features are implemented.
When addind new features, please consult this document.

## Visualization data
All data regarding visualization should come from the QueryService.
The query service handles requesting the data from a graphql endpoint and performing any
mutations on the data that are needed to make it more convenient to work with in components or
services that may use it.

Once the data leaves the QueryService, it can not be modified. Attempting to do so will throw a runtime error.
This is to prevent separate parts of the application from modifying data that other parts may rely on.

The Query Service caches the last request for data so that components may access it at any time,
or subscribe to changes in the data.

## Filtering
Filtering capabilities are provided by the FilterService.
This type of filterins is client only, so it does not control what data is recieved from the graphql endpoint.
To control the type of data recieved from graphql, add the functionality to the Query service.

Upon creation, the filter service has an empty filter that doesn't apply any filtering capabilities.

When a filter is set for nodes, links or institutions, the service will grab the cached data from the
Visualization service and then create a list of elements that match the criteria of the new filter.
Once the list of filtered elements is created, it is published to the appropriate subject in the service.
This subject can then be subscribed to to update the visualization with the new filtered data.

When a new set of data is published from the Query Service, the Filter Service will first inspect the data for any fields
that may be important to use when displaying the filter(eg, properties on nodes).
When it finds these fields, they are added to the filter so that they can be displayed to the user to allow them to choose
what they would like to filter by.

## Map State
Arbitrary control of the map is controlled by the MapComponent.

This allows for the ability to request that the map zoom in on a specific point, or target a specific element.

If there are any actions that the map should react to they should be added as a BehaviorSubject that can be subscribed to,
and the map component should implement how to respond to changes in this value. This allows for keeping the
rest of the code in the project non-dependent on the code utilized in the map component.

## Display state
The DisplayService handles creating pop-ups and dispatching display actions to components from other components.
This is useful when we want to perform actions such as showing a loading icon or displaying an error to the user.

Display actions should be added here when the action can be reused by any component or service easily.
For example, the drawer component may want to display an error when it has trouble loading a piece of information.

## Configuration
Configuration of this project is provided through a dependency of GRENMapConfig.
This dependency can be injected into any service or component that uses values that can be configured.

The configuration object is read-only, so attempting to modify it or any of its field members will result in a runtime error.
This is done because there is no way for services or components to react to changes on the configuration at runtime, leading to
the current state of the application not matching the current configuration.

It is possible to make the application responsive to changes to the configuration, however this would require a publish/subscribe
mechanism to be used for everything that uses the configuration, increasing the complexity of the application.
For the moment this is not worth the additional effort, so the object is instead frozen.

